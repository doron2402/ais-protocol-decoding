"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var index_1 = require("../lib/index");
console.log('\n\n______ First Example ______ \n\n');
var msg2 = [
    '$GPGGA,064036.289,4836.5375,N,00740.9373,E,1,04,3.2,200.2,M,,,,0000*0E',
    '$GPRMC,225446.00,A,4916.45,N,12311.12,W,000.5,054.7,191194,020.3,E*68'
];
var aisDecoder_ex3 = new index_1.Decoder(msg2);
console.log(aisDecoder_ex3.getResults());
//# sourceMappingURL=nmea.js.map