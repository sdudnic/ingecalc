import { EnumSTA } from '../common/enums';
import { getBasicBCTT0 } from '../common/functions';

export default async function BCTT0(
  STA: EnumSTA,
  TCO: number,
  T0C: number,
  FCM: number,
  RH: number,
  H0C: number,
  FCK: number,
  TSE: boolean,
): Promise<number> {

  //=IF(OR(T15=2;T15=4);IF(OR(K22>=55;F26=M17);HLOOKUP(T15;S42:AA59;9);HLOOKUP(1;S42:AA59;9));HLOOKUP(T15;S42:AA59;9))
  /*
T15                     - STA
K22                     - FCK
F26=M17                 - TSE (b)
HLOOKUP(T15;S42:AA59;9) - bctt0(STA)
HLOOKUP(1;S42:AA59;9)   - bctt0(STA.1)
HLOOKUP(T15;S42:AA59;9) - bctt0(STA)
   */
  
  /*=IF(
    OR(T15=2;T15=4);
      IF(OR(K22>=55;F26=M17);
        HLOOKUP(T15;S42:AA59;9);
        HLOOKUP(1;S42:AA59;9));
      HLOOKUP(T15;S42:AA59;9))
  */

  switch (STA) {
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        return (FCK >= 55 || TSE) ?
          getBasicBCTT0(STA, TCO, T0C, FCM, RH, H0C)
          : getBasicBCTT0(EnumSTA.EN1992_1_1_BS, TCO, T0C, FCM, RH, H0C);
      }
    default: {
      return getBasicBCTT0(STA, TCO, T0C, FCM, RH, H0C)
    }
  }
}