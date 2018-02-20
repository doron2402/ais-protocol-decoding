'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function parseIntFromBuffer(bitArray, start, len) {
    var acc = 0;
    var cp, cx, c0, cs;
    for (var i = 0; i < len; i++) {
        acc = acc << 1;
        cp = Math.floor((start + i) / 6);
        cx = bitArray[cp];
        cs = 5 - ((start + i) % 6);
        c0 = (cx >> cs) & 1;
        acc |= c0;
    }
    return acc;
}
exports.parseIntFromBuffer = parseIntFromBuffer;
function parseStringFromBuffer(bitArray, start, len) {
    // TODO: support extended messages
    if (bitArray.length < (start + len) / 6) {
        throw new Error('Extended messages are not implemented');
    }
    var buffer = new Buffer(20);
    var cp;
    var cx;
    var cs;
    var c0;
    var acc, k, i = 0;
    while (i < len) {
        acc = 0;
        for (var j = 0; j < 6; j++) {
            acc = acc << 1;
            cp = Math.floor((start + i) / 6);
            cx = this.bitarray[cp];
            cs = 5 - ((start + i) % 6);
            c0 = (cx >> (5 - ((start + i) % 6))) & 1;
            acc |= c0;
            i++;
        }
        buffer[k] = acc; // opencpn
        if (acc < 0x20) {
            buffer[k] += 0x40;
        }
        else {
            buffer[k] = acc; // opencpn enfoce (acc & 0x3f) ???
        }
        if (buffer[k] === 0x40) {
            break; // name end with '@'
        }
        k++;
    }
    return buffer.toString('utf8', 0, k);
}
exports.parseStringFromBuffer = parseStringFromBuffer;
