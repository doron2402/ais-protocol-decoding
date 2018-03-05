'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var attributes_1 = require("./config/attributes");
var bitsHelper_1 = require("./bitsHelper");
function fetchIntByAttr(bitArray, aisType, attr) {
    var meta = attributes_1.getMetaDataForAttributeByReport(aisType)[attr];
    if (!meta || !meta.len || !meta.index) {
        console.log("Cannot find meta for aisType: " + aisType + ", attribute: " + attr);
        return 0;
    }
    return bitsHelper_1.parseIntFromBuffer(bitArray, meta.index, meta.len);
}
exports.fetchIntByAttr = fetchIntByAttr;
function fetchStringByAttr(bitArray, aisType, attr) {
    var meta = attributes_1.getMetaDataForAttributeByReport(aisType)[attr];
    if (!meta || !meta.len || !meta.index) {
        console.log("Cannot find meta for aisType: " + aisType + ", attribute: " + attr);
        return '_';
    }
    return bitsHelper_1.parseStringFromBuffer(bitArray, meta.index, meta.len);
}
exports.fetchStringByAttr = fetchStringByAttr;
function getDimensions(bitArray, aisType) {
    return {
        to_bow: fetchIntByAttr(bitArray, aisType, 'to_bow'),
        to_stern: fetchIntByAttr(bitArray, aisType, 'to_stern'),
        to_port: fetchIntByAttr(bitArray, aisType, 'to_port'),
        to_starboard: fetchIntByAttr(bitArray, aisType, 'to_starboard'),
    };
}
exports.getDimensions = getDimensions;
function decodePayloadToBitArray(input) {
    var bitarray = [];
    for (var i = 0; i < input.length; i++) {
        var byte = input[i];
        if ((byte < 0x30) || (byte > 0x77)) {
            return;
        }
        if ((0x57 < byte) && (byte < 0x60)) {
            return;
        }
        byte += 0x28;
        if (byte > 0x80) {
            byte += 0x20;
        }
        else {
            byte += 0x28;
        }
        bitarray[i] = byte;
    }
    return bitarray;
}
exports.decodePayloadToBitArray = decodePayloadToBitArray;
function getLatAndLng(bitArray, aisType) {
    var lon = fetchIntByAttr(bitArray, aisType, 'lon');
    if (lon & 0x08000000) {
        lon |= 0xf0000000;
    }
    lon = parseFloat(String(lon / 600000));
    var lat = fetchIntByAttr(bitArray, aisType, 'lat');
    if (lat & 0x04000000) {
        lat |= 0xf8000000;
    }
    lat = parseFloat(String(lat / 600000));
    var valid = false;
    if (lon <= 180. && lat <= 90.) {
        valid = true;
    }
    return {
        latitude: lat,
        longitude: lon,
        valid: valid
    };
}
exports.getLatAndLng = getLatAndLng;
function fetchLatitudeAndLongitude10Deg(bitArray, aisType) {
    var lon = fetchIntByAttr(bitArray, aisType, 'lon');
    if (lon & 0x08000000) {
        lon |= 0xf0000000;
    }
    lon = parseFloat(String(lon / 1100));
    var lat = fetchIntByAttr(bitArray, aisType, 'lat');
    if (lat & 0x04000000) {
        lat |= 0xf8000000;
    }
    lat = parseFloat(String(lat / (600)));
    var valid = true;
    if (lon > 180.) {
        valid = false;
        lon = null;
    }
    if (lat > 90.) {
        valid = false;
        lat = null;
    }
    return {
        latitude: lat,
        longitude: lon,
        valid: valid
    };
}
exports.fetchLatitudeAndLongitude10Deg = fetchLatitudeAndLongitude10Deg;
function fetchSog(bitArray, aisType) {
    var meta = attributes_1.getMetaDataForAttributeByReport(aisType)['sog'];
    var sog = undefined;
    try {
        var _sog = fetchIntByAttr(bitArray, aisType, 'sog');
        if (!isNaN(_sog) && _sog !== 1023) {
            sog = Number(parseFloat(String(0.1 * _sog)).toFixed(config_1.Precision));
        }
    }
    catch (err) {
        console.error(err);
    }
    return sog;
}
exports.fetchSog = fetchSog;
function fetchRateOfTurn(bitArray, aisType) {
    var rot = undefined;
    var _rot = fetchIntByAttr(bitArray, aisType, 'rot');
    var rotDirection = 1.0;
    if (_rot === 128) {
        _rot = -128;
    }
    else if ((_rot & 0x80) === 0x80) {
        _rot = _rot - 256;
        rotDirection = -1.0;
    }
    return Number((rotDirection * Math.pow((_rot / 4.733), 2)).toFixed(1));
}
exports.fetchRateOfTurn = fetchRateOfTurn;
function fetchCourseOverGround(bitArray, aisType) {
    var cog = fetchIntByAttr(bitArray, aisType, 'cog');
    return cog === 3600 ?
        undefined :
        Number(parseFloat(String(0.1 * cog)).toFixed(config_1.Precision));
}
exports.fetchCourseOverGround = fetchCourseOverGround;
function fetchHeading(bitArray, aisType) {
    var hdg = fetchIntByAttr(bitArray, aisType, 'hdg');
    return hdg === 511 ?
        undefined :
        Number(parseFloat(String(hdg)).toFixed(config_1.Precision));
}
exports.fetchHeading = fetchHeading;
function fetchNavigationStatus(bitArray, aisType) {
    var meta = attributes_1.getMetaDataForAttributeByReport(aisType)['status'];
    var statusCode = bitsHelper_1.parseIntFromBuffer(bitArray, meta.index, meta.len);
    return config_1.getNavStatus(statusCode);
}
exports.fetchNavigationStatus = fetchNavigationStatus;
function fetchCSUnit(bitArray, aisType) {
    var meta = attributes_1.getMetaDataForAttributeByReport(aisType)['cs'];
    var cs = bitsHelper_1.parseIntFromBuffer(bitArray, meta.index, meta.len);
    return cs;
}
exports.fetchCSUnit = fetchCSUnit;
function fetchDisplayFlag(bitArray, aisType) {
    var meta = attributes_1.getMetaDataForAttributeByReport(aisType)['display'];
    var display = bitsHelper_1.parseIntFromBuffer(bitArray, meta.index, meta.len);
    return display;
}
exports.fetchDisplayFlag = fetchDisplayFlag;
function fetchDateAndTime(bitArray, aisType) {
    var year = 0;
    var month = 0;
    var day = 0;
    var hour = 0;
    var minute = 0;
    var second = 0;
    if (([5, 4]).indexOf(aisType) !== -1) {
        month = fetchIntByAttr(bitArray, aisType, 'month');
        day = fetchIntByAttr(bitArray, aisType, 'day');
        hour = fetchIntByAttr(bitArray, aisType, 'hour');
        minute = fetchIntByAttr(bitArray, aisType, 'minute');
    }
    if ([4].indexOf(aisType) !== -1) {
        year = fetchIntByAttr(bitArray, aisType, 'year');
        second = fetchIntByAttr(bitArray, aisType, 'second');
    }
    return { year: year, month: month, day: day, hour: hour, minute: minute, second: second };
}
exports.fetchDateAndTime = fetchDateAndTime;
function fetchEPFD(bitArray, aisType) {
    var epfdCode = fetchIntByAttr(bitArray, aisType, 'epfd');
    return config_1.getEPFDType(epfdCode);
}
exports.fetchEPFD = fetchEPFD;
function fetchAidType(bitArray, aisType) {
    var aidTypeCode = fetchIntByAttr(bitArray, aisType, 'aid_type');
    return config_1.getNavAidType(aidTypeCode);
}
exports.fetchAidType = fetchAidType;
//# sourceMappingURL=helper.js.map