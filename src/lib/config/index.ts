'use strict';

interface StringMapDict { [s: number]: string; }

const NAV_STATUS : Array<string> = require('./navStatus');

const EPFD_TYPE : StringMapDict = require('./epfdType');

const NAVAID_TYPES : StringMapDict = require('./navaidTypes');

const MSG_TYPE : Array<string> = require('./msgType');

const Mooring_Position : Array<string> = require('./mooringPosition');

const VESSEL_TYPE: StringMapDict = require('./vesselType');

const Maneuver_Indicator: Array<string> = require('./maneuverIndicator');

const STATION_INTERVALS: Array<string> = require('./stationIntervals');

export const Precision:number = 4;

export const BITS:number = 6;

export enum Formatter {
	AIVDM = '!AIVDM',
	AIVDO = '!AIVDO',
	GPRMC = '$GPRMC',
	GPGGA = '$GPGGA',
	BSVDM = '!BSVDM',
	ABVDM = '!ABVDM'
}

export enum VHF_CHANNEL {
	A = 'A',
	B = 'B'
}

export enum MESSAGE_PART {
	A = 'A',
	B = 'B'
}


export function getManeuverIndicator(code: number): string {
  return Maneuver_Indicator[code] ?
    Maneuver_Indicator[code] :
    Maneuver_Indicator[0];
};

export function getNavStatus(navStatusCode: number): string {
  return NAV_STATUS[navStatusCode] ?
    NAV_STATUS[navStatusCode] :
    NAV_STATUS[NAV_STATUS.length-1];
}

export function getMessageType(msgTypeCode: number): string {
  return MSG_TYPE[msgTypeCode] ?
    MSG_TYPE[msgTypeCode] :
    MSG_TYPE[0];
}

export function getVesselType(vesselCode: number): string {
  return VESSEL_TYPE[vesselCode] ?
    VESSEL_TYPE[vesselCode] :
    VESSEL_TYPE[0];
}

export function getEPFDType(code: number): string {
  return EPFD_TYPE[code] ? EPFD_TYPE[code] : EPFD_TYPE[0];
}

export function getMooringPosition(code: number): string {
  return Mooring_Position[code] ?
    Mooring_Position[code] :
    Mooring_Position[0];
}

export function getStationInterval(code: number): string {
	return STATION_INTERVALS[code] ?
		STATION_INTERVALS[code] : 'unknown interval';
}

export function getNavAidType(code: number): string {
	return NAVAID_TYPES[code] ? NAVAID_TYPES[code] : NAVAID_TYPES[0];
}