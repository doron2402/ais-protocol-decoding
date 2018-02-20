'use strict';

/**
 * Type 1/2/3
 * Type 1, 2 and 3 messages share a common reporting structure
 * for navigational information;
 * we’ll call it the Common Navigation Block (CNB).
 * This is the information most likely to be of
 * interest for decoding software. Total of 168 bits,
 * occupying one AIVDM sentence.
 *
*/
export interface Position_Report_Class_A {
  type: number,
  repeat: number,
  mmsi: number,
  status: string, // navigation status
  rot: number,// Rate of Turn (ROT)
  sog: number,// Speed Over Ground (SOG)
  accuracy: number,
  lon: number,
  lat: number,
  cog: number,
  hdg: number,
  utc: number,
  maneuver: string,
  // The RAIM flag indicates whether
  // Receiver Autonomous Integrity Monitoring
  // is being used to check the performance of the EPFD.
  //  0 = RAIM not in use (default),
  // 1 = RAIM in use.
  // See [RAIM] for a detailed description of this flag.
  raim: string,
  //
  radio: string
}

/**
 * Type 4
 * This message is to be used by fixed-location base
 * stations to periodically report a position and time
 * reference.
 * Total of 168 bits, occupying one AIVDM sentence.
*/
export interface Base_Station_Report {
  type: number,
  repeat: number,
  mmsi: number,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  accuracy: number,
  lon: number,
  lat: number,
  epfd: string
}

/**
 * Type 5
 * Message has a total of 424 bits,
 * occupying two AIVDM sentences.
 * In practice, the information in these
 * fields (especially ETA and destination) is not reliable,
 * as it has to be hand-updated by humans rather than
 * gathered automatically from sensors.
 * Also note that it is fairly common in the wild
 * for this message to have a wrong bit length (420 or 422). Robust decoders should ignore trailing garbage and deal gracefully with a slightly truncated destination field.
*/
export interface Static_Voyage_Related_Data {
  type: number,
  repeat: number,
  mmsi: number,
  ais_version: number,
  imo: number, // IMO ship ID number
  callsign: number, // 7 six-bit characters
  shipname: string, // 20 six-bit characters
  shiptype: string, // See "VESSEL_TYPE in config"
  to_bow: number, //Dimension to Bow (meters)
  to_stern: number, //Dimension to Stern (meters)
  to_port: number, //Dimension to Port (meters)
  to_starboard: number, //Dimension to Starboard (meters)
  epfd: string, // See "EPFD Fix Types"
  month: number, // 1-12, 0=N/A (default)
  day: number, // 1-31, 0=N/A (default)
  hour: number, // 0-23, 24=N/A (default)
  minute: number, // 0-59, 60=N/A (default)
  draught: number, // meters/10
  destination: string, // 20 6-bit characters
  dte: string
}

/**
 * Type 6
 * Message type 6 is an addressed point-to-point message
 * with unspecified binary payload.
 * The St. Lawrence Seaway AIS system,
 * the USG PAWSS system, and the Port Authority of London use this
 * payload for local extension messages.
 * [IMO236] and [IMO289] describe payload use as international
 * extension messages.
 * This type is variable in length up to a maximum of 1008 bits
 * (up to 5 AIVDM sentence payloads).
 *
*/
export interface Binary_Addressed_Message {
  type: number,
  repeat: number,
  mmsi: number,
  seqno: number, // Unsigned integer 0-3
  dest_mmsi: number, // Destination MMSI
  retransmit: number,
  dac: number, // Designated Area Code
  fid: number,
  data: string // Binary data May be shorter than 920 bits.
}

/**
 * Type 7: Binary Acknowledge
 * Message type 7 is a receipt acknowledgement to
 * the senders of a previous messages of type 6.
 * Total length varies between 72 and 168 bits by 32-bit
 * increments, depending on the number of destination
 * MMSIs included.
 */
export interface Binary_Acknowledge {
  type: number,
  repeat: number,
  mmsi: number,
  mmsi1: number,
  mmsi2: number,
  mmsi3: number,
  mmsi4: number
}

/**
 * Type 8: Binary Broadcast Message
 * Message type 8 is a broadcast message with
 * unspecified binary payload.
 * The St. Lawrence Seaway AIS system,
 * the USG PAWSS system, and the Port Authority of
 * London use this payload for local extension messages.
 * [IMO236] and [IMO289] describe payload use as
 * international extension messages.
 * This type is variable in length up to a maximum of
 * 1008 bits (up to 5 AIVDM sentence payloads).
 */
export interface Binary_Broadcast_Message {
  type: number,
  repeat: number,
  mmsi: number,
  dac: number, //Designated Area Code
  fid: number, // Functional ID
  data: string // Binary data, May be shorter than 952 bits.
}

/**
 * Type 9: Standard SAR Aircraft Position Report
 * Tracking information for search-and-rescue aircraft.
 * Total number of bits is 168.
 */
export interface Standard_SAR_Aircraft_Position_Report {
  type: number,
  repeat: number,
  mmsi: number,
  altitude: number,
  sog: number,
  accuracy: number,
  lon: number, // Minutes/10000 (as in CNB)
  lat: number, // Minutes/10000 (as in CNB)
  cog: number, // True bearing, 0.1 degree units
  utc: number, // UTC second.
  dte: number
}

/**
 * Type 10: UTC/Date Inquiry
 * Request for UTC/Date information from an
 * AIS base station.
 * Total number of bits is 72.
 */
export interface UTC_Inquiry {
  type: number,
  repeat: number,
  mmsi: number,
  dest_mmsi: number
}

/**
 * Type 11: UTC/Date Response
 * Identical to message 4, with the semantics
 * of a response to inquiry.
 *
 */

 /**
  * Type 12: Addressed Safety-Related Message
  * This is a point-to-point text message.
  * The payload is interpreted as six-bit text.
  * This message is variable in length up to a maximum
  * of 1008 bits (up to 5 AIVDM sentence payloads).
  */
export interface Addressed_Safety_Related_Message {
  type: number,
  repeat: number,
  mmsi: number,
  seqno: number, //Sequence Number
  dest_mmsi: number,
  retransmit: number, // 0 = no retransmit (default), 1 = retransmitted
  text: string // 1-156 chars of six-bit text. May be shorter than 936 bits.
}
