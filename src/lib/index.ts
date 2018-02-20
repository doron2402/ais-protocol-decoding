'use strict'

import { getIntFromPayload, getStringFromPayload } from './helper';
import { Formatter, VHF_CHANNEL } from './config';

interface Session {
	formatter: Formatter,
	message_count: number,
	sequence_id: number,
}

export class Decoder {
	bitarray: Array<any>;
	BITS: number = 6;
	valid: boolean = false;
	payload: any;

	constructor(private _rawMessage: string) {
		console.log(_rawMessage);
		this.decode(_rawMessage);
	}

	validateRawMessage(input: string): boolean {
		if(Object.prototype.toString.call(input) !== "[object String]") {
			return false;
		}
		return true;
	}

	/**
	 *
	 * @param input {String}
	 * @param session {Session Object}
	 * @returns AIS parsed Object
	 */
 	decode(input: string, session?: Session): any {
		if (this.validateRawMessage(input) !== true) {
			console.error('input is not valid');
		}

		this.bitarray=[];
    this.valid= false; // will move to 'true' if parsing succeed

    // split nmea message !AIVDM,1,1,,B,B69>7mh0?J<:>05B0`0e;wq2PHI8,0*3D'
    let nmea = input.split (",");

    // make sure we are facing a supported AIS message
    // AIVDM for standard messages, AIVDO for messages from own ship AIS
    if (nmea[0] !== Formatter.AIVDM && nmea[0] !== Formatter.AIVDO) {
			console.error('Unknown Format');
			return;
		}

    // check if buffer (data) exist
    if (!nmea[5]) {
			console.error('Buffer data is not found.');
			return;
		}

    // the input string is part of a multipart message, make sure we were
    // passed a session object.
    const message_count: number = Number(nmea[1]);
    const message_id: number = Number(nmea[2]);
    const sequence_id: number = nmea[3] && nmea[3].length > 0 ? Number(nmea[3]) : NaN;

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
				session = ([undefined, null].indexOf(session) !== -1) ? undefined : session;
				session.formatter = nmea[0] === Formatter.AIVDM ? Formatter.AIVDM : Formatter.AIVDO;
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
		const channel = VHF_CHANNEL[nmea[4]]; // vhf channel A/B

    if(message_count > 1) {
        session[message_id] = {
					payload: this.payload,
					length: this.payload.length
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
    }


    // decode printable 6bit AIS/IEC binary format
    for(let i = 0; i < this.payload.length; i++) {
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
		console.log(this.payload);
		console.log(this.bitarray);
    const aistype: number = getIntFromPayload(this.payload, 0,6);
    const repeat : number = getIntFromPayload(this.payload, 6,2);
    const immsi  : number = getIntFromPayload(this.payload, 8,30);
	  const mmsi	 : string = ("000000000" + immsi).slice(-9);

		console.log({ mmsi, aistype });
	}
}
