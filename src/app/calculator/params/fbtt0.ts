import { EnumSTA } from '../common/enums';
import { getBasicFBTT0 } from '../common/functions';

export default async function FBTT0(
  STA: EnumSTA,
  T0C: number,
  FCM: number,
  FCK: number,
  TSE: boolean,
  TCO: number,
  SCO: number,
  SFC: boolean,
): Promise<number> {

  //=IF(OR(T15=2;T15=4);IF(OR(K22>=55;F26=M17);HLOOKUP(T15;S42:AA59;15);HLOOKUP(1;S42:AA59;15));HLOOKUP(T15;S42:AA59;15))  
  /*
T15     - STA
K22     - FCK
F26=M17 - TSE (b)
HLOOKUP(T15;S42:AA59;15) - fb(t,to) <= STA
HLOOKUP(  1;S42:AA59;15) - fb(t,to) <= STA == 1
HLOOKUP(T15;S42:AA59;15) - fb(t,to) <= STA

IF(OR(STA=2;STA=4)
  IF(OR(FCK>=55;TSE=Yes)
    fb(t,to) <= STA
  fb(t,to) <= STA == 1
fb(t,to) <= STA

   */
  switch (STA) {
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        return (FCK >= 55 || TSE) ?
          getBasicFBTT0(STA, TCO, T0C, FCM, SCO, SFC, FCK)
          : getBasicFBTT0(EnumSTA.EN1992_1_1_BS, TCO, T0C, FCM, SCO, SFC, FCK)
      }
    default: {
      return getBasicFBTT0(STA, TCO, T0C, FCM, SCO, SFC, FCK)
    }
  }
}