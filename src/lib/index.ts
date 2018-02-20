'use strict'

import { getIntFromPayload, getStringFromPayload } from './helper';


enum Formatter {
	AIVDM = '!AIVDM',
	AIVDO = '!AIVDO'
}

enum VHF_CHANNEL {
	A = 'A',
	B = 'B'
}

enum AIS_TYPE {

}
interface Session {
	formatter: string,
	message_count: number,
	sequence_id: number,
}


// Extract a string from payload [1st bits is index 0]


class Decoder {
	bitarray: Array<number>;
	BITS: number = 6;
	valid: boolean = false;
	payload: string;

	constructor(private _rawMessage){

	}

 	decode(input: string, session?: Session) {
		this.bitarray=[];
    this.valid= false; // will move to 'true' if parsing succeed


    if(Object.prototype.toString.call(input) !== "[object String]") {
			return;
    }

    // split nmea message !AIVDM,1,1,,B,B69>7mh0?J<:>05B0`0e;wq2PHI8,0*3D'
    let nmea = input.split (",");

    // make sure we are facing a supported AIS message
    // AIVDM for standard messages, AIVDO for messages from own ship AIS
    if (nmea[0] !== Formatter.AIVDM && nmea[0] !== Formatter.AIVDO) {
			return;
		}

    // check if buffer (data) exist
    if (!nmea[5]) {
			return;
		}

    // the input string is part of a multipart message, make sure we were
    // passed a session object.
    const message_count:number = Number(nmea[1]);
    const message_id:number = Number(nmea[2]);
    const sequence_id:number = nmea[3] && nmea[3].length > 0 ? Number(nmea[3]) : NaN;

    if(message_count > 1) {
			if(Object.prototype.toString.call(session) !== "[object Object]") {
				console.log(session)
				console.error("A session object is required to maintain state for decoding multipart AIS messages.");
			}

			if(message_id > 1) {
				if(nmea[0] !== session.formatter) {
					console.log ("AisDecode: Sentence does not match formatter of current session");
					return;
				}

				if(session[message_id - 1] === undefined) {
					console.log ("AisDecode: Session is missing prior message part, cannot parse partial AIS message.");
					return;
				}

				if(session.sequence_id !== sequence_id) {
					console.log ("AisDecode: Session IDs do not match. Cannot recontruct AIS message.");
					return;
				}
			} else {
				session = (!session || session === null) ? {} : session;
				session.formatter = nmea[0];
				session.message_count = Number(message_count);
				session.sequence_id = Number(sequence_id);
			}
		}

		// extract binary payload and other usefull information from nmea paquet
    try {
      this.payload = new Buffer(nmea[5]);
    } catch (err) {
       console.log('Error nmea[5]', nmea[5]);
       console.log(err);
    }
		let messageLength: number = this.payload.length;
		const channel = VHF_CHANNEL[nmea[4]]; // vhf channel A/B

    if(message_count > 1) {
        session[message_id] = {
					payload: this.payload,
					length: messageLength
				};

        // Not done building the session
        if(message_id < message_count) {
					return;
				}

        let payloads = [];
        let len = 0;
        for(let i = 1; i <= session.message_count; ++i) {
            payloads.push(session[i].payload);
            len += session[i].length;
        }

        this.payload = Buffer.concat(payloads, len);
        messageLength = this.payload.length;
    }


    // decode printable 6bit AIS/IEC binary format
    for(let i = 0; i < messageLength; i++) {
        let byte = this.payload[i];

        // check byte is not out of range
        if ((byte < 0x30) || (byte > 0x77))  return;
        if ((0x57 < byte) && (byte < 0x60))  return;

        // move from printable char to wacky AIS/IEC 6 bit representation
        byte += 0x28;
        if(byte > 0x80)  byte += 0x20;
        else             byte += 0x28;
        this.bitarray[i]=byte;
    }

    const aistype: number   = getIntFromPayload (0,6);
    this.repeat    = getIntFromPayload (6,2);
    var immsi      = getIntFromPayload (8,30);
	  this.mmsi      = ("000000000" + immsi).slice(-9);



    switch (aistype) {
        case 1:
        case 2:
        case 3: // class A position report
            this.class      = 'A';
            this.navstatus  = getIntFromPayload( 38, 4);
            var lon         = getIntFromPayload(61, 28);
            if (lon & 0x08000000 ) lon |= 0xf0000000;
            lon = parseFloat (lon / 600000);

            var lat = getIntFromPayload(89, 27);
            if( lat & 0x04000000 ) lat |= 0xf8000000;
            lat = parseFloat (lat / 600000);

            if( ( lon <= 180. ) && ( lat <= 90. ) ) {
                this.lon = lon;
                this.lat = lat;
                this.valid = true;
            } else this.valid = false;

            this.sog = parseFloat (0.1 * getIntFromPayload(  50, 10 )); //speed over ground
            this.cog = parseFloat (0.1 * getIntFromPayload( 116, 12));  //course over ground
            this.hdg = parseFloat (getIntFromPayload( 128,  9));        //magnetic heading
            this.utc = getIntFromPayload( 137, 6 );

            break;
        case 18: // class B position report
            this.class  = 'B';
            this.status = -1;  // Class B targets have no status.  Enforce this...
            var lon = getIntFromPayload(57, 28 );
            if (lon & 0x08000000 ) lon |= 0xf0000000;
            lon = parseFloat (lon / 600000);

            var lat = getIntFromPayload(85, 27 );
            if( lat & 0x04000000 ) lat |= 0xf8000000;
            lat = parseFloat (lat / 600000);

            if( ( lon <= 180. ) && ( lat <= 90. ) ) {
                this.lon = lon;
                this.lat = lat;
                this.valid = true;
            } else this.valid = false;

            this.sog = parseFloat (0.1 * getIntFromPayload( 46, 10 )); //speed over ground
            this.cog = parseFloat (0.1 * getIntFromPayload( 112, 12)); //course over ground
            this.hdg = parseFloat (getIntFromPayload( 124,  9));       //magnetic heading
            this.utc = getIntFromPayload( 134, 6 );

            break;
        case 5:
            this.class  = 'A';
//          Get the AIS Version indicator
//          0 = station compliant with Recommendation ITU-R M.1371-1
//          1 = station compliant with Recommendation ITU-R M.1371-3
//          2-3 = station compliant with future editions
            var AIS_version_indicator = getIntFromPayload(38,2);
            if( AIS_version_indicator < 2 ) {
                this.imo = getIntFromPayload(40,30);
                this.callsign    = getStringFromPayload(70,42);
                this.shipname    = getStringFromPayload(112,120);
                this.shiptype       = getIntFromPayload(232,8);
                this.dimA        = getIntFromPayload(240,9);
                this.dimB        = getIntFromPayload(249,9);
                this.dimC        = getIntFromPayload(258,6);
                this.dimD        = getIntFromPayload(264,6);
                this.etaMo       = getIntFromPayload(274,4);
                this.etaDay      = getIntFromPayload(278,5);
                this.etaHr       = getIntFromPayload(283,5);
                this.etaMin      = getIntFromPayload(288,6);
                this.draught     = parseFloat (getIntFromPayload(294, 8 ) / 10.0);
                this.destination = getStringFromPayload(302, 120);
                this.length      = this.dimA + this.dimB;
                this.width       = this.dimC + this.dimD;
                this.valid       = true;
            }

            break;
        case 24:  // Vesel static information
            this.class='B';
            this.part = getIntFromPayload(38, 2 );
            if (0 === this.part ) {
                this.shipname = getStringFromPayload(40, 120);
                this.valid    = true;
            } else if ( this.part === 1) {
                this.shiptype    = getIntFromPayload(40, 8 );
                this.callsign = getStringFromPayload(90, 42);

                this.dimA   = getIntFromPayload(132, 9 );
                this.dimB   = getIntFromPayload(141, 9 );
                this.dimC   = getIntFromPayload(150, 6 );
                this.dimD   = getIntFromPayload(156, 6 );
                this.length = this.dimA + this.dimB;
                this.width  = this.dimC + this.dimD;
                this.valid  = true;
            }
            break;
        case 4: // base station
            this.class      = '-';

            var lon = getIntFromPayload(79, 28);
            if (lon & 0x08000000 ) lon |= 0xf0000000;
            lon = parseFloat (lon / 600000);

            var lat = getIntFromPayload(107, 27);
            if( lat & 0x04000000 ) lat |= 0xf8000000;
            lat = parseFloat (lat / 600000);

            if( ( lon <= 180. ) && ( lat <= 90. ) ) {
                this.lon = lon;
                this.lat = lat;
                this.valid = true;
            } else this.valid = false;
			break;
        case 21: // aid to navigation
            this.class      = '-';

			this.aidtype = getIntFromPayload(38, 5);
			this.shipname = getStringFromPayload(43, 120);

            var lon = getIntFromPayload(164, 28);
            if (lon & 0x08000000 ) lon |= 0xf0000000;
            lon = parseFloat (lon / 600000);

            var lat = getIntFromPayload(192, 27);
            if( lat & 0x04000000 ) lat |= 0xf8000000;
            lat = parseFloat (lat / 600000);

            if( ( lon <= 180. ) && ( lat <= 90. ) ) {
                this.lon = lon;
                this.lat = lat;
                this.valid = true;
            } else this.valid = false;
			break;
        default:
    }
}
