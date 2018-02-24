const fs = require('fs');
const path = require('path');

import { Decoder } from '../lib/index';

const rawMsg:string = process.env.AIS || '!AIVDM,1,1,,A,13u?etPv2;0n:dDPwUM1U1Cb069D,0*24';

const aisDecoder_ex1 = new Decoder([rawMsg]);

// Examlpe 2
const FILE_SAMPLE_2 = './fixture/sample2.txt';
const aisArray:Array<string> = fs.readFileSync(path.resolve(__dirname, FILE_SAMPLE_2))
  .toString()
  .split('\n')
  .filter(v => v !== '');

const aisDecoder_ex2 = new Decoder(aisArray);
