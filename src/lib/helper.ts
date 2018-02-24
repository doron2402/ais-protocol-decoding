'use strict'

import {
  getManeuverIndicator,
  Precision,
  getNavStatus,
  getEPFDType,
} from './config';
import { getMetaDataForAttributeByReport } from './config/attributes';
import { parseIntFromBuffer, parseStringFromBuffer } from './bitsHelper';
import { LatLngResponse, DATE_AND_TIME, Dimensions } from './interfaces/ais';

export function fetchIntByAttr(bitArray: Array<number>, aisType:number, attr: string): number {
  const meta = getMetaDataForAttributeByReport(aisType)[attr];
  if (!meta || !meta.len || !meta.index) {
    console.log(`Cannot find meta for aisType: ${aisType}, attribute: ${attr}`);
    return 0;
  }
  return parseIntFromBuffer(bitArray, meta.index, meta.len);
}

export function fetchStringByAttr(bitArray: Array<number>, aisType:number, attr: string): string {
  const meta = getMetaDataForAttributeByReport(aisType)[attr];
  if (!meta.len || !meta.index) {
    console.log(`Cannot find meta for aisType: ${aisType}, attribute: ${attr}`);
    return '_';
  }
  return parseStringFromBuffer(bitArray, meta.index, meta.len);
}

export function getDimensions(bitArray: Array<number>, aisType:number): Dimensions {
  return {
    to_bow: fetchIntByAttr(bitArray, aisType, 'to_bow'),
    to_stern: fetchIntByAttr(bitArray, aisType, 'to_stern'),
    to_port: fetchIntByAttr(bitArray, aisType, 'to_port'),
    to_starboard: fetchIntByAttr(bitArray, aisType, 'to_starboard'),
  };
}

export function decodePayloadToBitArray(input:Array<number>): Array<number> {
  let bitarray = [];
  // decode printable 6bit AIS/IEC binary format
  for(let i = 0; i < input.length; i++) {
    let byte = input[i];

    // check byte is not out of range
    if ((byte < 0x30) || (byte > 0x77)) {
      return;
    }
    if ((0x57 < byte) && (byte < 0x60)) {
      return;
    }

    // move from printable char to wacky AIS/IEC 6 bit representation
    byte += 0x28;
    if(byte > 0x80)  {
      byte += 0x20;
    } else {
      byte += 0x28;
    }
    bitarray[i] = byte;
  }
  return bitarray;
}

export function getLatAndLng(bitArray: Array<number>, aisType: number): LatLngResponse {
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

  let lng = fetchIntByAttr(bitArray, aisType, 'lng');
  if (lng & 0x08000000) {
    lng |= 0xf0000000;
  }
  lng = parseFloat(String(lng/600000));
  let lat = fetchIntByAttr(bitArray, aisType, 'lat');
  if(lat & 0x04000000) {
    lat |= 0xf8000000;
  }
  lat = parseFloat(String(lat/600000));
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

export function fetchSog(bitArray: Array<number>, aisType): number {
  /**
   * Speed over ground is in 0.1-knot resolution from 0 to 102 knots.
   * Value 1023 indicates speed is not available,
   * value 1022 indicates 102.2 knots or higher.
   *
  */
  // sog - speed over ground
  // Speed over ground is in 0.1-knot resolution
  // from 0 to 102 knots.
  // Value 1023 indicates speed is not available, value 1022 indicates 102.2 knots or higher.
  const meta = getMetaDataForAttributeByReport(aisType)['sog'];
  let sog: number = undefined; // sog should be undefined by default
  try {
    const _sog: number = fetchIntByAttr(bitArray, aisType, 'sog');
    if (!isNaN(_sog) && _sog !== 1023) {
      sog = Number(parseFloat(String(0.1 * _sog)).toFixed(Precision));
    }
  } catch (err) {
    throw new Error(err);
  }

  return sog;
}

export function fetchRateOfTurn(bitArray: Array<number>, aisType:number): number {
  /**
   * Turn rate is encoded as follows:
   * 0 = not turning
   * 1…126 = turning right at up to 708 degrees per minute or higher
   * 1…-126 = turning left at up to 708 degrees per minute or higher
   * 127 = turning right at more than 5deg/30s (No TI available)
   * -127 = turning left at more than 5deg/30s (No TI available)
   * 128 (80 hex) indicates no turn information available (default)
   * Values between 0 and 708 degrees/min coded by ROTAIS=4.733 * SQRT(ROTsensor) degrees/min where ROTsensor is the Rate of Turn as input by an external Rate of Turn Indicator. ROTAIS is rounded to the nearest integer value. Thus, to decode the field value, divide by 4.733 and then square it. Sign of the field value should be preserved when squaring it, otherwise the left/right indication will be lost.
   *
  */
  let rot: number = undefined;
  let _rot = fetchIntByAttr(bitArray, aisType, 'rot');
  let rotDirection:number = 1.0;
  if (_rot === 128) {
    _rot = -128;
  } else if ((_rot & 0x80) === 0x80) {
    _rot = _rot - 256;
    rotDirection = -1.0;
  }
  return Number((rotDirection * Math.pow((_rot/ 4.733), 2)).toFixed(1));
}

export function fetchCourseOverGround(bitArray: Array<number>, aisType: number): number {
  /**
   * Relative to true north, to 0.1 degree precision
   * Course over ground in 1/10 = (0-3599). 3600 (E10h) = not available = default. 3 601-4 095 should not be used
   * Course over ground will be 3600 (0xE10) if that data is not available.
   */
  const meta = getMetaDataForAttributeByReport(aisType)['cog'];
  const _cog = parseIntFromBuffer(bitArray, meta.index, meta.len);
  if (_cog === 3600) {
    return undefined;
  }
  const cog = Number(parseFloat(String(0.1 * _cog)).toFixed(Precision));
  return cog;
}

export function fetchHeading(bitArray: Array<number>, aisType: number): number {
  // True Heading (hdg)
  // 0 to 359 degrees, 511 = not available.
  const meta = getMetaDataForAttributeByReport(aisType)['hdg'];
  const _hdg = parseIntFromBuffer(bitArray, meta.index, meta.len);
  if (_hdg === 511) {
    return undefined;
  }
  const hdg = Number(parseFloat(String(0.1 * _hdg)).toFixed(Precision));
  return hdg;
}

export function fetchNavigationStatus(bitArray: Array<number>, aisType: number): string {
  const meta = getMetaDataForAttributeByReport(aisType)['status'];
  const statusCode:number = parseIntFromBuffer(bitArray, meta.index, meta.len);
  return getNavStatus(statusCode);
}

export function fetchCSUnit(bitArray: Array<number>, aisType:number): number {
  // 0=Class B SOTDMA unit
  // 1=Class B CS (Carrier Sense) unit
  const meta = getMetaDataForAttributeByReport(aisType)['cs'];
  const cs:number = parseIntFromBuffer(bitArray, meta.index, meta.len);
  return cs;
}

export function fetchDisplayFlag(bitArray: Array<number>, aisType:number): number {
  // 0=No visual display,
  // 1=Has display, (Probably not reliable).
  const meta = getMetaDataForAttributeByReport(aisType)['display'];
  const display:number = parseIntFromBuffer(bitArray, meta.index, meta.len);
  return display;
}

export function fetchDateAndTime(bitArray: Array<number>, aisType:number): DATE_AND_TIME {
  let year: number = 0;
  let month: number = 0;
  let day: number = 0;
  let hour: number = 0;
  let minute: number = 0;
  let second: number = 0;
  if (([5,4]).indexOf(aisType) !== -1) {
    month = fetchIntByAttr(bitArray, aisType, 'month');
    day = fetchIntByAttr(bitArray, aisType, 'day');
    hour = fetchIntByAttr(bitArray, aisType, 'hour');
    minute = fetchIntByAttr(bitArray, aisType, 'minute');
  }

  if ([4].indexOf(aisType) !== -1) {
    year = fetchIntByAttr(bitArray, aisType, 'year');
    second = fetchIntByAttr(bitArray, aisType, 'second');
  }

  return { year, month, day, hour, minute, second };
}

export function fetchDraught(bitArray: Array<number>, aisType:number): number {
  return fetchIntByAttr(bitArray, aisType, 'draught');
}

export function fetchDTE(bitArray: Array<number>, aisType:number): string {
  return fetchStringByAttr(bitArray, aisType, 'dte');
}

export function fetchEPFD(bitArray: Array<number>, aisType:number): string {
  const epfdCode:number = fetchIntByAttr(bitArray, aisType, 'epfd');
  return getEPFDType(epfdCode);
}