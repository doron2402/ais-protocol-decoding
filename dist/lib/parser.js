"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitsHelper_1 = require("./bitsHelper");
var helper_1 = require("./helper");
function parsePositionReportClassA(bitArray, aisType, repeat, mmsi) {
    var aisClass = 'A';
    var navStatus = bitsHelper_1.parseIntFromBuffer(bitArray, 38, 4);
    var _a = helper_1.getLatAndLng(bitArray, aisType), latitude = _a.latitude, longitude = _a.longitude, valid = _a.valid;
    var sog = helper_1.fetchSog(bitArray, aisType);
    var rot = helper_1.fetchRateOfTurn(bitArray, aisType);
    var cog = helper_1.fetchCourseOverGround(bitArray, aisType);
    var hdg = helper_1.fetchHeading(bitArray, aisType);
    var status = helper_1.fetchNavigationStatus(bitArray, aisType);
    var accuracy = helper_1.fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
    var utc = 0;
    var maneuver = '0';
    var raim = helper_1.fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0;
    var report = {
        valid: valid,
        repeat: repeat,
        mmsi: mmsi,
        type: aisType,
        status: status,
        cog: cog,
        sog: sog,
        rot: rot,
        hdg: hdg,
        lon: longitude,
        lat: latitude,
        accuracy: accuracy,
        utc: utc,
        maneuver: maneuver,
        raim: raim,
    };
    return report;
}
exports.parsePositionReportClassA = parsePositionReportClassA;
function parseBaseStationReport(bitArray, aisType, repeat, mmsi) {
    var _a = helper_1.getLatAndLng(bitArray, aisType), latitude = _a.latitude, longitude = _a.longitude, valid = _a.valid;
    var _b = helper_1.fetchDateAndTime(bitArray, aisType), year = _b.year, month = _b.month, day = _b.day, hour = _b.hour, minute = _b.minute, second = _b.second;
    var accuracy = helper_1.fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
    var epfd = helper_1.fetchEPFD(bitArray, aisType);
    var report = {
        repeat: repeat,
        mmsi: mmsi,
        type: aisType,
        lon: longitude,
        lat: latitude,
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        accuracy: accuracy,
        epfd: epfd,
    };
    return report;
}
exports.parseBaseStationReport = parseBaseStationReport;
function parseStaticVoyageRelatedData(bitArray, aisType, repeat, mmsi) {
    var ais_version = helper_1.fetchIntByAttr(bitArray, aisType, 'ais_version');
    var epfd = helper_1.fetchEPFD(bitArray, aisType);
    var _a = helper_1.fetchDateAndTime(bitArray, aisType), month = _a.month, day = _a.day, hour = _a.hour, minute = _a.minute;
    var _b = helper_1.getDimensions(bitArray, aisType), to_bow = _b.to_bow, to_port = _b.to_port, to_starboard = _b.to_starboard, to_stern = _b.to_stern;
    var report = {
        repeat: repeat,
        mmsi: mmsi,
        callsign: helper_1.fetchIntByAttr(bitArray, aisType, 'callsign'),
        shipname: helper_1.fetchStringByAttr(bitArray, aisType, 'shipname'),
        shiptype: helper_1.fetchIntByAttr(bitArray, aisType, 'shiptype'),
        imo: helper_1.fetchIntByAttr(bitArray, aisType, 'imo'),
        type: aisType,
        ais_version: ais_version,
        epfd: epfd,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        to_bow: to_bow,
        to_port: to_port,
        to_starboard: to_starboard,
        to_stern: to_stern,
        draught: helper_1.fetchIntByAttr(bitArray, aisType, 'draught'),
        destination: helper_1.fetchStringByAttr(bitArray, aisType, 'destination'),
        dte: helper_1.fetchIntByAttr(bitArray, aisType, 'dte'),
    };
    return report;
}
exports.parseStaticVoyageRelatedData = parseStaticVoyageRelatedData;
function parseBinaryAddressedMessage(bitArray, aisType, repeat, mmsi) {
    return {
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        seqno: helper_1.fetchIntByAttr(bitArray, aisType, 'seqno'),
        dest_mmsi: helper_1.fetchIntByAttr(bitArray, aisType, 'dest_mmsi'),
        retransmit: helper_1.fetchIntByAttr(bitArray, aisType, 'retransmit') === 1 ? 'retransmitted' : 'no retransmit',
        dac: helper_1.fetchIntByAttr(bitArray, aisType, 'dac'),
        fid: helper_1.fetchIntByAttr(bitArray, aisType, 'fid'),
        data: helper_1.fetchStringByAttr(bitArray, aisType, 'data'),
    };
}
exports.parseBinaryAddressedMessage = parseBinaryAddressedMessage;
function parseBinaryAcknowledge(bitArray, aisType, repeat, mmsi) {
    return {
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        mmsi1: helper_1.fetchIntByAttr(bitArray, aisType, 'mmsi1'),
        mmsi2: helper_1.fetchIntByAttr(bitArray, aisType, 'mmsi2'),
        mmsi3: helper_1.fetchIntByAttr(bitArray, aisType, 'mmsi3'),
        mmsi4: helper_1.fetchIntByAttr(bitArray, aisType, 'mmsi4'),
    };
}
exports.parseBinaryAcknowledge = parseBinaryAcknowledge;
function parseBinaryBroadcastMessage(bitArray, aisType, repeat, mmsi) {
    return {
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        dac: helper_1.fetchIntByAttr(bitArray, aisType, 'dac'),
        fid: helper_1.fetchIntByAttr(bitArray, aisType, 'fid'),
        data: helper_1.fetchStringByAttr(bitArray, aisType, 'data'),
    };
}
exports.parseBinaryBroadcastMessage = parseBinaryBroadcastMessage;
function parseStandardSARAircraftPositionReport(bitArray, aisType, repeat, mmsi) {
    var _a = helper_1.getLatAndLng(bitArray, aisType), latitude = _a.latitude, longitude = _a.longitude, valid = _a.valid;
    return {
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        alt: helper_1.fetchIntByAttr(bitArray, aisType, 'alt'),
        accuracy: helper_1.fetchIntByAttr(bitArray, aisType, 'accuracy'),
        lat: latitude,
        lon: longitude,
        valid: valid,
        second: helper_1.fetchIntByAttr(bitArray, aisType, 'second'),
        dte: helper_1.fetchIntByAttr(bitArray, aisType, 'dte'),
        sog: helper_1.fetchSog(bitArray, aisType),
        cog: helper_1.fetchCourseOverGround(bitArray, aisType),
        regional: helper_1.fetchIntByAttr(bitArray, aisType, 'regional'),
        assigned: helper_1.fetchIntByAttr(bitArray, aisType, 'assigned'),
        raim: helper_1.fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0,
        radio: helper_1.fetchIntByAttr(bitArray, aisType, 'radio'),
    };
}
exports.parseStandardSARAircraftPositionReport = parseStandardSARAircraftPositionReport;
function parseSafetyRelatedBroadcastMessage(bitArray, aisType, repeat, mmsi) {
    return {
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        text: helper_1.fetchStringByAttr(bitArray, aisType, 'text'),
    };
}
exports.parseSafetyRelatedBroadcastMessage = parseSafetyRelatedBroadcastMessage;
;
function parseStandardClassBPositionReport(bitArray, aisType, repeat, mmsi) {
    var aisClass = 'B';
    var navStatus = bitsHelper_1.parseIntFromBuffer(bitArray, 38, 4);
    var _a = helper_1.getLatAndLng(bitArray, aisType), latitude = _a.latitude, longitude = _a.longitude, valid = _a.valid;
    var sog = helper_1.fetchSog(bitArray, aisType);
    var rot = helper_1.fetchRateOfTurn(bitArray, aisType);
    var cog = helper_1.fetchCourseOverGround(bitArray, aisType);
    var hdg = helper_1.fetchHeading(bitArray, aisType);
    var accuracy = helper_1.fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
    var utc = 0;
    var maneuver = '0';
    var raim = helper_1.fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0;
    var band = helper_1.fetchIntByAttr(bitArray, aisType, 'band');
    var cs = helper_1.fetchCSUnit(bitArray, aisType);
    var display = helper_1.fetchDisplayFlag(bitArray, aisType);
    var report = {
        class: aisClass,
        valid: valid,
        repeat: repeat,
        mmsi: mmsi,
        type: aisType,
        cog: cog,
        sog: sog,
        rot: rot,
        hdg: hdg,
        lon: longitude,
        lat: latitude,
        accuracy: accuracy,
        utc: utc,
        maneuver: maneuver,
        raim: raim,
        cs: cs,
        display: display
    };
    return report;
}
exports.parseStandardClassBPositionReport = parseStandardClassBPositionReport;
function parserExtendedClassBCSPositionReport(bitArray, aisType, repeat, mmsi) {
    var _a = helper_1.getLatAndLng(bitArray, aisType), latitude = _a.latitude, longitude = _a.longitude, valid = _a.valid;
    var _b = helper_1.getDimensions(bitArray, aisType), to_bow = _b.to_bow, to_port = _b.to_port, to_starboard = _b.to_starboard, to_stern = _b.to_stern;
    return {
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        reserved: helper_1.fetchIntByAttr(bitArray, aisType, 'reserved'),
        sog: helper_1.fetchSog(bitArray, aisType),
        accuracy: helper_1.fetchIntByAttr(bitArray, aisType, 'accuracy'),
        lon: longitude,
        lat: latitude,
        valid: valid,
        cog: helper_1.fetchCourseOverGround(bitArray, aisType),
        hdg: helper_1.fetchHeading(bitArray, aisType),
        utc: helper_1.fetchIntByAttr(bitArray, aisType, 'utc'),
        shipname: helper_1.fetchStringByAttr(bitArray, aisType, 'shipname'),
        shiptype: helper_1.fetchIntByAttr(bitArray, aisType, 'shiptype'),
        epfd: helper_1.fetchEPFD(bitArray, aisType),
        to_bow: to_bow,
        to_port: to_port,
        to_starboard: to_starboard,
        to_stern: to_stern
    };
}
exports.parserExtendedClassBCSPositionReport = parserExtendedClassBCSPositionReport;
function parseAidNavigationReport(bitArray, aisType, repeat, mmsi) {
    var _a = helper_1.getDimensions(bitArray, aisType), to_bow = _a.to_bow, to_port = _a.to_port, to_starboard = _a.to_starboard, to_stern = _a.to_stern;
    var _b = helper_1.getLatAndLng(bitArray, aisType), latitude = _b.latitude, longitude = _b.longitude, valid = _b.valid;
    return {
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        aid_type: helper_1.fetchAidType(bitArray, aisType),
        name: helper_1.fetchStringByAttr(bitArray, aisType, 'name'),
        accuracy: helper_1.fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0,
        lon: longitude,
        lat: latitude,
        valid: valid,
        to_bow: to_bow,
        to_port: to_port,
        to_starboard: to_starboard,
        to_stern: to_stern,
        epfd: helper_1.fetchEPFD(bitArray, aisType),
        second: helper_1.fetchIntByAttr(bitArray, aisType, 'second'),
        off_position: helper_1.fetchIntByAttr(bitArray, aisType, 'off_position'),
        regional: helper_1.fetchIntByAttr(bitArray, aisType, 'regional'),
        assigned: helper_1.fetchIntByAttr(bitArray, aisType, 'assigned'),
        raim: helper_1.fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0,
        virtual_aid: helper_1.fetchIntByAttr(bitArray, aisType, 'virtual_aid') === 1 ? 1 : 0,
    };
}
exports.parseAidNavigationReport = parseAidNavigationReport;
function parseStaticDataReport(bitArray, aisType, repeat, part, mmsi) {
    if (part === 'A') {
        return {
            type: aisType,
            repeat: repeat,
            mmsi: mmsi,
            partno: helper_1.fetchIntByAttr(bitArray, aisType, 'partno'),
            shipname: helper_1.fetchStringByAttr(bitArray, aisType, 'shipname')
        };
    }
    else {
        var _a = helper_1.getDimensions(bitArray, aisType), to_bow = _a.to_bow, to_port = _a.to_port, to_starboard = _a.to_starboard, to_stern = _a.to_stern;
        return {
            type: aisType,
            repeat: repeat,
            mmsi: mmsi,
            shiptype: helper_1.fetchIntByAttr(bitArray, aisType, 'shiptype'),
            vendorid: helper_1.fetchIntByAttr(bitArray, aisType, 'vendorid'),
            model: helper_1.fetchIntByAttr(bitArray, aisType, 'model'),
            serial: helper_1.fetchIntByAttr(bitArray, aisType, 'serial'),
            callsign: helper_1.fetchIntByAttr(bitArray, aisType, 'callsign'),
            to_bow: to_bow,
            to_port: to_port,
            to_starboard: to_starboard,
            to_stern: to_stern,
            mothership_mmsi: String(helper_1.fetchIntByAttr(bitArray, aisType, 'mothership_mmsi')),
        };
    }
}
exports.parseStaticDataReport = parseStaticDataReport;
function parseLongRangeAISBroadcastMessage(bitArray, aisType, repeat, mmsi) {
    var accuracy = helper_1.fetchIntByAttr(bitArray, aisType, 'accuracy') === 1 ? 1 : 0;
    var raim = helper_1.fetchIntByAttr(bitArray, aisType, 'raim') === 1 ? 1 : 0;
    var status = helper_1.fetchNavigationStatus(bitArray, aisType);
    var _a = helper_1.fetchLatitudeAndLongitude10Deg(bitArray, aisType), latitude = _a.latitude, longitude = _a.longitude, valid = _a.valid;
    var gnss = helper_1.fetchIntByAttr(bitArray, aisType, 'gnss') === 0 ? 0 : 1;
    return {
        valid: valid,
        type: aisType,
        repeat: repeat,
        mmsi: mmsi,
        accuracy: accuracy,
        raim: raim,
        status: status,
        lon: longitude,
        lat: latitude,
        sog: helper_1.fetchSog(bitArray, aisType),
        cog: helper_1.fetchCourseOverGround(bitArray, aisType),
        gnss: gnss
    };
}
exports.parseLongRangeAISBroadcastMessage = parseLongRangeAISBroadcastMessage;
var minutesToDecimals = function (lat) {
    var deg = parseInt(String(lat[0] / 100)) || 0;
    var min = lat[0] - (deg * 100);
    var decimal = deg + (min / 60);
    var cardinalDirection = lat[1];
    if (['S', 'W'].indexOf(cardinalDirection) !== -1) {
        return decimal * -1;
    }
    return decimal;
};
var nmeaParseDay = function (date) {
    var now = new Date();
    if (date === undefined) {
        return now.getTime();
    }
    var day = Number(date.substring(4, 6));
    var month = Number(String(Number(date.substring(2, 4)) - 1));
    var year = Number(String(now.getFullYear()).substring(0, 2) + date.substring(0, 2));
    var hour = Number(date.substring(0, 2));
    var minute = Number(date.substring(2, 4));
    var second = Number(date.substring(4, 6));
    return Date.UTC(year, month, day, hour, minute, second);
};
function parseGPRMC(nmea) {
    var _sog = parseFloat(nmea[7]) || 0;
    var result = {
        valid: true,
        mmsi: 0,
        cmd: 2,
        time: nmea[1],
        lat: minutesToDecimals([nmea[3], nmea[4]]),
        lon: minutesToDecimals([nmea[5], nmea[6]]),
        sog: parseInt(String(((_sog * 1853) / 360) / 10)),
        cog: parseFloat(nmea[8]) || 0,
        day: nmeaParseDay(nmea[9]),
        alt: parseFloat(nmea[10]) || 0
    };
    if (nmea[2] !== 'A') {
        result.valid = false;
    }
    return result;
}
exports.parseGPRMC = parseGPRMC;
function parseGPGGA(nmea) {
    var _sog = parseFloat(nmea[7]) || 0;
    var result = {
        mmsi: 0,
        cmd: 2,
        time: nmea[1],
        lat: minutesToDecimals([nmea[2], nmea[3]]),
        lon: minutesToDecimals([nmea[4], nmea[5]]),
        valid: nmea[6],
        sog: parseInt(String(((_sog * 1853) / 360) / 10)),
        cog: parseFloat(nmea[8]) || 0,
        alt: parseFloat(nmea[9]) || 0
    };
    return result;
}
exports.parseGPGGA = parseGPGGA;
//# sourceMappingURL=parser.js.map