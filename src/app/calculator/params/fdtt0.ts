import { EnumSTA, EnumTYC } from '../common/enums';
import { getBasicFdtt0 } from '../common/functions';

export default async function FDTT0(
  STA: EnumSTA,
  TYC: EnumTYC,
  FCK: number,
  TSE: boolean,
  T0C: number,
  FCM: number,
  SFC: boolean,
  RH: number,
  TCO: number,
  TSC: number,
  H0C: number
): Promise<number> {
  //=IF(OR(T15=2;T15=4);IF(OR(K22>=55;F26=M17);HLOOKUP(T15;S42:AA59;18);HLOOKUP(1;S42:AA59;18));HLOOKUP(T15;S42:AA59;18))
  /*
  T15     - STA
  K22     - FCK
  F26=M17 - TSE
  HLOOKUP(T15;S42:AA59;18) _basic-fdtt0
  HLOOKUP(T15;S42:AA59;18)
  HLOOKUP(    1;S42:AA59;18)
   */


  switch (STA) {
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        if ((FCK >= 55) || TSE)
          return await getBasicFdtt0(STA, TYC, T0C, FCM, SFC, FCK, RH, TCO, TSC, H0C);
        else
          return await getBasicFdtt0(EnumSTA.EN1992_1_1_BS, TYC, T0C, FCM, SFC, FCK, RH, TCO, TSC, H0C);
      }
    default:
      return await getBasicFdtt0(STA, TYC, T0C, FCM, SFC, FCK, RH, TCO, TSC, H0C);
  }

}