"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var index_1 = require("../lib/index");
console.log('\n\n______ First Example ______ \n\n');
var FILE_SAMPLE_2 = './fixture/sample3.txt';
var aisArray = fs.readFileSync(path.resolve(__dirname, FILE_SAMPLE_2))
    .toString()
    .split('\n')
    .filter(function (v) { return v !== ''; });
var aisDecoder_ex2 = new index_1.Decoder(aisArray);
console.log(aisDecoder_ex2.getResults());
console.log('\n\n______ Second Example ______ \n\n');
var msg2 = [
    '!AIVDM,1,1,,A,400TcdiuiT7VDR>3nIfr6>i00000,0*78',
    '!AIVDM,2,1,0,A,58wt8Ui`g??r21`7S=:22058<v05Htp000000015>8OA;0sk,0*7B',
    '!AIVDM,2,2,0,A,eQ8823mDm3kP00000000000,2*5D',
    '!AIVDM,2,1,0,A,58wt8Ui`g??r21`7S=:22058<v05Htp000000015>8OA;0sk,0*7B ',
    '!AIVDM,2,2,0,A,eQ8823mDm3kP00000000000,2*5D',
];
var aisDecoder_ex3 = new index_1.Decoder(msg2);
console.log(aisDecoder_ex3.getResults());
//# sourceMappingURL=example.js.map