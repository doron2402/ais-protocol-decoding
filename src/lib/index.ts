'use strict'

import { parseStringFromBuffer, parseIntFromBuffer } from './bitsHelper';
import { decodePayloadToBitArray } from './helper';
import {
	parsePositionReportClassA,
	parseStandardClassBPositionReport
} from './parser';

import { Formatter, VHF_CHANNEL } from './config';

export class Decoder {
	bitarray: Array<any>;
	payload: any;
	valid: boolean;
	results: Array<any>;

	constructor(private messages: Array<string>) {
		if (messages.length < 1) {
			return;
		}
		let session:object = {};
		messages.forEach((item) => {
			if (this.validateRawMessage(item) !== true) {
				console.error('input is not valid');
				return;
			}
			const nmea = item.split(',');
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

			const numberOfMessages:number = Number(nmea[1]);
			const CurrentMessage:number = Number(nmea[2]);

			if (numberOfMessages < 2) {
				// reset session
				session = {};
			}
			// decode message

			if (numberOfMessages === CurrentMessage) {
				// reset session
				session = {};
			}
		});
	}

	decoding(input: string, session?: any): any {
		this.bitarray=[];
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
 	decode(input: string, session?: any): any {
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
			 console.error(err);
			 throw new Error(err);
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

		this.bitarray = decodePayloadToBitArray(this.payload);

    const aisType: number = parseIntFromBuffer(this.bitarray, 0,6);
    const repeat : number = parseIntFromBuffer(this.bitarray, 6,2);
    const immsi  : number = parseIntFromBuffer(this.bitarray, 8,30);
		const mmsi	 : string = ("000000000" + immsi).slice(-9);

		if ([1,2,3].indexOf(aisType) !== -1) {
			const report = parsePositionReportClassA(this.bitarray, aisType, repeat, mmsi);
			console.log(report);
			this.results.push(report);
		} else if (aisType === 18) {
			const report = parseStandardClassBPositionReport(this.bitarray, aisType, repeat, mmsi);
			console.log(report);
			this.results.push(report);
		}
		else {
			throw new Error(`AIS Type ${aisType} is not supported`);
		}
	}
}
