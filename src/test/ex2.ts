const fs = require('fs');
const path = require('path');

import { Decoder } from '../lib/index';

console.log('\n\n______ Example ______ \n\n');
const FILE_SAMPLE = './fixture/sample4.txt';
const aisArray:Array<string> = fs.readFileSync(path.resolve(__dirname, FILE_SAMPLE))
  .toString()
  .split('\\r\\n')
  .filter(v => v !== '');

const aisDecoder = new Decoder(aisArray);
console.log(aisDecoder.getResults());
