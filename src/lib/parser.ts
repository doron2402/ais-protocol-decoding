import { parseStringFromBuffer, parseIntFromBuffer } from './bitsHelper';
import {
	fetchSog,
	fetchRateOfTurn,
	fetchCourseOverGround,
	fetchHeading,
	getLatAndLng,
	fetchAccuracy,
	fetchNavigationStatus,
	fetchBandFlag,
	fetchCSUnit,
	fetchDisplayFlag,
} from './helper';
import {
	Position_Report_Class_A,
	Standard_Class_B_CS_Position_Report
} from './interfaces/ais';

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
	const accuracy = fetchAccuracy(bitArray, aisType);
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
	const status = fetchNavigationStatus(bitArray, aisType);
	const accuracy = fetchAccuracy(bitArray, aisType);
	const utc:number = 0;
	const maneuver: string = '0';
	const raim: string = '0';
	const band:number = fetchBandFlag(bitArray, aisType);
	const cs:number = fetchCSUnit(bitArray, aisType);
	const display:number = fetchDisplayFlag(bitArray, aisType);
	const report = {
		class: aisClass,
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
		cs,
		display
	};
	return report;
}