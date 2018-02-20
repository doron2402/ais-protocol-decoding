'use strict'

import { BITS, getManeuverIndicator } from './config';

// Extract an integer sign or unsigned from payload
export function getIntFromPayload(bitarray: Array<number>, start: number, len: number): number {
  let acc: number = 0;
  let cp, cx, c0, cs: number;

  for(let i:number = 0 ; i<len ; i++)
  {
    acc  = acc << 1;
    cp = parseInt((start + i) / BITS);
    cx = bitarray[cp];
    cs = 5 - ((start + i) % BITS);
    c0 = (cx >> cs) & 1;
    acc |= c0;
  }
  return Number(acc);
}

export function getStringFromPayload(bitarray: Array<number>, start: number, len: number): string {
  // extended message are not supported
  if (bitarray.length < (start + len) /6) {
    //console.log ("AisDecode: ext msg not implemented GetStr(%d,%d)", start, len);
    return;
  }
  let buffer:any = new Buffer(20);
  let cp: number;
  let cx: number;
  let cs: number;
  let c0: number;
  let acc, k, i, j: number = 0;

  while(i < len) {
    acc=0;

    for(j=0 ; j<6 ; j++)
    {
      acc  = acc << 1;
      cp =  parseInt((start + i) / BITS);
      cx = this.bitarray[cp];
      cs = 5 - ((start + i) % BITS);
      c0 = (cx >> (5 - ((start + i) % BITS))) & 1;
      acc |= c0;
      i++;
    }
    buffer[k] = acc; // opencpn
    if(acc < 0x20) {
      buffer[k] += 0x40;
    }
    else {
      buffer[k] = acc;  // opencpn enfoce (acc & 0x3f) ???
    }
    if (buffer[k] === 0x40) {
      // 0x40 - char: @, hex: 0x40, binary:  0100
      break; // name end with '@'
    }
    k++;
  }
  return (buffer.toString ('utf8',0, k));
}

interface AIS_MESSAGE {
  class: string,
  navstatus: number,
  latitude: number,
  longitude: number,
  valid: boolean,
  sog: number,
  cog: number,
  hdg: number,
  utc: number,
  type: number,
  maneuver_indicator?: string
}

interface LatLngResponse {
  latitude: number,
  longitude: number,
  valid: boolean
}
interface PositionMeta {
  start: number,
  length: number
}


function getLatitudeAndLongitudeMeta(aisType: number): { latitudeMeta: PositionMeta, longitudeMeta: PositionMeta } {
  let latitudeMeta:PositionMeta
  let longitudeMeta:PositionMeta
  if ([1,2,3].indexOf(aisType) !== -1) {
    longitudeMeta = { start: 61, length: 28 };
    latitudeMeta = { start: 89, length: 27 };
  } else if (aisType === 4) {
    longitudeMeta = { start: 79, length: 28 };
    latitudeMeta = { start: 107, length: 27 };
  }
  else if (aisType === 18) {
    longitudeMeta = { start: 57, length: 28 };
    latitudeMeta = { start: 85, length: 27 };
  }
  else if (aisType === 21) {
    longitudeMeta = { start: 164, length: 28 };
    latitudeMeta = { start: 192, length: 27 };
  } else {
    // unknown ais type
    console.error('Cannot fetch latitude and longitude. Unknown ais type');
    longitudeMeta = { start: 61, length: 28 };
    latitudeMeta = { start: 89, length: 27 };
  }
  return { longitudeMeta, latitudeMeta };
}
export function getLatAndLng(bitarray: Array<number>, aisType: number): LatLngResponse {
  /**
   * Longitude is given in in 1/10000 min;
   * divide by 600000.0 to obtain degrees.
   * Values up to plus or minus 180 degrees,
   * East = positive,
   * West \= negative.
   * A value of 181 degrees (0x6791AC0 hex)
   * indicates that longitude is not available and is
   * the default.
   *
   * Latitude is given in in 1/10000 min;
   * divide by 600000.0 to obtain degrees.
   * Values up to plus or minus 90 degrees,
   * North = positive,
   * South = negative.
   * A value of 91 degrees (0x3412140 hex)
   * indicates latitude is not available and is the default.
   *
   */
  const { latitudeMeta, longitudeMeta } = getLatitudeAndLongitudeMeta(aisType);
  let lng = getIntFromPayload(
    bitarray,
    longitudeMeta.start,
    longitudeMeta.length
  );
  if (lng & 0x08000000) {
    lng |= 0xf0000000;
  }
  lng = parseFloat(lng/600000);
  let lat = getIntFromPayload(
    bitarray,
    latitudeMeta.start,
    latitudeMeta.length
  );
  if(lat & 0x04000000) {
    lat |= 0xf8000000;
  }
  lat = parseFloat(lat/600000);
  // Check if valid
  let valid = false;
  if (lng <= 180. && lat <= 90. ) {
    valid = true;
  }
  return {
    latitude: lat,
    longitude: lng,
    valid
  };
}

export function fetchAISByType(aisType: number, bitarray: Array<number>): AIS_MESSAGE {
  if ([1,2,3].indexOf(aisType) !== -1) {
    /**
     *
     * Types 1, 2 and 3: Position Report Class A
     * Type 1, 2 and 3 messages share a common
     * reporting structure for navigational information;
     * we’ll call it the Common Navigation Block (CNB).
     * This is the information most likely to be of
     * interest for decoding software. Total of 168 bits,
     * occupying one AIVDM sentence.
     *
    */

    const aisClass = 'A';
    const navStatus = getIntFromPayload(bitarray, 38, 4);

    // sog - speed over ground
    // Speed over ground is in 0.1-knot resolution
    // from 0 to 102 knots.
    // Value 1023 indicates speed is not available, value 1022 indicates 102.2 knots or higher.
    const _sog: number = getIntFromPayload(bitarray, 50, 10);
    let sog: number = undefined;
    if (!isNaN(_sog) && _sog !== 1023) {
      sog = parseFloat(0.1 * _sog);
    }
    // cog (degree) - course over ground
    // Course over ground will be 3600 (0xE10)
    // if that data is not available.
    const _cog: number = getIntFromPayload(bitarray, 116, 12);
    let cog: number = parseFloat(0.1 * _cog);
    // heading (degree) - True Heading (HDG)
    // 0 to 359 degrees, 511 = not available.
    const _hdg = getIntFromPayload(bitarray, 128, 9);
    let hdg:number;
    if (_hdg !== 511) {
      hdg = parseFloat(_hdg);
    }
    // Second of UTC timestamp
    const utc = getIntFromPayload(bitarray, 137, 6);
    const maneuver_indicator = getManeuverIndicator(parseInt(getIntFromPayload(bitarray, 143, 1)));
    const { latitude, longitude, valid } = getLatAndLng(bitarray, aisType);

    const aisMessage:AIS_MESSAGE = {
      class: aisClass,
      navstatus: navStatus,
      longitude,
      latitude,
      valid,
      sog,
      cog,
      hdg,
      utc,
      type: aisType,
      maneuver_indicator
    };
  }
  else if (aisType === 4) {
    /**
     * Type 4: Base Station Report
     * This message is to be used by fixed-location base stations
     * to periodically report a position and time reference.
     * Total of 168 bits, occupying one AIVDM sentence.
     *
     */

  }
  else if (aisType === 5) {

  }
  else if (aisType === 18) {
    const aisClass  = 'B';
    const navStatus = -1; // Class B targets have no status.  Enforce this...

    const { latitude, longitude, valid } = getLatAndLng(bitarray);

    this.sog = parseFloat (0.1 * getIntFromPayload(bitarray, 46, 10)); //speed over ground
    this.cog = parseFloat (0.1 * getIntFromPayload(bitarray, 112, 12)); //course over ground
    this.hdg = parseFloat(getIntFromPayload(bitarray, 124, 9));       //magnetic heading
    this.utc = getIntFromPayload(bitarray, 134, 6 );
  }
}