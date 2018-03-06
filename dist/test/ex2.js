"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var index_1 = require("../lib/index");
console.log('\n\n______ Example ______ \n\n');
var FILE_SAMPLE = './fixture/sample4.txt';
var aisArray = fs.readFileSync(path.resolve(__dirname, FILE_SAMPLE))
    .toString()
    .split('\\r\\n')
    .filter(function (v) { return v !== ''; });
var aisDecoder = new index_1.Decoder(aisArray);
console.log(aisDecoder.getResults());
//# sourceMappingURL=ex2.js.map