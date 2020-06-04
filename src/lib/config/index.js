'use strict';
exports.__esModule = true;
exports.getNavAidType = exports.getStationInterval = exports.getMooringPosition = exports.getEPFDType = exports.getVesselType = exports.getMessageType = exports.getNavStatus = exports.getManeuverIndicator = exports.MESSAGE_PART = exports.VHF_CHANNEL = exports.Formatter = exports.BITS = exports.Precision = void 0;
var NAV_STATUS = require('./navStatus');
var EPFD_TYPE = require('./epfdType');
var NAVAID_TYPES = require('./navaidTypes');
var MSG_TYPE = require('./msgType');
var Mooring_Position = require('./mooringPosition');
var VESSEL_TYPE = require('./vesselType');
var Maneuver_Indicator = require('./maneuverIndicator');
var STATION_INTERVALS = require('./stationIntervals');
exports.Precision = 4;
exports.BITS = 6;
var Formatter;
(function (Formatter) {
    Formatter["AIVDM"] = "!AIVDM";
    Formatter["AIVDO"] = "!AIVDO";
    Formatter["GPRMC"] = "$GPRMC";
    Formatter["GPGGA"] = "$GPGGA";
    Formatter["BSVDM"] = "!BSVDM";
    Formatter["ABVDM"] = "!ABVDM";
})(Formatter = exports.Formatter || (exports.Formatter = {}));
var VHF_CHANNEL;
(function (VHF_CHANNEL) {
    VHF_CHANNEL["A"] = "A";
    VHF_CHANNEL["B"] = "B";
})(VHF_CHANNEL = exports.VHF_CHANNEL || (exports.VHF_CHANNEL = {}));
var MESSAGE_PART;
(function (MESSAGE_PART) {
    MESSAGE_PART["A"] = "A";
    MESSAGE_PART["B"] = "B";
})(MESSAGE_PART = exports.MESSAGE_PART || (exports.MESSAGE_PART = {}));
function getManeuverIndicator(code) {
    return Maneuver_Indicator[code] ?
        Maneuver_Indicator[code] :
        Maneuver_Indicator[0];
}
exports.getManeuverIndicator = getManeuverIndicator;
;
function getNavStatus(navStatusCode) {
    return NAV_STATUS[navStatusCode] ?
        NAV_STATUS[navStatusCode] :
        NAV_STATUS[NAV_STATUS.length - 1];
}
exports.getNavStatus = getNavStatus;
function getMessageType(msgTypeCode) {
    return MSG_TYPE[msgTypeCode] ?
        MSG_TYPE[msgTypeCode] :
        MSG_TYPE[0];
}
exports.getMessageType = getMessageType;
function getVesselType(vesselCode) {
    return VESSEL_TYPE[vesselCode] ?
        VESSEL_TYPE[vesselCode] :
        VESSEL_TYPE[0];
}
exports.getVesselType = getVesselType;
function getEPFDType(code) {
    return EPFD_TYPE[code] ? EPFD_TYPE[code] : EPFD_TYPE[0];
}
exports.getEPFDType = getEPFDType;
function getMooringPosition(code) {
    return Mooring_Position[code] ?
        Mooring_Position[code] :
        Mooring_Position[0];
}
exports.getMooringPosition = getMooringPosition;
function getStationInterval(code) {
    return STATION_INTERVALS[code] ?
        STATION_INTERVALS[code] : 'unknown interval';
}
exports.getStationInterval = getStationInterval;
function getNavAidType(code) {
    return NAVAID_TYPES[code] ? NAVAID_TYPES[code] : NAVAID_TYPES[0];
}
exports.getNavAidType = getNavAidType;
