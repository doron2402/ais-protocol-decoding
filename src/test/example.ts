const fs = require('fs');
const path = require('path');

import { Decoder } from '../lib/index';

// const rawMsg:string = process.env.AIS || '!AIVDM,1,1,,A,13u?etPv2;0n:dDPwUM1U1Cb069D,0*24';
// const aisDecoder_ex1 = new Decoder([rawMsg]);

console.log('\n\n______ First Example ______ \n\n');
const FILE_SAMPLE_2 = './fixture/sample3.txt';
const aisArray:Array<string> = fs.readFileSync(path.resolve(__dirname, FILE_SAMPLE_2))
  .toString()
  .split('\n')
  .filter(v => v !== '');

const aisDecoder_ex2 = new Decoder(aisArray);
console.log(aisDecoder_ex2.getResults());

// Second example
console.log('\n\n______ Second Example ______ \n\n');
const msg2:Array<string> = [
  '!AIVDM,1,1,,A,400TcdiuiT7VDR>3nIfr6>i00000,0*78',
  '!AIVDM,2,1,0,A,58wt8Ui`g??r21`7S=:22058<v05Htp000000015>8OA;0sk,0*7B',
  '!AIVDM,2,2,0,A,eQ8823mDm3kP00000000000,2*5D',
  '!AIVDM,2,1,0,A,58wt8Ui`g??r21`7S=:22058<v05Htp000000015>8OA;0sk,0*7B ',
  '!AIVDM,2,2,0,A,eQ8823mDm3kP00000000000,2*5D',
];
const aisDecoder_ex3 = new Decoder(msg2);
console.log(aisDecoder_ex3.getResults());


