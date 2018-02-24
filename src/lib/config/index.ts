'use strict';

export const Precision:number = 4;
export const BITS:number = 6;

export enum Formatter {
	AIVDM = '!AIVDM',
	AIVDO = '!AIVDO'
}

export enum VHF_CHANNEL {
	A = 'A',
	B = 'B'
}

const EPFD_TYPE = {
  0: 'Undefined',
  1: 'GPS',
  2: 'GLONASS',
  3: 'Combined GPS/GLONASS',
  4: 'Loran-C',
  5: 'Chayka',
  6: 'Integrated navigation system',
  7: 'Surveyed',
  8: 'Galileo'
};

const NAVAID_TYPES = {
	0: 'default', //Type of Aid to Navigation not specified
	1: 'reference point',
	2: 'RACON (radar transponder marking a navigation hazard)',
	3: 'Fixed structure off shore, such as oil platforms, wind farms, rigs',
	4: 'Spare, Reserved for future use.',
	5: 'Light, without sectors',
	6: 'Light, with sectors',
	7: 'Leading Light Front',
	8: 'Leading Light Rear',
	9: 'Beacon, Cardinal N',
	10: 'Beacon, Cardinal E',
	11: 'Beacon, Cardinal S',
	12: 'Beacon, Cardinal W',
	13: 'Beacon, Port hand',
	14: 'Beacon, Starboard hand',
	15: 'Beacon, Preferred Channel port hand',
	16: 'Beacon, Preferred Channel starboard hand',
	17: 'Beacon, Isolated danger',
	18: 'Beacon, Safe water',
	19: 'Beacon, Special mark',
	20: 'Cardinal Mark N',
	21: 'Cardinal Mark E',
	22: 'Cardinal Mark S',
	23: 'Cardinal Mark W',
	24: 'Port hand Mark',
	25: 'Starboard hand Mark',
	26: 'Preferred Channel Port hand',
	27: 'Preferred Channel Starboard hand',
	28: 'Isolated danger',
	29: 'Safe Water',
	30: 'Special Mark',
	31: 'Light Vessel / LANBY / Rigs',
};

const MSG_TYPE = [
	"Unknown",
	"Position Report Class A",
	"Position Report Class A (Assigned schedule)",
	"Position Report Class A (Response to interrogation)",
	"Base Station Report",
	"Static and Voyage Related Data",
	"Binary Addressed Message",
	"Binary Acknowledge",
	"Binary Broadcast Message",
	"Standard SAR Aircraft Position Report",
	"UTC and Date Inquiry",
	"UTC and Date Response",
	"Addressed Safety Related Message",
	"Safety Related Acknowledgement",
	"Safety Related Broadcast Message",
	"Interrogation",
	"Assignment Mode Command",
	"DGNSS Binary Broadcast Message",
	"Standard Class B CS Position Report",
	"Extended Class B Equipment Position Report",
	"Data Link Management",
	"Aid-to-Navigation Report",
	"Channel Management",
	"Group Assignment Command",
	"Static Data Report",
	"Single Slot Binary Message,",
	"Multiple Slot Binary Message With Communications State",
	"Position Report For Long-Range Applications"
];

const NAV_STATUS = [
	"Under way using engine",
	"At anchor",
	"Not under command",
	"Restricted manoeuverability",
	"Constrained by her draught",
	"Moored",
	"Aground",
	"Engaged in Fishing",
	"Under way sailing",
	"Reserved for future amendment of Navigational Status for HSC",
	"Reserved for future amendment of Navigational Status for WIG",
	"Reserved for future use",
	"Reserved for future use",
	"Reserved for future use",
	"AIS-SART is active",
	"Not defined (default)"
];

const Mooring_Position = [
	'Not available',
	'Port-side to',
	'Starboard-side to',
	'Mediterranean (end-on) mooring',
	'Mooring buoy',
	'Anchorage',
	'Reserved for future use',
	'Reserved for future use'
];

const VESSEL_TYPE = {
	0: "Not available (default)",
 // 1-19 Reserved for future usage
 20: "Wing in ground (WIG), all ships of this type",
 21: "Wing in ground (WIG), Hazardous category A",
 22: "Wing in ground (WIG), Hazardous category B",
 23: "Wing in ground (WIG), Hazardous category C",
 24: "Wing in ground (WIG), Hazardous category D",
 25: "Wing in ground (WIG), Reserved for future use",
 26: "Wing in ground (WIG), Reserved for future use",
 27: "Wing in ground (WIG), Reserved for future use",
 28: "Wing in ground (WIG), Reserved for future use",
 29: "Wing in ground (WIG), Reserved for future use",
 30: "Fishing",
 31: "Towing",
 32: "Towing: length exceeds 200m or breadth exceeds 25m",
 33: "Dredging or underwater ops",
 34: "Diving ops",
 35: "Military ops",
 36: "Sailing",
 37: "Pleasure Craft",
 38: "Reserved",
 39: "Reserved",
 40: "High speed craft (HSC), all ships of this type",
 41: "High speed craft (HSC), Hazardous category A",
 42: "High speed craft (HSC), Hazardous category B",
 43: "High speed craft (HSC), Hazardous category C",
 44: "High speed craft (HSC), Hazardous category D",
 45: "High speed craft (HSC), Reserved for future use",
 46: "High speed craft (HSC), Reserved for future use",
 47: "High speed craft (HSC), Reserved for future use",
 48: "High speed craft (HSC), Reserved for future use",
 49: "High speed craft (HSC), No additional information",
 50: "Pilot Vessel",
 51: "Search and Rescue vessel",
 52: "Tug",
 53: "Port Tender",
 54: "Anti-pollution equipment",
 55: "Law Enforcement",
 56: "Spare - Local Vessel",
 57: "Spare - Local Vessel",
 58: "Medical Transport",
 59: "Noncombatant ship according to RR Resolution No. 18",
 60: "Passenger, all ships of this type",
 61: "Passenger, Hazardous category A",
 62: "Passenger, Hazardous category B",
 63: "Passenger, Hazardous category C",
 64: "Passenger, Hazardous category D",
 65: "Passenger, Reserved for future use",
 66: "Passenger, Reserved for future use",
 67: "Passenger, Reserved for future use",
 68: "Passenger, Reserved for future use",
 69: "Passenger, No additional information",
 70: "Cargo, all ships of this type",
 71: "Cargo, Hazardous category A",
 72: "Cargo, Hazardous category B",
 73: "Cargo, Hazardous category C",
 74: "Cargo, Hazardous category D",
 75: "Cargo, Reserved for future use",
 76: "Cargo, Reserved for future use",
 77: "Cargo, Reserved for future use",
 78: "Cargo, Reserved for future use",
 79: "Cargo, No additional information",
 80: "Tanker, all ships of this type",
 81: "Tanker, Hazardous category A",
 82: "Tanker, Hazardous category B",
 83: "Tanker, Hazardous category C",
 84: "Tanker, Hazardous category D",
 85: "Tanker, Reserved for future use",
 86: "Tanker, Reserved for future use",
 87: "Tanker, Reserved for future use",
 88: "Tanker, Reserved for future use",
 89: "Tanker, No additional information",
 90: "Other Type, all ships of this type",
 91: "Other Type, Hazardous category A",
 92: "Other Type, Hazardous category B",
 93: "Other Type, Hazardous category C",
 94: "Other Type, Hazardous category D",
 95: "Other Type, Reserved for future use",
 96: "Other Type, Reserved for future use",
 97: "Other Type, Reserved for future use",
 98: "Other Type, Reserved for future use",
 99: "Other Type, no additional information"
};
const Maneuver_Indicator = [
	'Not available',
	'No special maneuver',
	'Special maneuver'
];

const STATION_INTERVALS = [
	'As given by the autonomous mode',
	'10 Minutes',
	'6 Minutes',
	'3 Minutes',
	'1 Minute',
	'30 Seconds',
	'15 Seconds',
	'10 Seconds',
	'5 Seconds',
	'Next Shorter Reporting Interval',
	'Next Longer Reporting Interval',
	'Reserved for future use',
	'Reserved for future use',
	'Reserved for future use',
	'Reserved for future use',
	'Reserved for future use'
];

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