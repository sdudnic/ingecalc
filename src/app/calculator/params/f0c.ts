import { EnumSTA } from '../common/enums';
import { getBasicF0C } from '../common/functions';

export default async function F0C(
  STA: EnumSTA,
  T0C: number,
  FCM: number,
  RH: number,
  H0C: number,
  FCK: number,
  TSE: boolean,
): Promise<number> {

  //=IF(OR(T15=2;T15=4);IF(OR(K22>=55;F26=M17);HLOOKUP(T15;S42:AA59;5);HLOOKUP(1;S42:AA59;5));HLOOKUP(T15;S42:AA59;5))
  /*
T15     - STA
K22     - FCK
F26=M17 - TSE (b)
HLOOKUP(T15;S42:AA59;5)
HLOOKUP(  1;S42:AA59;5)
HLOOKUP(T15;S42:AA59;5)

IF(OR(T15=2;T15=4);
  IF(OR(K22>=55;F26=M17);
    HLOOKUP(T15;S42:AA59;5);
    HLOOKUP(1;S42:AA59;5));
  HLOOKUP(T15;S42:AA59;5))
   */
  switch (STA) {
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        return (FCK >= 55 || TSE) ?
          getBasicF0C(STA, FCM, RH, H0C, T0C)
          : getBasicF0C(EnumSTA.EN1992_1_1_BS, FCM, RH, H0C, T0C)
      }
    default: {
      return getBasicF0C(STA, FCM, RH, H0C, T0C)
    }
  }
}