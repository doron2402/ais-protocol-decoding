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


 ### Important notes:
  - Ais payload is represented in a 6bits encoded string

### Running example:
  - `npm run example`