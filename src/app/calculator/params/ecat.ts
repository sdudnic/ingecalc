import { EnumSTA } from '../common/enums';
import { getFcktByDays, getFcmtByDays } from '../common/functions';

/**
 * Retrait endogène (ECAT) - eca,t (‰)
 * Excel: Cara béton:F34
 * Value ex: 0.043
 * @param STA
 * @param FCK
 * @param TSE
 * @param TCO Âge du béton à l’instant considéré (t, j)
 * @param T0C Age béton au moment du chargement (t0, j)
 * @param FCM f_cm (MPa)
 * @param SCO s
 * @returns eca,t (‰); ex: 0.043
 */
export default async function ECAT(
  STA: EnumSTA,
  FCK: number,
  TSE: boolean,
  TCO: number,
  T0C: number,
  FCM: number,
  SCO: number,
): Promise<number> {

  //=IF(OR(T15=2;T15=4);IF(OR(K22>=55;F26=M17);HLOOKUP(T15;S30:AA34;5);HLOOKUP(1;S30:AA34;5));HLOOKUP(T15;S30:AA34;5))
  /*
  T15                     - STA
  K22                     - FCK
  F26=M17                 - TSE (b)
  HLOOKUP(T15;S30:AA34;5) - BasicECAT(STA)
  HLOOKUP(1;S30:AA34;5)   - BasicECAT(STA.1)
  HLOOKUP(T15;S30:AA34;5) - BasicECAT(STA)
   */
  switch (STA) {
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        return (FCK >= 55 || TSE) ?
          getBasicECAT(STA, TCO, SCO, T0C, FCM, FCK)
          : getBasicECAT(EnumSTA.EN1992_1_1_BS, TCO, SCO, T0C, FCM, FCK);
      }
    default: {
      return getBasicECAT(STA, TCO, SCO, T0C, FCM, FCK)
    }
  }
}

/**
 * onglet: Cara béton
 * param: basic ECAT
 * cell: R34..
 * @returns basic ECAT
 */
function getBasicECAT(
  STA: EnumSTA,
  TCO: number,
  SCO: number,
  T0C: number,
  FCM: number,
  FCK: number,
): number {

  /*
  F20 - TCO
  F21 - TSC
  F31 - H0C

  K26 - kh
  S31 - ecd0(STA)

  T36 - Kfck
  K22 - FCK
  F19 - RH
  T37 - bcd
 */
  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      {
        //=(1-EXP(-0.2*F20^0.5))*S33

        /*
        F20 - TCO
        S33 - ecai
        */
        let ecai = getecai(FCK);
        return (1 - Math.exp(-0.2 * TCO ** 0.5)) * ecai
      }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        //=IF(F20<28;IF(W65/K22<0.1;0;(K22-20)*(2.2*W65/K22-0.2)*0.000001);(K22-20)*(2.8-1.1*EXP(-F20/96))*0.000001)*1000
        /*
        F20 - TCO
        W65 - fcmt
        K22 - FCK

IF(F20<28;
  IF(W65/K22<0.1;
    0;
    (K22-20)*(2.2*W65/K22-0.2)*0.000001);
  (K22-20)*(2.8-1.1*EXP(-F20/96))*0.000001)
  *1000
        */
        var days = TCO;
        let fcmt = getFcmtByDays(FCM, SCO, days)
        return 1000 * (
          (TCO < 28) ?
            ((fcmt / FCK < 0.1) ? 0 : (FCK - 20) * (2.2 * fcmt / FCK - 0.2) * 0.000001)
            : (FCK - 20) * (2.8 - 1.1 * Math.exp(-TCO / 96)) * 0.000001)
      }
    case EnumSTA.RCC_CW_2018: {
      //=IF(F20<28;IF(W66/K22<0.1;0;(K22-20)*(2.2*W66/K22-0.2));(K22-20)*(2.8-1.1*EXP(-F20/96)))/1000
      /*
      F20 - TCO
      W66 - fckt
      K22 - FCK
       */
      var days = TCO;
      let fckt = getFcktByDays(FCM, SCO, days)
      return ((TCO < 28) ? (fckt / FCK < 0.1) ? 0 : (FCK - 20) * (2.2 * fckt / FCK - 0.2) : (FCK - 20) * (2.8 - 1.1 * Math.exp(-TCO / 96))) / 1000
    }
  }
}

/**
 * onglet: Cara béton
 * param: eps_ca(infinite)
 * @param FCK
 * @returns eps_ca(infinite)
 */
function getecai(FCK: number): number {
  //=2.5*(K22-10)*0.000001*1000
  return 2.5 * (FCK - 10) * 0.000001 * 1000
}
