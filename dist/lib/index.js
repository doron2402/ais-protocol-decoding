'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var bitsHelper_1 = require("./bitsHelper");
var helper_1 = require("./helper");
var parser_1 = require("./parser");
var config_1 = require("./config");
var Decoder = (function () {
    function Decoder(messages, safeMode) {
        var _this = this;
        this.messages = messages;
        this.results = [];
        this._safeMode = false;
        this.results = [];
        var session = {};
        this._safeMode = safeMode === true ? true : false;
        if (messages.length < 1) {
            if (this._safeMode !== true) {
                throw new Error('input must be an array');
            }
            return;
        }
        messages.forEach(function (item) {
            if (!item || _this.validateRawMessage(item) !== true) {
                if (_this._safeMode !== true) {
                    throw new Error('Input is not valid');
                }
                return;
            }
            var nmea = item.split(',');
            var messageFormat = nmea[0];
            if (messageFormat === config_1.Formatter.GPRMC || messageFormat === config_1.Formatter.GPGGA) {
                _this.decodeNmea(nmea);
            }
            else if (messageFormat === config_1.Formatter.AIVDM ||
                messageFormat === config_1.Formatter.AIVDO ||
                messageFormat === config_1.Formatter.BSVDM ||
                messageFormat === config_1.Formatter.ABVDM) {
                var messageCounter = Number(nmea[1]);
                var currentMessageNumber = Number(nmea[2]);
                if (!nmea[5]) {
                    if (_this._safeMode !== true) {
                        throw new Error('Buffer data is not found.');
                    }
                    return;
                }
                if (messageCounter < 2) {
                    session = {};
                }
                _this.decodeAIVDM(nmea, session);
                if (messageCounter === currentMessageNumber) {
                    session = {};
                }
            }
            else {
                return;
            }
        });
    }
    Decoder.prototype.decodeNmea = function (input) {
        var res;
        switch (input[0]) {
            case config_1.Formatter.GPRMC:
                res = parser_1.parseGPRMC(input);
                this.valid = res.valid === true;
                if (!!this.valid) {
                    this.results.push(res);
                }
                break;
            case config_1.Formatter.GPGGA:
                res = parser_1.parseGPGGA(input);
                this.valid = res.valid === true;
                if (!!this.valid) {
                    this.results.push(res);
                }
                break;
            default:
                this.valid = false;
        }
        return;
    };
    Decoder.prototype.decodeAIVDM = function (input, session) {
        this.bitarray = [];
        this.valid = false;
        var messageFormat = input[0];
        var messageCounter = Number(input[1]);
        var currentMessageNumber = Number(input[2]);
        var sequenceId = input[3] && input[3].length > 0 ? Number(input[3]) : NaN;
        var channel = config_1.VHF_CHANNEL[input[4]];
        var payload;
        if (messageCounter > 1) {
            if (Object.prototype.toString.call(session) !== "[object Object]") {
                if (this._safeMode !== true) {
                    throw new Error("A session object is required to maintain state for decoding multipart AIS messages.");
                }
                return;
            }
            if (currentMessageNumber > 1) {
                if (messageFormat !== session.formatter) {
                    if (this._safeMode !== true) {
                        throw new Error("AisDecode: Sentence does not match formatter of current session");
                    }
                    return;
                }
                if (session[currentMessageNumber - 1] === undefined) {
                    if (this._safeMode !== true) {
                        throw new Error("AisDecode: Session is missing prior message part, cannot parse partial AIS message.");
                    }
                    return;
                }
                if (session.sequence_id !== sequenceId) {
                    if (this._safeMode !== true) {
                        throw new Error("AisDecode: Session IDs do not match. Cannot recontruct AIS message.");
                    }
                    return;
                }
            }
            else {
                session = ([undefined, null].indexOf(session) !== -1) ? undefined : session;
                session.formatter = messageFormat;
                session.message_count = messageCounter;
                session.sequence_id = sequenceId;
            }
        }
        try {
            payload = new Buffer(input[5]);
        }
        catch (err) {
            if (this._safeMode !== true) {
                throw new Error(err);
            }
            return;
        }
        if (messageCounter > 1) {
            var length_1 = Number(payload.length);
            session[currentMessageNumber] = { payload: payload, length: length_1 };
            if (currentMessageNumber < messageCounter) {
                return;
            }
            var payloads = [];
            var len = 0;
            for (var i = 1; i <= session.message_count; ++i) {
                payloads.push(session[i].payload);
                len += session[i].length;
            }
            payload = Buffer.concat(payloads, len);
        }
        this.bitarray = helper_1.decodePayloadToBitArray(payload);
        var aisType = bitsHelper_1.parseIntFromBuffer(this.bitarray, 0, 6);
        var repeat = bitsHelper_1.parseIntFromBuffer(this.bitarray, 6, 2);
        var immsi = bitsHelper_1.parseIntFromBuffer(this.bitarray, 8, 30);
        var mmsi = ("000000000" + immsi).slice(-9);
        var report;
        switch (aisType) {
            case 1:
            case 2:
            case 3:
                report = parser_1.parsePositionReportClassA(this.bitarray, aisType, repeat, mmsi);
                break;
            case 11:
            case 4:
                report = parser_1.parseBaseStationReport(this.bitarray, aisType, repeat, mmsi);
                break;
            case 5:
                report = parser_1.parseStaticVoyageRelatedData(this.bitarray, aisType, repeat, mmsi);
                break;
            case 6:
                report = parser_1.parseBinaryAddressedMessage(this.bitarray, aisType, repeat, mmsi);
                break;
            case 7:
                report = parser_1.parseBinaryAcknowledge(this.bitarray, aisType, repeat, mmsi);
                break;
            case 8:
                report = parser_1.parseBinaryBroadcastMessage(this.bitarray, aisType, repeat, mmsi);
                break;
            case 9:
                report = parser_1.parseStandardSARAircraftPositionReport(this.bitarray, aisType, repeat, mmsi);
                break;
            case 14:
                report = parser_1.parseSafetyRelatedBroadcastMessage(this.bitarray, aisType, repeat, mmsi);
                break;
            case 18:
                report = parser_1.parseStandardClassBPositionReport(this.bitarray, aisType, repeat, mmsi);
                break;
            case 19:
                report = parser_1.parserExtendedClassBCSPositionReport(this.bitarray, aisType, repeat, mmsi);
                break;
            case 21:
                report = parser_1.parseAidNavigationReport(this.bitarray, aisType, repeat, mmsi);
                break;
            case 24:
                var part = session.sequence_id === 1 ? config_1.MESSAGE_PART.A : config_1.MESSAGE_PART.B;
                report = parser_1.parseStaticDataReport(this.bitarray, aisType, repeat, part, mmsi);
                break;
            case 27:
                report = parser_1.parseLongRangeAISBroadcastMessage(this.bitarray, aisType, repeat, mmsi);
                break;
            default:
                console.error("Unsupported AIS Type: " + aisType + " - " + mmsi);
                break;
        }
        this.results.push(report);
    };
    Decoder.prototype.validateRawMessage = function (input) {
        if (Object.prototype.toString.call(input) !== "[object String]") {
            return false;
        }
        return true;
    };
    Decoder.prototype.getResults = function () {
        return this.results;
    };
    return Decoder;
}());
exports.Decoder = Decoder;
//# sourceMappingURL=index.js.map