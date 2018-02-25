'use strict'

import { parseStringFromBuffer, parseIntFromBuffer } from './bitsHelper';
import { decodePayloadToBitArray } from './helper';
import {
	parsePositionReportClassA,
	parseStandardClassBPositionReport,
	parseStaticVoyageRelatedData,
	parseBaseStationReport,
	parseStaticDataReport,
	parseBinaryAddressedMessage,
	parseBinaryAcknowledge,
	parseLongRangeAISBroadcastMessage
} from './parser';

import { Formatter, VHF_CHANNEL, MESSAGE_PART } from './config';

export class Decoder {
	bitarray: Array<any>;
	payload: any;
	valid: boolean;
	results: Array<any> = [];

	constructor(private messages: Array<string>) {
		if (messages.length < 1) {
			throw new Error('input must be an array');
		}
		this.results = [];
		let session:object = {};
		messages.forEach((item) => {
			if (!item || this.validateRawMessage(item) !== true) {
				throw new Error('Input is not valid');
			}
			const nmea = item.split(',');
			const messageFormat:string = nmea[0];
			const messageCounter:number = Number(nmea[1]);
			const currentMessageNumber:number = Number(nmea[2]);
			// make sure we are facing a supported AIS message
			// AIVDM for standard messages, AIVDO for messages from own ship AIS
			if (messageFormat !== Formatter.AIVDM && messageFormat !== Formatter.AIVDO) {
				throw new Error('Unknown format');
			}
			// check if buffer (data) exist
			if (!nmea[5]) {
				throw new Error('Buffer data is not found.');
			}

			// When there's only one message
			// set the session to an empty object
			if (messageCounter < 2) {
				// reset session
				session = {};
			}
			// decode message
			this.decode(nmea, session);
			// compre the total number of message
			// and the current message number
			if (messageCounter === currentMessageNumber) {
				// reset session
				session = {};
			}
		});
		console.log(this.results);
	}

	decode(input: Array<any>, session: any): void {
		this.bitarray=[];
    this.valid= false; // will move to 'true' if parsing succeed
		const messageFormat:string = input[0];
		const messageCounter:number = Number(input[1]);
		const currentMessageNumber:number = Number(input[2]);
		const sequenceId:number = input[3] && input[3].length > 0 ? Number(input[3]) : NaN;
		const channel = VHF_CHANNEL[input[4]]; // vhf channel A/B
		let payload;
    if(messageCounter > 1) {
			if(Object.prototype.toString.call(session) !== "[object Object]") {
				throw new Error("A session object is required to maintain state for decoding multipart AIS messages.");
			}

			if(currentMessageNumber > 1) {
				if(messageFormat !== session.formatter) {
					throw new Error("AisDecode: Sentence does not match formatter of current session");
				}

				if(session[currentMessageNumber - 1] === undefined) {
					throw new Error("AisDecode: Session is missing prior message part, cannot parse partial AIS message.");
				}

				if(session.sequence_id !== sequenceId) {
					throw new Error("AisDecode: Session IDs do not match. Cannot recontruct AIS message.");
				}
			} else {
				session = ([undefined, null].indexOf(session) !== -1) ? undefined : session;
				session.formatter = messageFormat;
				session.message_count = messageCounter;
				session.sequence_id = sequenceId;
			}
		}

		// extract binary payload and other usefull information from nmea paquet
    try {
      payload = new Buffer(input[5]);
    } catch (err) {
			 throw new Error(err);
    }


    if(messageCounter > 1) {
			const length = Number(payload.length);
			session[currentMessageNumber] = { payload, length };

			// Not done building the session
			if(currentMessageNumber < messageCounter) {
				return;
			}

			let payloads = [];
			let len = 0;
			for(let i = 1; i <= session.message_count; ++i) {
					payloads.push(session[i].payload);
					len += session[i].length;
			}

			payload = Buffer.concat(payloads, len);
    }

		this.bitarray = decodePayloadToBitArray(payload);

    const aisType: number = parseIntFromBuffer(this.bitarray, 0,6);
    const repeat : number = parseIntFromBuffer(this.bitarray, 6,2);
    const immsi  : number = parseIntFromBuffer(this.bitarray, 8,30);
		const mmsi	 : string = ("000000000" + immsi).slice(-9);
		let report;
		switch (aisType) {
			case 1:
			case 2:
			case 3:
				report = parsePositionReportClassA(this.bitarray, aisType, repeat, mmsi);
				break;
			case 4:
				report = parseBaseStationReport(this.bitarray, aisType, repeat, mmsi);
				break;
			case 5:
				report = parseStaticVoyageRelatedData(this.bitarray, aisType, repeat, mmsi);
				break;
			case 6:
				report = parseBinaryAddressedMessage(this.bitarray, aisType, repeat, mmsi);
				break;
			case 7:
				report = parseBinaryAcknowledge(this.bitarray, aisType, repeat, mmsi);
				break;
			case 18:
				report = parseStandardClassBPositionReport(this.bitarray, aisType, repeat, mmsi);
				break;
			case 24:
				const part = session.sequence_id === 1 ? MESSAGE_PART.A : MESSAGE_PART.B;
				report = parseStaticDataReport(this.bitarray, aisType, repeat, part, mmsi)
				break;
			case 27:
				report = parseLongRangeAISBroadcastMessage(this.bitarray, aisType, repeat, mmsi);
			default:
				console.log(`Unsupported AIS Type: ${aisType} - ${mmsi}`);
				break;
		}

		this.results.push(report);
	}

	validateRawMessage(input: string): boolean {
		if(Object.prototype.toString.call(input) !== "[object String]") {
			return false;
		}
		return true;
	}

	getResults(): Array<any> {
		return this.results;
	}
}
