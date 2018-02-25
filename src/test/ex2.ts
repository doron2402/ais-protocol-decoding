
import { Decoder } from '../lib/index';

const msg2:Array<string> = [
  '!AIVDM,1,1,,A,400TcdiuiT7VDR>3nIfr6>i00000,0*78',
  '!AIVDM,2,1,0,A,58wt8Ui`g??r21`7S=:22058<v05Htp000000015>8OA;0sk,0*7B',
  '!AIVDM,2,2,0,A,eQ8823mDm3kP00000000000,2*5D',
  '!AIVDM,2,1,0,A,58wt8Ui`g??r21`7S=:22058<v05Htp000000015>8OA;0sk,0*7B ',
  '!AIVDM,2,2,0,A,eQ8823mDm3kP00000000000,2*5D',
];
const aisDecoder_ex2 = new Decoder(msg2);