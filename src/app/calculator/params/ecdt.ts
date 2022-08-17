import { EnumSTA, EnumTYC } from '../common/enums';
import { getBasicECDT } from '../common/functions';

export default async function ECDT(
  STA: EnumSTA,
  TYC: EnumTYC,
  FCK: number,
  TSE: boolean,
  TCO: number,
  FCM: number,
  RH: number,
  H0C: number,
  TSC: number,
  SFC: boolean,
): Promise<number> {

  //=IF(OR(T15=2;T15=4);IF(OR(K22>=55;F26=M17);HLOOKUP(T15;S30:AA34;3);HLOOKUP(1;S30:AA34;3));HLOOKUP(T15;S30:AA34;3))
  /*
  T15 - STA
  K22 - FCK
  F26=M17 - TSE
  HLOOKUP(T15;S30:AA34;3) - basicEcdt(STA)
  HLOOKUP(1;S30:AA34;3) - basicEcdt(STA.1)
  HLOOKUP(T15;S30:AA34;3) - basicEcdt(STA)

  (OR(STA=2;STA=4);
    IF(OR(FCK>=55;TSE);
      basicEcdt(STA)
      basicEcdt(STA.1)
    basicEcdt(STA)
  */

  switch (STA) {
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        return (FCK >= 55 || TSE) ?
          await getBasicECDT(STA, TYC, TCO, TSC, H0C, RH, FCM, FCK, SFC)
          : await getBasicECDT(EnumSTA.EN1992_1_1_BS, TYC, TCO, TSC, H0C, RH, FCM, FCK, SFC);
      }
    default: {
      return await getBasicECDT(STA, TYC, TCO, TSC, H0C, RH, FCM, FCK, SFC)
    }
  }
}