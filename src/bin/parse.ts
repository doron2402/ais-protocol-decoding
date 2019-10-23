/**
 * Command line for parsing AIS messages
 * pass input as a string
 * for example `node ./dist/bin/parse "!AIVDM,1,1,,A,13u?etPv2;0n:dDPwUM1U1Cb069D,0*24"`
 */

import { Decoder } from '../lib/index';
const input:string = process.argv[2];

// Validate input
if (!input) {
  console.error('Input is required');
  process.exit(1);
}

const aisRawMessages = [input];
const aisDecoder = new Decoder(aisRawMessages);
console.log(aisDecoder.getResults());
