## AIS Decoder
  The automatic identification system (AIS) is an automatic
  Tracking system used on ships and by vessel traffic services (VTS).
  When satellites are used to detect AIS signatures, the term Satellite-AIS (S-AIS) is used.
  AIS information supplements marine radar, which continues to be the primary method of collision
  avoidance for water transport.


 ### References:
  - Gov:
    - https://www.navcen.uscg.gov/?pageName=AISMessagesA
  - Gpsd:
    - http://catb.org/gpsd/AIVDM.html [best doc]
  - OpenCPN:
    - https://github.com/OpenCPN/OpenCPN [file: AIS_Bitstring.cpp]
 		- http://fossies.org/linux/misc/gpsd-3.11.tar.gz/gpsd-3.11/test/sample.aivdm
  - online AIS decoder:
    - http://www.maritec.co.za/tools/aisvdmvdodecoding/
    - http://www.maritec.co.za/aisvdmvdodecoding1.php
  - Wikipedia:
    - https://en.wikipedia.org/wiki/Automatic_identification_system
  - OpenCPN
    - Github: https://github.com/OpenCPN/OpenCPN/blob/45504f35c005ed1ffcd117c67797279da42d53ae/src/AIS_Decoder.cpp


### AIS MESSAGES
  1. Position[0] `format`: !AIVDM, identifies this as an AIVDM packet (AIS format).
  2. Position[1] `message_count`:  Messages counter (number of messages), sometimes the ais messages will be split over several messages.
  3. Position[2] `message_id`:
  4. Position[3] `sequence_id`: Sequential message, the current message number
  5. Position[4] `channel`: vhf channel A/B
  6. Position[5] `payload`: the ais data itself
  7. Position[6] `size`: number of bits required to fill the data

  `<format>,<message count>,<message id>,<sequence id>,<channel A/B>,<data>,<fill bits>`


 ### Important notes:
  - Ais payload is represented in a 6bits encoded string

### Running example:
  - `npm run example`