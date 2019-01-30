'use strict';
/**
 *
 * Referennces:
 *  - AIS Format: http://catb.org/gpsd/AIVDM.html
 *  - OpenCPN AIS: https://github.com/OpenCPN/OpenCPN/blob/master/src/AIS_Decoder.cpp
 *  - Coding Style using TypeScript: https://www.typescriptlang.org
*/
interface Basic_AIS {
  valid?: boolean, //internal boolean value
  type: number,
  repeat: number,
  mmsi: string
}

export interface LatLngResponse {
  latitude: number,
  longitude: number,
  valid: boolean
}

export interface DATE_AND_TIME {
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
}
export  interface LatitudeAndLongitude {
  lon: number,
  lat: number,
}

export interface Dimensions {
  to_bow: number, //Dimension to Bow (meters)
  to_stern: number, //Dimension to Stern (meters)
  to_port: number, //Dimension to Port (meters)
  to_starboard: number //Dimension to Starboard (meters)
}

export interface Navigation {
  sog: number,  // Speed Over Ground (SOG)
  cog: number  // True bearing, 0.1 degree units
}

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
export interface Position_Report_Class_A extends Basic_AIS, LatitudeAndLongitude, Navigation {
  status: string, // navigation status
  rot: number,// Rate of Turn (ROT)
  accuracy: number,
  hdg: number,
  utc: number,
  maneuver: string,
  // The RAIM flag indicates whether
  // Receiver Autonomous Integrity Monitoring
  // is being used to check the performance of the EPFD.
  //  0 = RAIM not in use (default),
  // 1 = RAIM in use.
  // See [RAIM] for a detailed description of this flag.
  raim?: number,
  radio?: string
}

/**
 * Type 4
 * This message is to be used by fixed-location base
 * stations to periodically report a position and time
 * reference.
 * Total of 168 bits, occupying one AIVDM sentence.
*/
export interface Base_Station_Report extends Basic_AIS, LatitudeAndLongitude {
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  accuracy: number,
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
export interface Static_Voyage_Related_Data
extends Basic_AIS, Dimensions {
  ais_version: number,
  imo: number, // IMO ship ID number
  callsign: number, // 7 six-bit characters
  shipname: string, // 20 six-bit characters
  shiptype: number, // See "VESSEL_TYPE in config"
  epfd: string, // See "EPFD Fix Types"
  month: number, // 1-12, 0=N/A (default)
  day: number, // 1-31, 0=N/A (default)
  hour: number, // 0-23, 24=N/A (default)
  minute: number, // 0-59, 60=N/A (default)
  draught: number, // meters/10
  destination: string, // 20 6-bit characters
  dte: number
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
export interface Binary_Addressed_Message extends Basic_AIS {
  seqno: number, // Unsigned integer 0-3
  dest_mmsi: number, // Destination MMSI
  retransmit: string, // 0 = no retransmit (default) 1 = retransmitted
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
export interface Binary_Acknowledge extends Basic_AIS {
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
export interface Binary_Broadcast_Message extends Basic_AIS {
  dac: number, //Designated Area Code
  fid: number, // Functional ID
  data: string // Binary data, May be shorter than 952 bits.
}

/**
 * Type 9: Standard SAR Aircraft Position Report
 * Tracking information for search-and-rescue aircraft.
 * Total number of bits is 168.
 */
export interface Standard_SAR_Aircraft_Position_Report extends Basic_AIS, LatitudeAndLongitude, Navigation {
  alt: number,
  accuracy: number,
  second: number, // UTC second.
  dte: number,
  regional?: number,
  assigned?: number,
  raim?: number, // As for common navigation block (0 or 1)
  radio?: number
}

/**
 * Type 10: UTC/Date Inquiry
 * Request for UTC/Date information from an
 * AIS base station.
 * Total number of bits is 72.
 */
export interface UTC_Inquiry extends Basic_AIS {
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
export interface Addressed_Safety_Related_Message extends Basic_AIS {
  seqno: number, //Sequence Number
  dest_mmsi: number,
  retransmit: number, // 0 = no retransmit (default), 1 = retransmitted
  text: string // 1-156 chars of six-bit text. May be shorter than 936 bits.
}

/**
 * Type 13: Safety-Related Acknowledgement
 * Message type 13 is a receipt acknowledgement to senders
 * of previous messages of type 12.
 * The message layout is identical to a type 7 Binary Acknowledge.
 */

 /**
  * Type 14: Safety-Related Broadcast Message
  * This is a broadcast text message.
  * The payload is interpreted as six-bit text.
  * This message is variable in length up to a maximum of 1008 bits
  * (up to 5 AIVDM sentence payloads).
  */
  export interface Safety_Related_Broadcast_Message extends Basic_AIS {
    text: string
  }

  /**
   * Type 15: Interrogation
   * Message type 15 is used by a base station to query
   * one or two other AIS transceivers for status messages
   * of specified types.
   * "Source MMSI" is the interrogating station.
   * 88-160 bits depending on the number of queries.
   * This message is probably not interesting unless
   * you are doing traffic analysis of information
   * flow in an AIS station network.
   * The "slot offset" members are a request for the
   * response to interrogation to occupy a particular
   * time division in the TDMA packet layer.
   * link: http://catb.org/gpsd/AIVDM.html#_type_15_interrogation
   */
export interface Interrogation extends Basic_AIS {
  mmsi1: number,
  type1_1: number, // First slot offset
  offset1_1: number
  type1_2: number,
  offset1_2: number,
  mmsi2: number, // Interrogated MMSI
  type2_1: number,
  offset2_1: number
}

/**
 * Type 16: Assignment Mode Command
 * Message type 16 is used by a base station with control authority
 * to configure the scheduling of AIS informational messages
 * from subordinate stations, either as a frequency per 10-minute
 * interval or by specifying the TDMA slot(s) o
 * ffset on which those messages should be transmitted.
 * It is probably not of interest unless you are studying the internal
 * operation of an AIS base station network. Length may be 96 or 144 bits.
 *
 */
export interface Assignment_Mode_Command extends Basic_AIS {
  mmsi1: number, //Destination A MMSI
  offset1: number,
  increment1: number,
  mmsi2: number, //Destination B MMSI
  offset2: number,
  increment2: number
}

/**
 * Type 17: DGNSS Broadcast Binary Message
 * Message type 17 is used to broadcast differential corrections for GPS.
 * The data in the payload is intended to be passed directly to GPS
 * receivers capable of accepting such corrections. 80 to 816 bits depending on payload size.
 */
export interface Broadcast_Binary_Message extends Basic_AIS, LatitudeAndLongitude{
  data: string //DGNSS correction data
}

/**
 * Type 18: Standard Class B CS Position Report
 * A less detailed report than types 1-3 for vessels using Class B transmitters.
 * Omits navigational status and rate of turn.
 * Fields are encoded as in the common navigation block. 168 bits total.
 */
export interface Standard_Class_B_CS_Position_Report
extends Basic_AIS, LatitudeAndLongitude, Navigation {
  accuracy: number,
  hdg: number, // 0 to 359 degrees, 511 = N/A
  utc: number, // Second of UTC timestamp.
  cs?: number, // 0=Class B SOTDMA unit 1=Class B CS (Carrier Sense) unit
  display?: number, // 0=No visual display, 1=Has display, (Probably not reliable).
  dsc?: string, // If 1, unit is attached to a VHF voice radio with DSC capability.
  band?: number, // Base stations can command units to switch frequency.
  // If this flag is 1, the unit can use any part of the marine channel.
}

/**
 * Type 19: Extended Class B CS Position Report
 * A slightly more detailed report than type 18 for vessels using Class B transmitters.
 * Omits navigational status and rate of turn.
 * Fields are encoded as in the common navigation block and the Type 5 message.
 * Note that until just before the reserved field at bit 139 this is identical to message 18.
 * 312 bits total.
 * In practice, the information in the ship name and dimension fields is not reliable,
 * as it has to be hand-entered by humans rather than gathered automatically from sensors.
 */
export interface Extended_Class_B_CS_Position_Report
extends Basic_AIS, LatitudeAndLongitude, Dimensions, Navigation {
  accuracy: number,
  hdg: number, // 0 to 359 degrees, 511 = N/A
  utc: number, // Second of UTC timestamp.
  shipname: string,
  shiptype: number,
  epfd: string,
  reserved: number
}

/**
 * Type 20 Data Link Management Message
 * This message is used to pre-allocate TDMA slots within an AIS
 * base station network.
 * It contains no navigational information, and is unlikely to be of
 * interest unless you are implementing or studying an AIS base station network.
 * Length varies from 72-160 depending on the number of slot reservations (1 to 4) in the message.
 */
export interface Data_Link_Management_Message extends Basic_AIS {
  offset1: number,
  number1: number, // Consecutive slots
  timeout1: number, // Allocation timeout in minutes
  increment1: number, // Repeat increment
  offset2: number, // Reserved offset number
  number2: number,
  timeout2: number,
  increment2: number,
  offset3: number, // Reserved offset number
  number3: number,
  timeout3: number,
  increment3: number,
  offset4: number, // Reserved offset number
  number4: number,
  timeout4: number,
  increment4: number
}

/**
 * Type 21: Aid-to-Navigation Report
 * Identification and location message to be emitted by aids to navigation such as buoys and lighthouses.
 * This message is unusual in that it varies in length depending on the presence and size of the Name Extension field.
 * May vary between 272 and 360 bits.
 * According to [IALA], the aid type field has values 1-15 for fixed and 16-31 for floating aids to navigation.
 */
export interface Aid_Navigation_Report
extends Basic_AIS, LatitudeAndLongitude, Dimensions {
  aid_type: string, //See "Navaid Types"
  name: string,
  accuracy: number,
  epfd: string,
  second: number,
  off_position: number, // The Off-Position Indicator is for floating Aids-to-Navigation only:
  // 0 means on position; 1 means off position. Only valid if UTC second is equal to or below 59.
  regional?: number,
  assigned?: number,
  raim?: number,
  // The Virtual Aid flag is interpreted as follows:
  // 0 = default = real Aid to Navigation at indicated position;
  // 1 = virtual Aid to Navigation simulated by nearby AIS station.
  virtual_aid: number
}

/**
 * Type 22: Channel Management
 * This message is broadcast by a competent authority (an AIS network control base station)
 * to set VHF parameters for an AIS coverage region.
 * Length is 168 bits.
 *
 * This message contains no navigational information,
 * and is unlikely to be of interest unless you are implementing or studying an AIS base station network.
 */
export interface Channel_Management extends Basic_AIS {
  channel_a: number,
  channel_b: number,
  txrx: number, //Transmit/receive mode
  power: string, // low=0, high=1
  ne_lon: number,
  ne_lat: number,
  sw_lon: number,
  sw_lat: number,
  dest1: number, // MMSI of destination 1
  dest2: number, // MMSI of destination 2
  addressed: string, // 0=broadcast, 1=addressed.
  band_a: string, //0=Default, 1=12.5kHz
  band_b: string, //0=Default, 1=12.5kHz
  zonesize: number, // Size of transitional zone
}


/**
 * Type 23: Group Assignment Command
 * This message is intended to be broadcast by a competent authority
 * (an AIS network-control base station) to set operational parameters for all
 * mobile stations in an AIS coverage region. Length is 160 bits.
 * This message contains no navigational information,
 * and is unlikely to be of interest unless you are
 * implementing or studying an AIS base station network.
 */
export interface Group_Assignment_Command extends Basic_AIS {
  ne_lon: number,
  ne_lat: number,
  sw_lon: number,
  sw_lat: number,
  station_type: string, // See "Station Types"
  ship_type: string, // see ship_type
  interval: string, // See "Station Intervals"
  quite: string, // 0 = none, 1-15 quiet time in minutes
}

/**
 * Type 24: Static Data Report
 * Equivalent of a Type 5 message for ships using Class B equipment.
 * Also used to associate an MMSI with a name on either class A or class B equipment.
 * A "Type 24" may be in part A or part B format;
 * According to the standard, parts A and B are expected to be broadcast in adjacent pairs;
 * in the real world they may (due to quirks in various aggregation methods)
 * be separated by other sentences or even interleaved with different Type 24 pairs;
 * decoders must cope with this. The interpretation of some fields in Type B format
 * changes depending on the range of the Type B MMSI field. 160 bits for part A, 168 bits for part B.
 * According to the standard, both the A and B parts are supposed to be 168 bits.
 * However, in the wild, A parts are often transmitted with only 160 bits,
 * omitting the spare 7 bits at the end. Implementers should be permissive about this.
 */
export interface Static_Data_Report {
  type?: number, // Constant: 24
  repeat?: number, // Message repeat count (As in CNB - Common Navigation Block Type: 1,2,3)
  mmsi?: string, // MMSI
  to_bow?: number, // Part B Dimension to Bow (meters)
  to_stern?: number, // Part B Dimension to Stern (meters)
  to_port?: number, // Part B Dimension to Port (meters)
  to_starboard?: number, // Part B Dimension to Starboard (meters)
  partno?: number,
  shipname?: string, // (Part A) 20 sixbit chars
  shiptype?: number, // Part B See "Ship Types"
  vendorid?: number,// Part B 3 six-bit chars
  model?: number, // Part B
  serial?: number, // Part B
  callsign?: string, // Part B As in Message Type 5
  mothership_mmsi?: string // Part B
}


/**
 * Type 25: Single Slot Binary Message
 * Maximum of 168 bits (a single slot).
 * Fields after the Destination MMSI are at variable offsets
 * depending on that flag and the Destination Indicator;
 * they always occur in the same order but some may be omitted.
 *
 * The data fields are not, in contrast to message type 26, followed by a radio status block.
 * Note: Type 25 is extremely rare. As of April 2011 it has not been observed even in long-duration samples from AISHub.
 */
export interface Single_Slot_Binary_Message extends Basic_AIS {
  addressed: string, // 0=broadcast, 1=addressed.
  structured: string, // If the structured flag is on, a 16-bit application identifier is extracted;
  // this field is to be interpreted as a 10 bit DAC and 6-bit FID as in message types 6 and 8.
  // Otherwise that field span becomes part of the message payload.
  dest_mmsi: number,
  app_id: number,
  data: string
}


/**
 * Type 26: Multiple Slot Binary Message
 * Takes up 60-1064 bits (up to 5 slots).
 * Note: Type 26 is extremely rare.
 * As of April 2011 it has not been observed even in long-duration samples from AISHub.
 */
export interface Multiple_Slot_Binary_Message extends Basic_AIS {
  addressed: string, // 0=broadcast, 1=addressed.
  structured: string, // If the structured flag is on, a 16-bit application identifier is extracted;
  // this field is to be interpreted as a 10 bit DAC and 6-bit FID as in message types 6 and 8.
  // Otherwise that field span becomes part of the message payload.
  dest_mmsi: number,
  app_id: number,
  data: string
}

/**
 * Type 27: Long Range AIS Broadcast message
 * ITU-1371-4 says this message is primarily intended for long-range
 * detection of AIS Class A equipped vessels (typically by satellite).
 * This message has a similar content to Messages 1, 2 and 3,
 * but the total number of bits has been compressed to allow for
 * increased propagation delays associated with long-range detection
 *
 * Length according to ITU-1374 is 96 bits.
 * However, in the wild these are sometimes transmitted with 168 bits
 * (a full slot). Robust decoders should warn when this occurs but decode the first 96 bits.
 */
export interface Long_Range_AIS_Broadcast extends Basic_AIS, LatitudeAndLongitude, Navigation {
  accuracy: number,
  status: string,
  raim: number,
  gnss: number, //0 = current GNSS position 1 = not GNSS position (default)
}


/**
 * GPRMC and GPGGA
 * Calculating the checksum is very easy. It is the representation of two hexadecimal characters of an XOR of all characters in the sentence between – but not including – the $ and the * character.
 * Lets assume the following NMEA sentence:
 * $GPGLL,5300.97914,N,00259.98174,E,125926,A*28
 * In this sentence the checksum is the character representation of the hexadecimal value 28. The string that the checksum is calculated over is
 * GPGLL,5300.97914,N,00259.98174,E,125926,A
 * To calculate the checksum you parse all characters between $ and * from the NMEA sentence into a new string.  In the examples below the name of this new string is stringToCalculateTheChecksumOver. Then just XOR the first character with the next character, until the end of the string.
 * http://aprs.gids.nl/nmea/#gga
 * NMEA is an acronym for the National Marine Electronics Association. NMEA existed well before GPS was invented.
 */
export interface NMEA {
  cmd: number, // Tracker
  mmsi: number,
  time: number,
  lat: number,
  lon: number,
  sog: number,
  cog: number,
  day?: number,
  alt?: number, //altitude might be missing
  valid: boolean
}