'use strict'

import { getManeuverIndicator } from './config';
import { parseIntFromBuffer } from './bitsHelper';
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
  let lng = parseIntFromBuffer(
    bitarray,
    longitudeMeta.start,
    longitudeMeta.length
  );
  if (lng & 0x08000000) {
    lng |= 0xf0000000;
  }
  lng = parseFloat(String(lng/600000));
  let lat = parseIntFromBuffer(
    bitarray,
    latitudeMeta.start,
    latitudeMeta.length
  );
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
  const sogIndexLength = {
    1: { index: 50, len: 10 },
    2: { index: 50, len: 10 },
    3: { index: 50, len: 10 },
    18: { index: 46, len: 10 }
  };
  // sog - speed over ground
  // Speed over ground is in 0.1-knot resolution
  // from 0 to 102 knots.
  // Value 1023 indicates speed is not available, value 1022 indicates 102.2 knots or higher.
  let sog: number = undefined;
  try {
    const _sog: number = parseIntFromBuffer(bitArray, sogIndexLength[aisType].index, sogIndexLength[aisType].len);
    if (!isNaN(_sog) && _sog !== 1023) {
      sog = parseFloat(String(0.1 * _sog));
    }
  } catch (err) {

    throw new Error(err);
  }

  return sog;
}

export function fetchRateOfTurn(bitArray: Array<number>, aisType): number {
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
  const RateOfTurnIndexAndLength = {
    1: { index: 42, len: 8 },
    2: { index: 42, len: 8 },
    3: { index: 42, len: 8 },
    18: { index: 46, len: 8 }
  };
  // sog - speed over ground
  // Speed over ground is in 0.1-knot resolution
  // from 0 to 102 knots.
  // Value 1023 indicates speed is not available, value 1022 indicates 102.2 knots or higher.
  let rot: number = undefined;
  try {
    rot =  Math.floor(4.733 * Math.sqrt(Math.floor(parseIntFromBuffer(
      bitArray,
      RateOfTurnIndexAndLength[aisType].index,
      RateOfTurnIndexAndLength[aisType].len
    ))));
  } catch (err) {
    throw new Error(err);
  }

  return rot;
}
