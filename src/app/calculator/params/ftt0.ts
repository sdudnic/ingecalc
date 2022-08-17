import { SettingProperty, EnumSTA, EnumTYC } from '../common/enums';
import { getBasicBCTT0, getBasicF0C, getBasicFBTT0, getkh, getSettingValue, getBcd1, getBcd2, getKfck, getBcd, getEcd0, getEcdt0, getBasicFdtt0 } from '../common/functions';

/**
 * FTT0; phi(t,t_0) -
 * Onglet: Cara béton
 * Champ: F46
 * @returns FTT0
 */
export default async function FTT0(
  STA: EnumSTA,
  TYC: EnumTYC,
  FCK: number,
  TSE: boolean,
  FCM: number,
  RH: number,
  H0C: number,
  T0C: number,
  TCO: number,
  SFC: boolean,
  SCO: number,
  TSC: number,
): Promise<number> {

  //=IF(OR($T$15=2;$T$15=4);IF(OR($K$22>=55;$F$26=$M$17);HLOOKUP($T$15;$S$42:$AA$59;2);HLOOKUP(1;$S$42:$AA$59;2));HLOOKUP($T$15;$S$42:$AA$59;2))
  //=IF(OR(T15=2;T15=4);IF(OR(K22>=55;F26=M17);HLOOKUP(T15;S42:AA59;2);HLOOKUP(1;S42:AA59;2));HLOOKUP(T15;S42:AA59;2))
  /*
T15 - STA
K22 - FCK
F26=M17 - TSE
HLOOKUP(T15;S42:AA59;2) - basic ftt0 (STA)
HLOOKUP(1;S42:AA59;2) - basic ftt0 (STA==EN1992_1_1_BS)
HLOOKUP(T15;S42:AA59;2) - basic ftt0 (STA)

  IF(OR(STA=2;STA=4);
    IF(OR(FCK>=55;TSE);
      basic ftt0 (STA);
    basic ftt0 (STA==EN1992_1_1_BS)
  basic ftt0 (STA)
  */
  switch (STA) {
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        if ((FCK >= 55) || TSE)
          return await getBasicFTT0(STA, TYC, FCM, RH, H0C, T0C, TCO, SFC, SCO, FCK, TSC);
        else
          return await getBasicFTT0(EnumSTA.EN1992_1_1_BS, TYC, FCM, RH, H0C, T0C, TCO, SFC, SCO, FCK, TSC);
      }
    default:
      return await getBasicFTT0(STA, TYC, FCM, RH, H0C, T0C, TCO, SFC, SCO, FCK, TSC);
  }
}

async function getBasicFTT0(
  STA: EnumSTA,
  TYC: EnumTYC,
  FCM: number,
  RH: number,
  H0C: number,
  T0C: number,
  TCO: number,
  SFC: boolean,
  SCO: number,
  FCK: number,
  TSC: number,
): Promise<number> {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      {
        let _F0C = getBasicF0C(STA, FCM, RH, H0C, T0C);
        let _BCTT0 = getBasicBCTT0(STA, TCO, T0C, FCM, RH, H0C);
        return _F0C * _BCTT0;
      }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      {
        let _FBTT0 = getBasicFBTT0(STA, TCO, T0C, FCM, SCO, SFC, FCK);
        let _FDTT0 = await getBasicFdtt0(STA, TYC, T0C, FCM, SFC, FCK, RH, TCO, TSC, H0C);
        return _FBTT0 + _FDTT0;
      }
  }
}