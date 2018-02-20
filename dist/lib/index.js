'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var bitsHelper_1 = require("./bitsHelper");
var config_1 = require("./config");
var helper_1 = require("./helper");
var Decoder = /** @class */ (function () {
    function Decoder(_rawMessage) {
        this._rawMessage = _rawMessage;
        console.log(_rawMessage);
        this.decode(_rawMessage);
    }
    Decoder.prototype.validateRawMessage = function (input) {
        if (Object.prototype.toString.call(input) !== "[object String]") {
            return false;
        }
        return true;
    };
    /**
     *
     * @param input {String}
     * @param session {Session Object}
     * @returns AIS parsed Object
     */
    Decoder.prototype.decode = function (input, session) {
        if (this.validateRawMessage(input) !== true) {
            console.error('input is not valid');
        }
        this.bitarray = [];
        this.valid = false; // will move to 'true' if parsing succeed
        // split nmea message !AIVDM,1,1,,B,B69>7mh0?J<:>05B0`0e;wq2PHI8,0*3D'
        var nmea = input.split(",");
        // make sure we are facing a supported AIS message
        // AIVDM for standard messages, AIVDO for messages from own ship AIS
        if (nmea[0] !== config_1.Formatter.AIVDM && nmea[0] !== config_1.Formatter.AIVDO) {
            console.error('Unknown Format');
            return;
        }
        // check if buffer (data) exist
        if (!nmea[5]) {
            console.error('Buffer data is not found.');
            return;
        }
        // the input string is part of a multipart message, make sure we were
        // passed a session object.
        var message_count = Number(nmea[1]);
        var message_id = Number(nmea[2]);
        var sequence_id = nmea[3] && nmea[3].length > 0 ? Number(nmea[3]) : NaN;
        if (message_count > 1) {
            if (Object.prototype.toString.call(session) !== "[object Object]") {
                console.log(session);
                console.error("A session object is required to maintain state for decoding multipart AIS messages.");
            }
            if (message_id > 1) {
                if (nmea[0] !== session.formatter) {
                    console.log("AisDecode: Sentence does not match formatter of current session");
                    return;
                }
                if (session[message_id - 1] === undefined) {
                    console.log("AisDecode: Session is missing prior message part, cannot parse partial AIS message.");
                    return;
                }
                if (session.sequence_id !== sequence_id) {
                    console.log("AisDecode: Session IDs do not match. Cannot recontruct AIS message.");
                    return;
                }
            }
            else {
                session = ([undefined, null].indexOf(session) !== -1) ? undefined : session;
                session.formatter = nmea[0] === config_1.Formatter.AIVDM ? config_1.Formatter.AIVDM : config_1.Formatter.AIVDO;
                session.message_count = Number(message_count);
                session.sequence_id = Number(sequence_id);
            }
        }
        // extract binary payload and other usefull information from nmea paquet
        try {
            this.payload = new Buffer(nmea[5]);
        }
        catch (err) {
            console.log('Error nmea[5]', nmea[5]);
            console.error(err);
            throw new Error(err);
        }
        var channel = config_1.VHF_CHANNEL[nmea[4]]; // vhf channel A/B
        if (message_count > 1) {
            session[message_id] = {
                payload: this.payload,
                length: this.payload.length
            };
            // Not done building the session
            if (message_id < message_count) {
                return;
            }
            var payloads = [];
            var len = 0;
            for (var i = 1; i <= session.message_count; ++i) {
                payloads.push(session[i].payload);
                len += session[i].length;
            }
            this.payload = Buffer.concat(payloads, len);
        }
        this.bitarray = helper_1.decodePayloadToBitArray(this.payload);
        var aisType = bitsHelper_1.parseIntFromBuffer(this.bitarray, 0, 6);
        var repeat = bitsHelper_1.parseIntFromBuffer(this.bitarray, 6, 2);
        var immsi = bitsHelper_1.parseIntFromBuffer(this.bitarray, 8, 30);
        var mmsi = ("000000000" + immsi).slice(-9);
        console.log({ mmsi: mmsi, type: aisType });
        if ([1, 2, 3].indexOf(aisType) !== -1) {
            // parse type 1,2,3 message
            var aisClass = 'A';
            // Navigational status
            var navStatus = bitsHelper_1.parseIntFromBuffer(this.bitarray, 38, 4);
            var _a = helper_1.getLatAndLng(this.bitarray, aisType), latitude = _a.latitude, longitude = _a.longitude, valid = _a.valid;
            this.valid = valid;
            var sog = helper_1.fetchSog(this.bitarray, aisType);
            var rot = helper_1.fetchRateOfTurn(this.bitarray, aisType);
            var cog = helper_1.fetchCourseOverGround(this.bitarray, aisType);
            var hdg = helper_1.fetchHeading(this.bitarray, aisType);
            console.log({
                sog: sog,
                valid: this.valid,
                latitude: latitude,
                longitude: longitude,
                navStatus: navStatus,
                class: aisClass,
                type: aisType,
                rot: rot,
                cog: cog,
                hdg: hdg
            });
        }
        else if (aisType === 18) {
            var sog = helper_1.fetchSog(this.bitarray, aisType);
            console.log({ sog: sog });
        }
        else {
            throw new Error("AIS Type " + aisType + " is not supported");
        }
    };
    return Decoder;
}());
exports.Decoder = Decoder;
