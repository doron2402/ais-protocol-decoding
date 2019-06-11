'use strict';

export function parseIntFromBuffer(bitArray: Array<number>, start: number, len: number): number {
  let acc = 0;
	let cp:number, cx: number, c0:number, cs:number;
  if (!Array.isArray(bitArray) || bitArray.length === 0) {
    return undefined;
  }
  for(var i=0 ; i<len ; i++) {
    acc  = acc << 1;
    cp = Math.floor((start + i) / 6);
    cx = bitArray[cp];
    cs = 5 - ((start + i) % 6);
    c0 = (cx >> cs) & 1;
    acc |= c0;
  }
	return acc;
}

export function parseStringFromBuffer(bitArray: Array<number>, start: number, len: number): string {
  // TODO: support extended messages
  if (bitArray.length < (start + len) /6) {
    console.log('Extended messages are not fully supported');
  }

  let buffer = new Buffer(20);
  let cp: number;
  let cx: number;
  let cs: number;
  let c0: number;
  let acc:number = 0;
  let k:number = 0;
  let i:number = 0;
  while(i < len) {
    acc=0;
    for(var j=0 ; j < 6 ; j++){
      acc  = acc << 1;
      cp =   Math.floor((start + i) / 6);
      cx = bitArray[cp];
      cs = 5 - ((start + i) % 6);
      c0 = (cx >> cs) & 1;
      acc |= c0;
      i++;
    }
    buffer[k] = acc; // opencpn
    if(acc < 0x20)  {
      buffer[k] += 0x40;
    } else {
      buffer[k] = acc;  // opencpn enfoce (acc & 0x3f) ???
    }
    if (buffer[k] === 0x40) {
      break; // name end with '@'
    }
    k++;
  }
  return buffer.toString('utf8', 0, k);
}
