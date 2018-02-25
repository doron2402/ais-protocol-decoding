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
	fetchDraught,
	fetchDTE,
} from './helper';
import {
	Position_Report_Class_A,
	Standard_Class_B_CS_Position_Report,
	Base_Station_Report,
	Static_Voyage_Related_Data,
	Static_Data_Report
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
	const raim: string = '0';
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
		draught: fetchDraught(bitArray, aisType),
		destination: fetchStringByAttr(bitArray, aisType, 'destination'),
		dte: fetchDTE(bitArray, aisType)
	};
	return report;
}


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
	const raim: string = '0';
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