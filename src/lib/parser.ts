import {
	parseStringFromBuffer,
	parseIntFromBuffer
} from './bitsHelper';
import {
	fetchIntByAttr,
	fetchStringByAttr,
	getDimensions,
	fetchSog,
	fetchRateOfTurn,
	fetchCourseOverGround,
	fetchHeading,
	getLatAndLng,
	fetchEPFD,
	fetchNavigationStatus,
	fetchCSUnit,
	fetchDisplayFlag,
	fetchDateAndTime,
	fetchLatitudeAndLongitude10Deg,
	fetchAidType
} from './helper';
import {
	Position_Report_Class_A,
	Standard_Class_B_CS_Position_Report,
	Base_Station_Report,
	Static_Voyage_Related_Data,
	Static_Data_Report,
	Binary_Addressed_Message,
	Binary_Acknowledge,
	Long_Range_AIS_Broadcast,
	Binary_Broadcast_Message,
	Standard_SAR_Aircraft_Position_Report,
	Safety_Related_Broadcast_Message,
	Extended_Class_B_CS_Position_Report,
	Aid_Navigation_Report,
	NMEA
} from './interfaces/ais';
import { MESSAGE_PART } from './config';

// Type 1,2,3
export function parsePositionReportClassA(
  bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Position_Report_Class_A {
	const aisClass:string = 'A';
	const navStatus = parseIntFromBuffer(bitArray, 38, 4);
	const { latitude, longitude, valid } = getLatAndLng(bitArray, aisType);
	const sog = fetchSog(bitArray, aisType);
	const rot = fetchRateOfTurn(bitArray, aisType);
	const cog = fetchCourseOverGround(bitArray, aisType);
	const hdg = fetchHeading(bitArray, aisType);
	const status = fetchNavigationStatus(bitArray, aisType);
	const accuracy = fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
	const utc:number = 0;
	const maneuver: string = '0';
	const raim = fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0;
	const report = {
		valid,
		repeat,
		mmsi,
		type: aisType,
		status,
		cog,
		sog,
		rot,
		hdg,
		lon: longitude,
		lat: latitude,
		accuracy,
		utc,
		maneuver,
		raim,
	};
	return report;
}


// Type 4
export function parseBaseStationReport (
	bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Base_Station_Report {
	const { latitude, longitude, valid } = getLatAndLng(bitArray, aisType);
	const { year, month, day, hour, minute, second } = fetchDateAndTime(bitArray, aisType);
	const accuracy = fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
	const epfd = fetchEPFD(bitArray, aisType)
	const report = {
		repeat,
		mmsi,
		type: aisType,
		lon: longitude,
		lat: latitude,
		year,
		month,
		day,
		hour,
		minute,
		second,
		accuracy,
		epfd,
	};
	return report;
}

// Type 5
export function parseStaticVoyageRelatedData(
	bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Static_Voyage_Related_Data {
	const ais_version: number = fetchIntByAttr(bitArray, aisType, 'ais_version');
	const epfd = fetchEPFD(bitArray, aisType);
	const { month, day, hour, minute } = fetchDateAndTime(bitArray, aisType);
	const { to_bow, to_port, to_starboard, to_stern } = getDimensions(bitArray, aisType);
  const report = {
		repeat,
		mmsi,
		callsign: fetchIntByAttr(bitArray, aisType, 'callsign'),
		shipname: fetchStringByAttr(bitArray, aisType, 'shipname'),
		shiptype: fetchStringByAttr(bitArray, aisType, 'shiptype'),
		imo: fetchIntByAttr(bitArray, aisType, 'imo'),
		type: aisType,
		ais_version,
		epfd,
		month,
		day,
		hour,
		minute,
		to_bow,
		to_port,
		to_starboard,
		to_stern,
		draught: fetchIntByAttr(bitArray, aisType, 'draught'),
		destination: fetchStringByAttr(bitArray, aisType, 'destination'),
		dte: fetchIntByAttr(bitArray, aisType, 'dte'),
	};
	return report;
}

// Type 6
export function parseBinaryAddressedMessage(bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Binary_Addressed_Message {
	return {
		type: aisType,
		repeat,
		mmsi,
		seqno: fetchIntByAttr(bitArray, aisType, 'seqno'),
		dest_mmsi: fetchIntByAttr(bitArray, aisType, 'dest_mmsi'),
		retransmit: fetchIntByAttr(bitArray, aisType, 'retransmit') === 1 ? 'retransmitted' : 'no retransmit',
		dac: fetchIntByAttr(bitArray, aisType, 'dac'),
		fid: fetchIntByAttr(bitArray, aisType, 'fid'),
		data: fetchStringByAttr(bitArray, aisType, 'data'),
	}
}

// Type 7
export function parseBinaryAcknowledge(bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Binary_Acknowledge {
	return {
		type: aisType,
		repeat,
		mmsi,
		mmsi1: fetchIntByAttr(bitArray, aisType, 'mmsi1'),
		mmsi2: fetchIntByAttr(bitArray, aisType, 'mmsi2'),
		mmsi3: fetchIntByAttr(bitArray, aisType, 'mmsi3'),
		mmsi4: fetchIntByAttr(bitArray, aisType, 'mmsi4'),
	}
}

// Type 8
export function parseBinaryBroadcastMessage(
	bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Binary_Broadcast_Message {
	return {
		type: aisType,
		repeat,
		mmsi,
		dac: fetchIntByAttr(bitArray, aisType, 'dac'),
		fid: fetchIntByAttr(bitArray, aisType, 'fid'),
		data: fetchStringByAttr(bitArray, aisType, 'data'),
	}
}

// Type 9
export function parseStandardSARAircraftPositionReport (
	bitArray: Array<number>,
  aisType:number,
  repeat: number,
	mmsi: string
): Standard_SAR_Aircraft_Position_Report {
	const { latitude, longitude, valid } = getLatAndLng(bitArray, aisType);
	return {
		type: aisType,
		repeat,
		mmsi,
		alt: fetchIntByAttr(bitArray, aisType, 'alt'),
		accuracy: fetchIntByAttr(bitArray, aisType, 'accuracy'),
		lat: latitude,
		lon: longitude,
		valid,
		second: fetchIntByAttr(bitArray, aisType, 'second'),
		dte: fetchIntByAttr(bitArray, aisType, 'dte'),
		sog: fetchSog(bitArray, aisType),
		cog: fetchCourseOverGround(bitArray, aisType),
		regional: fetchIntByAttr(bitArray, aisType, 'regional'),
		assigned: fetchIntByAttr(bitArray, aisType, 'assigned'),
		raim: fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0,
		radio: fetchIntByAttr(bitArray, aisType, 'radio'),
	}
}

export function parseSafetyRelatedBroadcastMessage(
	bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Safety_Related_Broadcast_Message {
	return {
		type: aisType,
		repeat,
		mmsi,
		text: fetchStringByAttr(bitArray, aisType, 'text'),
	}
};

// Type 18
export function parseStandardClassBPositionReport(
  bitArray: Array<number>,
  aisType:number,
  repeat: number,
  mmsi: string
): Standard_Class_B_CS_Position_Report {
	const aisClass:string = 'B';
	const navStatus = parseIntFromBuffer(bitArray, 38, 4);
	const { latitude, longitude, valid } = getLatAndLng(bitArray, aisType);
	const sog = fetchSog(bitArray, aisType);
	const rot = fetchRateOfTurn(bitArray, aisType);
	const cog = fetchCourseOverGround(bitArray, aisType);
	const hdg = fetchHeading(bitArray, aisType);
	const accuracy = fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
	const utc:number = 0;
	const maneuver: string = '0';
	const raim = fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0;
	const band:number = fetchIntByAttr(bitArray, aisType, 'band');
	const cs:number = fetchCSUnit(bitArray, aisType);
	const display:number = fetchDisplayFlag(bitArray, aisType);
	const report = {
		class: aisClass,
		valid,
		repeat,
		mmsi,
		type: aisType,
		cog,
		sog,
		rot,
		hdg,
		lon: longitude,
		lat: latitude,
		accuracy,
		utc,
		maneuver,
		raim,
		cs,
		display
	};
	return report;
}

// Type 19
export function parserExtendedClassBCSPositionReport(
	bitArray: Array<number>,
  aisType:number,
	repeat: number,
  mmsi: string
): Extended_Class_B_CS_Position_Report {
	const { latitude, longitude, valid } = getLatAndLng(bitArray, aisType);
	const { to_bow, to_port, to_starboard, to_stern } = getDimensions(bitArray, aisType);
	return {
		type: aisType,
		repeat,
		mmsi,
		reserved: fetchIntByAttr(bitArray, aisType, 'reserved'),
		sog: fetchSog(bitArray, aisType),
		accuracy: fetchIntByAttr(bitArray, aisType, 'accuracy'),
		lon: longitude,
		lat: latitude,
		valid,
		cog: fetchCourseOverGround(bitArray, aisType),
		hdg: fetchHeading(bitArray, aisType),
		utc: fetchIntByAttr(bitArray, aisType, 'utc'),
		shipname: fetchStringByAttr(bitArray, aisType, 'shipname'),
		shiptype: fetchStringByAttr(bitArray, aisType, 'shiptype'),
		epfd: fetchEPFD(bitArray, aisType),
		to_bow,
		to_port,
		to_starboard,
		to_stern
	}
}

// type 21
export function parseAidNavigationReport(
	bitArray: Array<number>,
  aisType:number,
	repeat: number,
  mmsi: string
): Aid_Navigation_Report {
	const { to_bow, to_port, to_starboard, to_stern } = getDimensions(bitArray, aisType);
	const { latitude, longitude, valid } = getLatAndLng(bitArray, aisType);
	return {
		type: aisType,
		repeat,
		mmsi,
		aid_type: fetchAidType(bitArray, aisType),
		name: fetchStringByAttr(bitArray, aisType, 'name'),
		accuracy: fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0,
		lon: longitude,
		lat: latitude,
		valid,
		to_bow,
		to_port,
		to_starboard,
		to_stern,
		epfd: fetchEPFD(bitArray, aisType),
		second: fetchIntByAttr(bitArray, aisType, 'second'),
		// The Off-Position Indicator is for floating Aids-to-Navigation only: 0 means on position;
		// 1 means off position. Only valid if UTC second is equal to or below 59.
		off_position: fetchIntByAttr(bitArray, aisType, 'off_position'),
		regional: fetchIntByAttr(bitArray, aisType, 'regional'),
		assigned: fetchIntByAttr(bitArray, aisType, 'assigned'),
		raim: fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0,
		// The Virtual Aid flag is interpreted as follows:
		// 0 = default = real Aid to Navigation at indicated position;
		// 1 = virtual Aid to Navigation simulated by nearby AIS station.
		virtual_aid: fetchIntByAttr(bitArray, aisType, 'virtual_aid') === 1 ? 1 : 0,
	}
}

// Type 24
export function parseStaticDataReport(
  bitArray: Array<number>,
  aisType:number,
	repeat: number,
	part: MESSAGE_PART,
  mmsi: string
): Static_Data_Report {
	if (part === 'A') {
		return {
			type: aisType,
			repeat,
			mmsi,
			partno: fetchIntByAttr(bitArray, aisType, 'partno'),
			shipname: fetchStringByAttr(bitArray, aisType, 'shipname')
		}
	} else {
		const { to_bow, to_port, to_starboard, to_stern } = getDimensions(bitArray, aisType);
		return {
			type: aisType,
			repeat,
			mmsi,
			shiptype: fetchStringByAttr(bitArray, aisType, 'shiptype'),
			vendorid: fetchIntByAttr(bitArray, aisType, 'vendorid'),
			model: fetchIntByAttr(bitArray, aisType, 'model'),
			serial: fetchIntByAttr(bitArray, aisType, 'serial'),
			callsign: fetchIntByAttr(bitArray, aisType, 'callsign'),
			to_bow,
			to_port,
			to_starboard,
			to_stern,
			mothership_mmsi: String(fetchIntByAttr(bitArray, aisType, 'mothership_mmsi')),
		}
	}
}

export function parseLongRangeAISBroadcastMessage(
	bitArray: Array<number>,
  aisType:number,
	repeat: number,
  mmsi: string): Long_Range_AIS_Broadcast {
		const accuracy = fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
		// The RAIM flag indicates whether Receiver Autonomous Integrity Monitoring is being used to check the performance of the EPFD.
		// 0 = RAIM not in use (default), 1 = RAIM in use. See [RAIM] for a detailed description of this flag.
		const raim = fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0;
		const status = fetchNavigationStatus(bitArray, aisType);
		const { latitude, longitude, valid } = fetchLatitudeAndLongitude10Deg(bitArray, aisType);
		// 0 = current GNSS position 1 = not GNSS position (default)
		const gnss = fetchIntByAttr(bitArray, aisType, 'gnss') === 0 ? 0 : 1;
		return {
			valid,
			type: aisType,
			repeat,
			mmsi,
			accuracy,
			raim,
			status,
			lon: longitude,
			lat: latitude,
			sog: fetchSog(bitArray, aisType),
			cog: fetchCourseOverGround(bitArray, aisType),
			gnss
		};
	}

const minutesToDecimals= (lat:Array<any>): number => {
	const deg:number = parseInt(String(lat[0]/100)) || 0;
	const min:number = lat[0] - (deg*100);
	const decimal:number = deg + (min/60);
	const cardinalDirection:string = lat[1];
	if  (['S', 'W'].indexOf(cardinalDirection) !== -1) {
		return decimal * -1;
	}
	return decimal;
};

const nmeaParseDay = (date:string): any => {
	const now = new Date();
	if (date === undefined) {
		return now.getTime(); // return unix (ms)
	}

	const day = Number(date.substring(4,6));
	const month = Number(String(Number(date.substring(2,4))-1)); // january = 0
	const year = Number(String(now.getFullYear()).substring(0,2) + date.substring(0,2));
	const hour = Number(date.substring(0,2));
	const minute = Number(date.substring(2,4));
	const second = Number(date.substring(4,6))
	return Date.UTC(year, month, day, hour, minute, second);
}
export function parseGPRMC(nmea:Array<any>): NMEA {
	const _sog = parseFloat(nmea[7]) || 0;
	const result:NMEA = {
		valid: true,
		mmsi: 0,
		cmd: 2,
		time: nmea[1],
		lat: minutesToDecimals([nmea[3], nmea[4]]),
		lon: minutesToDecimals([nmea[5],nmea[6]]),
		sog: parseInt(String(((_sog * 1853)/360)/10)),
		cog: parseFloat(nmea[8]) || 0,
		day: nmeaParseDay(nmea[9]),
		alt: parseFloat(nmea[10]) || 0
	};

	if (nmea[2] !== 'A') {
		result.valid = false;
	}

	return result;
}
export function parseGPGGA(nmea:Array<any>): NMEA {
	const _sog = parseFloat(nmea[7]) || 0;
	const result:NMEA = {
		mmsi: 0,
		cmd: 2,
		time: nmea[1],
		lat: minutesToDecimals([nmea[2], nmea[3]]),
		lon: minutesToDecimals([nmea[4],nmea[5]]),
		valid: nmea[6],
		sog: parseInt(String(((_sog * 1853)/360)/10)),
		cog: parseFloat(nmea[8]) || 0,
		alt: parseFloat(nmea[9]) || 0
	};

	return result;
}