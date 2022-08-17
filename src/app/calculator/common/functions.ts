import { parseNumber } from '@progress/kendo-angular-intl';
import { Setting } from 'Client/app/models/setting';
import { AppService } from 'Client/app/services/app.service';
import { SettingsService } from 'Client/app/services/settings.service';
import { EnumENT, EnumSFS, EnumSTA, EnumSTD, EnumTYC, EnumUNIT, ErrorLevel, PropertyCode, SettingProperty } from './enums';
import { CalculatorError } from './exceptions/calculator-error';
import { ParamString } from './param-string';


/**
 * Returns an API call 'prop/{settingCode}/{propertyCode}'
*/
export async function getSettingValue(settingCode: string, property: SettingProperty): Promise<number> {
  // const httpClient = new HttpClient(new HttpXhrBackend({
  // build: () => new XMLHttpRequest()
  // }));
  let settings: Setting[] = [];
  let propertyCode = SettingProperty[property];

  const settingsService = AppService.getInjector().get(SettingsService);
  settings = await settingsService.getSettings();

  let value: string = "";
  var setting = settings.find(x => x.listCode == settingCode && x.propertyCode == propertyCode);

  if (setting)
    value = setting.propertyValue;
  // else
  // value = await lastValueFrom(httpClient.get<string>(`/api/settings/prop/${settingCode}/${propertyCode}`));

  return parseNumber(value);
}

/**
 * Throws a CalculatorError
 * @param message message ready for translation under 'message.<texthere>'
 * @param propertyCode 
 * @param params message parameters to be remplaced in the message text
 * @param fallbackValue fallback value for the specified parameter if an error occurs and it can't be calculated
 * @param errorLevel 
 */
export function throwCalculatorError(message: string, propertyCode: string, params?: Object, fallbackValue?: any, errorLevel?: ErrorLevel): void {
  throw new CalculatorError(message, propertyCode, fallbackValue, errorLevel, params)
}

/**
 * verification de l'angle de la bielle (strut, theta)
 * @param theta strut angle / bielle
 * @param STA 
 * @param KUNIT 
 * @param ned 
 * @param BFL 
 * @param HFL 
 * @param FCTM 
 * @returns 
 */
export function checkStrut(
  theta: number,
  thetaCode: PropertyCode.STR_SF | PropertyCode.STR_TO,
  STA: EnumSTA,
  KUNIT: number,
  ned: number,
  BFL: number,
  HFL: number,
  FCTM: number,
) {

  let params = { min: 21.8, max: 45 }
  const messageTemplate = "The angle of inclination of the strut must be between {{min}}° and {{max}}°"

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      params = { min: 21.8, max: 45 }
      break;

    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      {
        const ac: number = BFL * HFL;
        if (ned * 0.000001 * KUNIT / ac < 0 && ned * 0.000001 * KUNIT / ac <= -FCTM) {
          throwCalculatorError("Sigct > FCTM : Erreur, ce cas n'est pas traité dans la NF EN 1992-1-1/NA", "FCTM", undefined, NaN);
        }
        if ((ned * 0.000001 * KUNIT / ac) < 0) {
          params = {
            min: getDegrees(Math.atan(1 / (2.5 * Math.sqrt(1 + ned * 0.000001 * KUNIT / ac / FCTM)))),
            max: getDegrees(Math.atan(1 / (1 * Math.sqrt(1 + ned * 0.000001 * KUNIT / ac / FCTM))))
          }
        } else {
          params = {
            min: getDegrees(Math.atan(1 / 2.5)),
            max: getDegrees(Math.atan(1 / 1))
          }
        }
      }
      break;

    case EnumSTA.RCC_CW_2018:
      //En attente de Samuel
      return;
  }

  if (theta < params.min || theta > params.max) {
    // round the numbers to max 2 precision digits
    params.max = Math.round(params.max * 100) / 100
    params.min = Math.round(params.min * 100) / 100

    throwCalculatorError(messageTemplate, thetaCode, params, theta);
  }
}

export async function getTeta(
  STA: EnumSTA,
  KUNIT: number,
  str: number,
  NEDSF: number,
  BFL: number,
  HFL: number,
  FCTM: number,
  ACC: number,
  FCK: number,
  GACF: number,
): Promise<number> {

  checkStrut(str, PropertyCode.STR_SF, STA, KUNIT, NEDSF, BFL, HFL, FCTM);

  if (STA === EnumSTA.RCC_CW_2018) {
    let fcd = getFcd(ACC, FCK, GACF);
    let sigmacp = getSigmaCp(NEDSF, HFL, BFL, KUNIT, fcd);

    let coef = (sigmacp < 0) ? 0.9 : 0.2;
    let angle = Math.atan(1 / Math.max(1, 1.2 + coef * sigmacp / FCTM));
    str = getDegrees(angle);
  }

  let teta = getRadians(str);
  return teta;
}

/**
 * Cara béton
 * k_h
 * K26
 */
export function getkh(H0C: number): number {
  //=IF(F31<500;-2.2635*(F31/1000)^3+4.4623*(F31/1000)^2-2.7307*(F31/1000)+1.232;0.7)
  return (H0C < 500) ?
    -2.2635 * (H0C / 1000) ** 3 + 4.4623 * (H0C / 1000) ** 2 - 2.7307 * (H0C / 1000) + 1.232
    : 0.7;
}

/**
 * onglet: Cara béton
 * param: basic BCTT0
 * cell: R50..
 * @returns basic BCTT0
 */
export function getBasicBCTT0(
  STA: EnumSTA,
  t: number,
  t0: number,
  FCM: number,
  rh: number,
  h0: number,
): number {

  //=((F20-F22)/(S51+F20-F22))^0.3

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      {
        let bH = getbH(STA, FCM, rh, h0);
        return ((t - t0) / (bH + t - t0)) ** 0.3;
      }
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      return NaN;
  }
}

/**
* Cara béton
* Fluage
* beta_H
* R51..
*/
function getbH(
  STA: EnumSTA,
  FCM: number,
  rh: number,
  h0: number,
): number {
  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA: {
      //=IF(D120<=35;MIN(1.5*(1+(0.012*D44)^18)*D46+250;1500);MIN(1.5*(1+(0.012*D44)^18)*D46+250*D121;1500*D121))
      /*
      Flèche
      D120 - FCM - 38
      D44  - ARH - 80
      D46  - HNS - 120mm
      D121 - a3  - 0.960
      */
      //=IF($F$5<=35;MIN(1.5*(1+(0.012*F19)^18)*F31+250;1500);MIN(1.5*(1+(0.012*F19)^18)*F31+250*S54;1500*S54))
      /*
      Cara Béton
      F5  - FCM - 38
      F19 - RH  - 80
      F31 - H0C - 240mm
      S54 - a3  - 960
      */

      let a3 = geta3(STA, FCM);

      return (FCM <= 35) ?
        Math.min(1.5 * (1 + (0.012 * rh) ** 18) * h0 + 250, 1500)
        : Math.min(1.5 * (1 + (0.012 * rh) ** 18) * h0 + 250 * a3, 1500 * a3)
    }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018: {
      return NaN;
    }
  }
}

/**
 * Cara béton
 * Fluage
 * alpha_1
 * R52..
 */
export function geta1(
  STA: EnumSTA,
  FCM: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA: {
      return (35 / FCM) ** 0.7;
    }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018: {
      return NaN;
    }
  }
}

/**
 * Cara béton
 * Fluage
 * alpha_2
 * R53..
 */
export function geta2(
  STA: EnumSTA,
  FCM: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA: {
      return (35 / FCM) ** 0.2;
    }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018: {
      return NaN;
    }
  }
}

/**
 * Cara béton
 * Fluage
 * alpha_3
 * R54..
 */
function geta3(
  STA: EnumSTA,
  FCM: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA: {
      return (35 / FCM) ** 0.5;
    }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018: {
      return NaN
    }
  }
}

/**
 * Cara béton
 *
 * beta.cc(t)
 * S69, S80
 */
function getBccByDays(SCO: number, days: number): number {
  //=EXP(S79*(1-(28/S76)^(1/2)))
  return Math.exp(SCO * (1 - (28 / days) ** (1 / 2)))
}

/**
 * Cara béton
 *
 * f_cm (t)
 * W65, W76
 */
export function getFcmtByDays(FCM: number, SCO: number, days: number): number {
  let bcc = getBccByDays(SCO, days);
  return FCM * bcc;
}

/**
 * Cara béton
 *
 * f_ck (t)
 * W65, W76
 */
export function getFcktByDays(FCM: number, SCO: number, days: number): number {
  //=IF(S76>28;W75-8;W76-8)
  /*
  S76 - nr of days
  W75 - FCM
  W76 - FCMT
  */
  let fcmt0 = getFcmtByDays(FCM, SCO, days);
  return (days > 28) ? FCM - 8 : fcmt0 - 8;
}

/**
 * Retrait Epsilon_cd,t 
 * onglet: Cara béton 
 * Ligne R32 => ...
 * */
export async function getBasicECDT(
  STA: EnumSTA,
  TYC: EnumTYC,
  TCO: number,
  TSC: number,
  H0C: number,
  RH: number,
  FCM: number,
  FCK: number,
  SFC: boolean,
): Promise<number> {
  //=(F20-F21)/((F20-F21)+0.04*SQRT(F31^3))*K26*S31
  //=T36*(72*EXP(-0.046*K22)+75-F19)*(F20-F21)*0.000001/((F20-F21)+T37*F31^2)*1000

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
        //=(F20-F21)/((F20-F21)+0.04*SQRT(F31^3))*K26*S31
        /*
        K26 - kh
        S31 - ecd0(STA)
        */
        let kh = getkh(H0C);
        let ecd0 = await getEcd0(STA, TYC, FCM, RH);
        return (TCO - TSC) / ((TCO - TSC) + 0.04 * Math.sqrt(H0C ** 3)) * kh * ecd0;
      }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        //=T36*(72*EXP(-0.046*K22)+75-F19)*(F20-F21)*0.000001/((F20-F21)+T37*F31^2)*1000
        /*
          T36 - Kfck
          K22 - FCK
          F19 - RH
          F20 - TCO
          F21 - TSC
          T37 - bcd
          F31 - H0C
       */

        let Kfck = getKfck(FCK);
        let bcd = getBcd(SFC);
        // =   Kfck * (72 * EXP     (-0.046 * FCK) + 75 - RH) * (TCO - TSC) * 0.000001 / ((TCO - TSC) + bcd * H0C ^  2) * 1000
        return Kfck * (72 * Math.exp(-0.046 * FCK) + 75 - RH) * (TCO - TSC) * 0.000001 / ((TCO - TSC) + bcd * H0C ** 2) * 1000;
      }
    case EnumSTA.RCC_CW_2018: {
      //=X38*X36*(72*EXP(-0.046*K22)+75-F19)*(F20-F21)*0.000001/((F20-F21)+X39*F31^2)*1000      
      /*
      X38 - bcd1
      X36 - Kfckp
      K22 - FCK
      F19 - RH
      F20 - TCO
      F21 - TSC 
      X39 - bcd2
      F31 - H0C
       */

      let Kfck = getKfck(FCK);
      let bcd1 = getBcd1();
      let bcd2 = getBcd2(SFC);

      //   =  X38 *  X36 * (72 * EXP     (-0.046 * K22) + 75 - F19) * (F20 - F21)* 0.000001 / ((F20 - F21) + X39 * F31 ^   2) * 1000
      return bcd1 * Kfck * (72 * Math.exp(-0.046 * FCK) + 75 - RH) * (TCO - TSC) * 0.000001 / ((TCO - TSC) + bcd2 * H0C ** 2) * 1000
    }

  }
}


/**
 * onglet: Cara béton
 * param: K(fck)
 * champ: ligne R36=>...
 * @returns K(fck)
 */
export function getKfck(FCK: number): number {
  return FCK <= 55 ? 18 : 30 - 0.21 * FCK;
}

/**
 * Retrait
 * Excel: Cara béton
 * param: eps_cd,0
 * champ: ligne R31..
 * @returns eps_cd,0
 * */
export async function getEcd0(
  STA: EnumSTA,
  TYC: EnumTYC,
  FCM: number,
  RH: number,
): Promise<number> {
  //=0.85*((220+110*K23)*EXP(-K24*F5/10))*0.000001*1.55*(1-(F19/100)^3)*1000
  /*
  K23 - eds1
  K24 - eds2
  F5  - FCM
  F19 - RH
   */
  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      {
        let eds1 = await getSettingValue(TYC, SettingProperty.EDS1);
        let eds2 = await getSettingValue(TYC, SettingProperty.EDS2);
        return 0.85 * ((220 + 110 * eds1) * Math.exp(-eds2 * FCM / 10)) * 0.000001 * 1.55 * (1 - (RH / 100) ** 3) * 1000
      }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      {
        return NaN;
      }
  }
}


/**
 * onglet: Cara béton
 * param: beta_cd
 * champ: T36..
 * @returns beta_cd
 */
export function getBcd(SFC: boolean): number {
  //=IF(F25=J17;0.007;0.021)
  return SFC ? 0.007 : 0.021;
}

/**
 * onglet: Cara béton
 * param: beta_cd1
 * champ: X38
 * @returns beta_cd1
 */
export function getBcd1(): number {
  return 1;
}

/**
 * onglet: Cara béton
 * param: beta_cd2
 * champ: X39
 * @returns beta_cd2
 */
export function getBcd2(SFC: boolean): number {
  return getBcd(SFC)
}

/**
 * Onglet: Cara béton
 * Param: Basic F0C
 * Champ: R46..
 * @returns Basic F0C
 */
export function getBasicF0C(
  STA: EnumSTA,
  FCM: number,
  RH: number,
  H0C: number,
  T0C: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA: {
      let fRH = getfRH(STA, FCM, RH, H0C);
      let b_fcm = getb_fcm(STA, FCM);
      let b_t0 = getb_t0(STA, T0C); 1
      return fRH * b_fcm * b_t0;
    }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      return NaN;
  }
}

/**
* Cara béton
* Fluage
* phi_RH
* R47..
*/
function getfRH(
  STA: EnumSTA,
  FCM: number,
  RH: number,
  H0C: number,
): number {
  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA: {
      //=IF(F5<=35;1+(1-F19/100)/(0.1*F31^(1/3));(1+(1-F19/100)/(0.1*F31^(1/3))*S52)*S53)
      /*
       F5   - FCM
       F19  - RH
       F31  - H0C
       S52  - a1
       S53  - a2
       */
      let a1 = geta1(STA, FCM);
      let a2 = geta2(STA, FCM);

      return (FCM <= 35) ? 1 + (1 - RH / 100) / (0.1 * H0C ** (1 / 3)) : (1 + (1 - RH / 100) / (0.1 * H0C ** (1 / 3)) * a1) * a2;
    }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018: {
      return NaN;
    }
  }
}

/**
 * Cara béton
 * Fluage
 * beta(fcm)
 * R48..
 */
function getb_fcm(
  STA: EnumSTA,
  FCM: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA: {
      //=16.8/(SQRT(F5))
      return 16.8 / (Math.sqrt(FCM));
    }

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018: {
      return NaN;
    }
  }
}

/**
 * Cara béton
 * Fluage
 * beta(t0)
 * R49..
 */
function getb_t0(
  STA: EnumSTA,
  T0C: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return 1 / (0.1 + T0C ** 0.2)

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      return NaN;
  }
}


/**
 * Onglet: Cara béton
 * Param: Basic FBTT0
 * Champ: R56..
 * @returns Basic FBTT0
 */
export function getBasicFBTT0(
  STA: EnumSTA,
  TCO: number,
  T0C: number,
  FCM: number,
  SCO: number,
  SFC: boolean,
  FCK: number,
): number {




  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return NaN;

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      //=T57*SQRT(F20-F22)/(SQRT(F20-F22)+T58)
      //=X57*SQRT(F20-F22)/(SQRT(F20-F22)+X58)
      /*
      T57;X57 - fb0
      F20 - TCO
      F22 - T0C
      T58;X58 - bbc

      =fb0*SQRT(TCO-T0C)/(SQRT(TCO-T0C)+bbc)
      */

      {
        let fb0 = getfb0(STA, T0C, SFC, FCM, SCO);
        let bbc = getBbc(STA, T0C, FCM, SCO, SFC, FCK);
        return fb0 * Math.sqrt(TCO - T0C) / (Math.sqrt(TCO - T0C) + bbc);
      }



  }
}

/**
* Cara béton
* Fluage
* phi.b0
* R57..
*/
function getfb0(
  STA: EnumSTA,
  T0C: number,
  SFC: boolean,
  FCM: number,
  SCO: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return NaN;


    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
      {
        //=IF(F25=J17;3.6/(W76^0.37);1.4)
        /*
        F25=J17 - SFC
        W76     - fcmt(t0)
        */
        let days = T0C;
        let fcmt0 = getFcmtByDays(FCM, SCO, days);
        return SFC ? 3.6 / (fcmt0 ** 0.37) : 1.4;
      }
    case EnumSTA.RCC_CW_2018:
      {
        //=IF(J26=N17;3.6/(W77^0.37);1.4)
        /*
        J26=N17 - SFC
        W77     - fckt(t0)
        */
        let days = T0C;
        let fckt0 = getFcktByDays(FCM, SCO, days);
        return SFC ? 3.6 / (fckt0 ** 0.37) : 1.4;
      }
  }
}

/**
* Cara béton
* Fluage
* beta.bc
* R58..
*/
function getBbc(
  STA: EnumSTA,
  T0C: number,
  FCM: number,
  SCO: number,
  SFC: boolean,
  FCK: number,
): number {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return NaN;

    //STA 2/4 => IF(F25=J17;0.37*EXP(2.8*W76/K22);0.4*EXP(3.1*W76/K22))
    //STA  6  => IF(F25=J17;0.37*EXP(2.8*W77/K22);0.4*EXP(3.1*W77/K22))

    /*
    F25=J17 - SFC
    W76     - fcmt
    W77     - fckt
    K22     - FCK
    */

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      {
        // IF(SFC;0.37*EXP(2.8*fcmt/FCK);0.4*EXP(3.1*fcmt/FCK))
        // IF(SFC;0.37*EXP(2.8*fckt/FCK);0.4*EXP(3.1*fckt/FCK))
        let days = T0C;
        let fcXt = (STA == EnumSTA.RCC_CW_2018) ? getFcktByDays(FCM, SCO, days) : getFcmtByDays(FCM, SCO, days);

        return SFC ? 0.37 * Math.exp(2.8 * fcXt / FCK) : 0.4 * Math.exp(3.1 * fcXt / FCK);
      }
  }
}

/**
 * Returns radians from degrees
 * Formula: 1° × π/180 = 0.01745rad
 * @param degrees
 * @returns radians
 */
export function getRadians(degrees: number): number {
  let radians = degrees * Math.PI / 180;
  return radians;
}

/**
 * Returns degrees from radians
 * Formula: 1rad × 180/π = 57.296°
 * @param radians
 * @returns degrees
 */
export function getDegrees(radians: number): number {
  let degrees = radians * 180 / Math.PI;
  return degrees;
}

/**
 * Gets k param depending of the d param
 * @param d
 * @returns k
 */
export function getKByD(d: number): number {
  return Math.min(2, 1 + (200 / (d * 1000)) ** (1 / 2));
}

/**
 * Gets V_min (NM622) coeff by D param.
 * @param STA
 * @param SFS
 * @param FCK
 * @param d
 * @returns
 */
export function getVminByD(
  d: number,
  STA: EnumSTA,
  SFS: EnumSFS,
  FCK: number,
) {

  // special cases
  switch (STA) {
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      {
        switch (SFS) {
          case EnumSFS.TRSLAB: // Dalle bénéficiant d'un effet de redistribution transversale
          case EnumSFS.WALLA: // Voile
            return 0.23 * FCK ** (1 / 2);
        }
      }
  }

  // for all other cases
  let k = getKByD(d);
  return 0.035 * k ** (3 / 2) * FCK ** 0.5;
}

/**
 * Throws error messages if the following params
 * does not meet the Torsion calcultation criteria
 * Tab: Torsion
 * @param GTF
 * @param HFL
 * @param GCF
 * @param BFL
 * @param FYK
 * @param GSF
 * @param GACF
 */
export function checkTorsionParams(
  GTF: number,
  HFL: number,
  GCF: number,
  BFL: number,
  FYK: number,
  GSF: number,
  GACF: number,
) {
  if (GTF >= HFL)
    throw "calcul impossible: gt doit être inférieur à h"
  else if (GCF >= HFL - GTF)
    throw "calcul impossible: gc doit être inférieur à h - gt"
  else if (GCF >= BFL)
    throw "calcul impossible: gc doit être inférieur à b"
  else if (GCF >= BFL - GCF)
    throw "calcul impossible: gc doit être inférieur à b/2"
  else
    if (FYK == 0 || BFL == 0 || HFL == 0 || GCF == 0 || GTF == 0 || GSF == 0 || GACF == 0) {
      throw "calcul impossible: Certaines valeurs nulles rendent le calcul impossible";
    }
}

/**
 * Gets internal coef TrdMax
 * Tab: Torsion
 * @param HFL
 * @param BFL
 * @param ACC
 * @param FCK
 * @param GACF
 * @param STR_TO
 * @param N622X06
 * @param ACW
 * @param TEF
 * @returns
 */
export function getTrdMax(
  HFL: number,
  BFL: number,
  ACC: number,
  FCK: number,
  GACF: number,
  STR_TO: number,
  N622X06: number,
  ACW: number,
  TEF: number,
): number {
  let ak = (HFL - TEF) * (BFL - TEF);
  let fcd = getFcd(ACC, FCK, GACF);
  let teta = getRadians(STR_TO);
  return 2 * N622X06 * ACW * fcd * ak * TEF * Math.sin(teta) * Math.cos(teta) * 1000000;
}

/**
 * fcd
 * @param ACC
 * @param FCK
 * @param GACF
 * @returns fcd
 */
export function getFcd(ACC: number, FCK: number, GACF: number): number {
  return ACC * FCK / GACF;
}

/**
 * Gets the Trdc coefficient of Torsion tab
 * Tab: Torsion
 * @param ACT
 * @param FCTK005
 * @param GACF
 * @param HFL
 * @param BFL
 * @param TEF
 * @returns
 */
export function getTrdc(
  ACT: number,
  FCTK005: number,
  GACF: number,
  HFL: number,
  BFL: number,
  TEF: number,
): number {
  let fctd = ACT * FCTK005 / GACF;

  let ak = (HFL - TEF) * (BFL - TEF);
  let trdc = TEF * 2 * ak * fctd * 1000000;
  return trdc;
}

/**
 * Gets internal coef VrdMax
 * Tab: Torsion
 * @param d dy or dz
 * @param fl HFL or BFL
 * @param alpha ACO in radians
 * @param teta TCO in radians
 * @param fcd
 * @param ACW
 * @param N1TO
 * @returns
 */
export function getVrdMax(
  d: number,
  fl: number,
  alpha: number,
  teta: number,
  fcd: number,
  ACW: number,
  N1TO: number,
): number {

  return ACW * fl * 0.9 * d * N1TO * fcd * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) / (1 + (Math.cos(teta) / Math.sin(teta)) ** 2) * 1000000;
}


/**
 * Gets vrdc coef by different params
 * Tab: Torsion
 * @param d
 * @param k
 * @param rol
 * @param sigmaCp
 * @param fl
 * @param vmin
 * @param CRDC622
 * @param FCK
 * @param K1622
 * @returns
 */
export function getVrdc(
  d: number,
  k: number,
  rol: number,
  sigmaCp: number,
  fl: number,
  vmin: number,
  CRDC622: number,
  FCK: number,
  K1622: number,
): number {

  return Math.max((CRDC622 * k * (100 * rol * FCK) ** (1 / 3) + K1622 * sigmaCp) * fl * d, (vmin + K1622 * sigmaCp) * fl * d, 0.0001) * 1000000;
}

/**
 * Gets rol by d (roly, rolx)
 * Tab: Torsion
 * @param d
 * @param fl
 * @param ASLSF
 * @returns rol
 */
export function getRolByD(
  d: number,
  fl: number,
  ASLSF: number,
): number {

  return Math.min(ASLSF * 0.0001 / (fl * d), 0.02)
}

/**
 * Get SigmaCp coef
 * Tab: Torsion, EffortTranchant
 * @param fcd
 * @param h Torsion: HFL; Console: HCC
 * @param b Torsion: BFL; Console: BCO
 * @param ned NEDT(Torsion) or NEDSF (EffortTranchant/ShearForce)
 * @param KUNIT
 * @returns
 */
export function getSigmaCp(
  ned: number,
  h: number,
  b: number,
  KUNIT: number,
  fcd: number,

): number {

  let ac = b * h; // en m²
  return Math.min(ned * KUNIT * 0.000001 / ac, 0.2 * fcd);
}

/**
 * Fleche!D71 mp
 * @param ENT
 * @param MPSF
 * @param LEFFD
 * @param W20
 * @param AM0D
 * @returns IF($O$5="Charges réparties";D6*POWER($D$21;2)/$W$20*$D$15;D6*$D$15)
 */
export function getMp(ENT: EnumENT, MPSF: number, LEFFD: number, W20: number, AM0D: number): number {
  return ENT === EnumENT.LOADS ? MPSF * Math.pow(LEFFD, 2) / W20 * AM0D : MPSF * AM0D;
}

/**
 * Fleche!D72 mc
 * @param ENT
 * @param MCSF
 * @param LEFFD
 * @param W20
 * @param AM0D
 * @returns IF($O$5="Charges réparties";D7*POWER($D$21;2)/$W$20*$D$15;D7*$D$15)
 */
export function getMc(ENT: EnumENT, MCSF: number, LEFFD: number, W20: number, AM0D: number): number {
  return ENT === EnumENT.LOADS ? MCSF * Math.pow(LEFFD, 2) / W20 * AM0D : MCSF * AM0D;
}

/**
 * Fleche!D73 mr
 * @param ENT
 * @param MRSF
 * @param LEFFD
 * @param W20
 * @param AM0D
 * @returns IF($O$5="Charges réparties";D8*POWER($D$21;2)/$W$20*$D$15;D8*$D$15)
 */
export function getMr(ENT: EnumENT, MRSF: number, LEFFD: number, W20: number, AM0D: number): number {
  return ENT === EnumENT.LOADS ? MRSF * Math.pow(LEFFD, 2) / W20 * AM0D : MRSF * AM0D;
}

/**
 * Fleche!D74 mq
 * @param ENT
 * @param MQSF
 * @param LEFFD
 * @param W20
 * @param AM0D
 * @returns IF($O$5="Charges réparties";D9*POWER($D$21;2)/$W$20*$D$15;D9*$D$15)
 */
export function getMq(ENT: EnumENT, MQSF: number, LEFFD: number, W20: number, AM0D: number): number {
  return ENT === EnumENT.LOADS ? MQSF * Math.pow(LEFFD, 2) / W20 * AM0D : MQSF * AM0D;
}

/**
 * D76 ei
 * @param ECM
 * @returns 1000*HLOOKUP(Flèche!$D$34;Données!$B$2:$P$16;8;FALSE)
 */
export function getEi(ECM: number): number {
  return ECM; // * 1000; ECM it is already in MPa
}

/**
 * Fleche!D77 ev
 * @param ei D76
 * @returns D76/3
 */
export function getEv(ei: number): number {
  return ei / 3;
}

/**
 * Fleche!D79 d
 * @param HFL
 * @param GTF
 * @returns D23-D25
 */
export function getD(HFL: number, GTF: number): number {
  return HFL - GTF;
}

/**
* Position de l'axe neutre en section non fissurée à l'ELS
* Excel: Fleche!D80 y
* @param BFL  D22
* @param HFL  D23
* @param SCEC D36
* @param ASTD D26
* @param d    D79
* @param ASCD D29
* @param GCF  D28
* @returns (D22*D23*D23/2+D36*D26*D79/10000+D36*D29*D28/10000)/(D22*D23+D36*D26/10000+D36*D29/10000)
* duplicate dld92
*/
export function getY(BFL: number, HFL: number, SCEC: number, ASTD: number, d: number, ASCD: number, GCF: number): number {
  //=(D22*D23*D23/2+D36*D26*D79/10000+D36*D29*D28/10000)/(D22*D23+D36*D26/10000+D36*D29/10000)
  return (BFL * HFL * HFL / 2 + SCEC * ASTD * d / 10000 + SCEC * ASCD * GCF / 10000) / (BFL * HFL + SCEC * ASTD / 10000 + SCEC * ASCD / 10000);
}

/**
 * Position de l'axe neutre en section fissurée à l'ELS
 * Excel: Fleche!D81 x
 * @param SCEC D36
 * @param ASTD D26
 * @param ASCD D29
 * @param BFL  D22
 * @param GCF  D28
 * @param d    D79
 * @returns (SQRT(D36^2*(D26/10000+D29/10000)^2+2*D36*D22*(D29*D28/10000+D26*D79/10000))-D36*(D29/10000+D26/10000))/D22
 */
export function getX(SCEC: number, ASTD: number, ASCD: number, BFL: number, GCF: number, d: number): number {
  /*
  D36 SCEC
  D26 ASTD
  D29 ASCD
  D22 BFL
  D28 GCF
  D79 d
  */
  return (Math.sqrt(SCEC ** 2 * (ASTD / 10000 + ASCD / 10000) ** 2 + 2 * SCEC * BFL * (ASCD * GCF / 10000 + ASTD * d / 10000)) - SCEC * (ASCD / 10000 + ASTD / 10000)) / BFL;
}

/**
 * Fleche!D83 lh
 * @param BFL
 * @param HFL
 * @param y Fleche!D80
 * @param SCEC
 * @param ASTD
 * @param d Fleche!D79
 * @param ASCD
 * @param GCF
 * @returns D22*POWER(D23;3)/12+D22*D23*POWER(D80-D23/2;2)+D36*D26/10000*POWER(D79-D80;2)+D36*D29/10000*POWER(D80-D28;2)
 * duplicate dld92
 */
export function getLh(BFL: number, HFL: number, y: number, SCEC: number, ASTD: number, d: number, ASCD: number, GCF: number): any {
  return BFL * Math.pow(HFL, 3) / 12 + BFL * HFL * Math.pow(y - HFL / 2, 2) + SCEC * ASTD / 10000 * Math.pow(d - y, 2) + SCEC * ASCD / 10000 * Math.pow(y - GCF, 2);
}

/**
 * Fleche!D84 le
 * @param BFL
 * @param x D81
 * @param SCEC
 * @param d D79
 * @param ASTD
 * @param GCF
 * @param ASCD
 * @returns D22*POWER(D81;3)/3+D36*(POWER((D79-D81);2)*D26/10000)+D36*(POWER((D81-D28);2)*D29/10000)
 */
export function getLe(BFL: number, x: number, SCEC: number, d: number, ASTD: number, GCF: number, ASCD: number): number {
  return BFL * Math.pow(x, 3) / 3 + SCEC * (Math.pow((d - x), 2) * ASTD / 10000) + SCEC * (Math.pow((x - GCF), 2) * ASCD / 10000)
}

/**
 * W20
 * @param W15
 * @returns IF(W15=1;8;2)
 */
export function getMoment(STD: EnumSTD): number {
  switch (STD) {
    case EnumSTD.CBEAM: return 8;
    case EnumSTD.CANTILEVER: return 2;
  }
}

/**
 * Fleche!W22
 * @param W15
 * @returns IF(W15=1;9,6;4)
 */
export function getFlecheTotal(STD: EnumSTD): number {
  switch (STD) {
    case EnumSTD.CBEAM: return 9.6;
    case EnumSTD.CANTILEVER: return 4;
  }
}

/**
 * Checks some invalid Beldling/Flexion tab values before the ELU calculations
 * @param NELU
 * @param MELU
 * @param BFL
 * @param HFL
 * @param GCF
 * @param GTF
 * @param GSF
 * @param GACF
 */
export function checkInvalidEluFlexionValues(
  NELU: number,
  MELU: number,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  GSF: number,
  GACF: number,
) {
  if (
    (NELU >= 0 && MELU == 0) ||
    BFL == 0 ||
    HFL == 0 ||
    GCF == 0 ||
    GTF == 0 ||
    GSF == 0 ||
    GACF == 0)
    throw "Certaines valeurs nulles rendent le calcul impossible"
  else if (GTF >= HFL / 2)
    throw "_GTF doit être inférieur à _HFL/2"
  else if (GCF >= HFL / 2)
    throw "_GCF doit être inférieur à _HFL/2"
  else if (GCF >= HFL - GTF)
    throw "_GCF doit être inférieur à _HFL - _GTF"
}

/**
 * Checks some invalid Bending/Flexion tab values before the ELS calculations
 * @param MELU
 * @param Mscara
 * @param Msquasi
 * @param ASTB
 * @param AST1
 * @param ASCB
 * @param ASC1
 * @param GTF
 * @param HFL
 * @param GCF
 * @param MELSC
 * @param NELSC
 * @param MELSQ
 * @param NELSQ
 * @param MELSF
 * @param NELSF
 * @param STA
 * @param BFL
 * @param GSF
 * @param GACF
 */
export function checkInvalidElsFlexionValues(
  Mscara: number,
  Msquasi: number,
  ASTB: number,
  GTF: number,
  HFL: number,
  GCF: number,
  MELSC: number,
  NELSC: number,
  MELSQ: number,
  NELSQ: number,
  MELSF: number,
  NELSF: number,
  STA: EnumSTA,
  BFL: number,
  GSF: number,
  GACF: number) {

  if (Mscara < 0 || Msquasi < 0) {
    throw "Rentrer des moments M positifs";
    //Worksheets("Flexion").Range("B40:B45").Value = ""
    //return
  }
  if (ASTB == 0 ||
    (MELSC == 0 && NELSC == 0) ||
    (MELSQ == 0 && NELSQ == 0) ||
    (MELSF == 0 && NELSF == 0 && STA === EnumSTA.RCC_CW_2018) ||
    BFL == 0 ||
    HFL == 0 ||
    GCF == 0 ||
    GTF == 0 ||
    GSF == 0 ||
    GACF == 0) {
    throw "Certaines valeurs nulles rendent le calcul impossible";
    //Worksheets("Flexion").Range("B40:B45").Value = ""
    //return
  }
}

/**
 * Flexion function
 * @param a
 * @param b
 * @param c
 * @param D
 * @returns
 */
export function equ2(
  a: number,
  b: number,
  c: number,
  D: number,
): number {

  let delta: number
  let x1: number
  let x2: number

  delta = b ** 2 - 4 * a * c

  if (delta > 0) {
    x1 = (-b + delta ** 0.5) / (2 * a)
    x2 = (-b + delta ** 0.5) / (2 * a)
    if (x1 > 0 && x1 < D) {
      return x1;
    } else {
      return x2;
    }
  } else {
    return -b / (2 * a);
  }

}

/**
 * Flexion function
 * @param a
 * @param b
 * @param c
 * @param D
 * @param e
 * @param F
 * @returns
 */
export function equ3(
  a: number,
  b: number,
  c: number,
  D: number,
  e: number,
  F: number,
): number {

  let a0: number
  let a1: number
  let a2: number
  let a3: number
  let p: number
  let delta: number
  let w: number
  let u: number
  let v: number
  let t: number
  let x1: number
  let x2: number
  let x3: number
  let q: number


  if (b == 0 && c == 0) {

    return (-D / a) ** (1 / 3)
  }
  else {

    a0 = D / a
    a1 = c / a
    a2 = b / a
    a3 = a2 / 3
    p = a1 - a3 * a2
    q = a0 - a1 * a3 + 2 * a3 ** 3
    delta = (q / 2) ** 2 + (p / 3) ** 3

    if (delta > 0) {
      if ((-q / 2 + delta ** (1 / 2)) < 0) {
        w = -((-(-q / 2 + delta ** (1 / 2))) ** (1 / 3))
      }
      else {
        w = (-q / 2 + delta ** (1 / 2)) ** (1 / 3)
      }
      return w - p / 3 / w - a3
    }

    if (delta == 0) {
      x1 = 3 * q / p - a3
      x2 = -3 * q / 2 / p - a3

      if (x1 + F > 0 && x1 + F < e) {
        return x1
      }

      if (x2 + F > 0 && x2 + F < e) {
        return x2
      }

    }

    if (delta < 0) {

      u = 2 * (-p / 3) ** 0.5
      v = -q / 2 / (-p / 3) ** (3 / 2)
      t = Math.acos(v) / 3


      x1 = u * Math.cos(t) - a3
      x2 = u * Math.cos(t + 2 * Math.PI / 3) - a3
      x3 = u * Math.cos(t + 4 * Math.PI / 3) - a3


      if (x2 + F > 0 && x2 + F < e) {
        return x2
      }

      if (x3 + F > 0 && x3 + F < e) {
        return x3
      }

      if (x1 + F > 0 && x1 + F < e) {
        return x1
      }
    }
  }

  return NaN;
}

/**
 * Gets the comparision string relation between a and b values
 * @param a
 * @param b
 * @returns '<' if a<b, '=' if a==b and '>' if a>b
 */
export function compareInfo(
  a: number,
  b: number): string {

  if (a < b)
    return "<"
  else if (a == b)
    return "="
  else
    return ">"
}

/**
 * Flexion tab, function to calculate CCC, QCC
 * @param BFL
 * @param AEF
 * @param GCF
 * @param GTF
 * @param HFL
 * @param d
 * @param Ast
 * @param Asc
 * @param n Nsquasi or Nscara
 * @param Mom Msquasi or Mscara
 * @returns
 */
export function getSigmaC(
  BFL: number,
  AEF: number,
  GCF: number,
  GTF: number,
  HFL: number,
  d: number,
  Ast: number,
  Asc: number,
  n: number,
  Mom: number,
): number {

  let sigc: number

  let x: number,
    Ine: number,
    mom2: number

  let vc = (GCF * AEF * Asc + HFL / 2 * BFL * HFL + d * AEF * Ast) / (AEF * Asc + AEF * Ast + BFL * HFL)

  if (n == 0) {
    //'flexion simple

    x = equ2(BFL / 2, AEF * Asc + AEF * Ast, -AEF * GCF * Asc - AEF * d * Ast, HFL)
    let Ine = BFL * x * x * x / 3 + AEF * Ast * (d - x) * (d - x) + AEF * (x - GCF) ** 2 * Asc
    sigc = Mom * x / Ine
    if (sigc < 0) {
      sigc = 0
    }
  }
  else if (n > 0 && Mom / n - (HFL / 2 - vc) <= HFL / 6 && Mom / n - (HFL / 2 - vc) >= -HFL / 6) {
    // section entierement comprimée

    x = (AEF * Ast * d + AEF * Asc * GCF + BFL * HFL * HFL / 2) / (AEF * Ast + AEF * Asc + BFL * HFL)
    mom2 = Mom + n * (x - HFL / 2)
    Ine = BFL * HFL ** 3 / 3 - BFL * HFL * x ** 2 + AEF * Ast * (d ** 2 - x ** 2) + AEF * Asc * (GCF ** 2 - x ** 2)
    sigc = Math.max(Math.abs(n / (BFL * HFL + AEF * Ast + AEF * Asc) + mom2 * x / Ine), Math.abs(n / (BFL * HFL + AEF * Ast + AEF * Asc) - mom2 * (HFL - x) / Ine))
  }
  else if (n < 0 && (Mom / n >= -(HFL / 2 - GCF) && Mom / n <= (HFL / 2 - GTF))) {
    // section entièrement tendue

    x = 0
    if (Asc == 0) {
      throw "Section entièrement tendue, donner une valeur de Asc"
    } else {
      sigc = 0
    }
  } else {
    // section partiellement comprimée

    let ce = HFL / 2 - Mom / n
    let p = -3 * ce ** 2 + 6 * AEF * Ast / BFL * (d - ce) + 6 * AEF * Asc / BFL * (GCF - ce)
    let q = -2 * ce ** 3 - 6 * AEF * Ast / BFL * (d - ce) ** 2 - 6 * AEF * Asc / BFL * (GCF - ce) ** 2

    let y = equ3(1, 0, p, q, HFL, ce)

    x = y + ce
    sigc = n * x / (0.5 * BFL * (x ** 2) - AEF * Ast * (d - x) - AEF * Asc * (GCF - x))
  }

  return sigc;
}


/**
 * Flexion tab
 * @param BFL
 * @param AEF
 * @param GCF
 * @param GTF
 * @param HFL
 * @param d
 * @param Ast
 * @param Asc
 * @param n
 * @param mom
 * @returns
 */
export function getSigmaS(
  BFL: number,
  AEF: number,
  GCF: number,
  GTF: number,
  HFL: number,
  d: number,
  Ast: number,
  Asc: number,
  n: number,
  mom: number,
): number {

  let sigs: number;

  let
    sigc: number,
    x: number,
    ce: number,
    p: number,
    q: number,
    y: number,
    vc: number,
    mom2: number,
    Ine: number;

  vc = (GCF * AEF * Asc + HFL / 2 * BFL * HFL + d * AEF * Ast) / (AEF * Asc + AEF * Ast + BFL * HFL)

  if (n == 0) {
    // flexion simple

    x = equ2(BFL / 2, AEF * Asc + AEF * Ast, -AEF * GCF * Asc - AEF * d * Ast, HFL)
    Ine = BFL * x * x * x / 3 + AEF * Ast * (d - x) * (d - x) + AEF * (x - GCF) ** 2 * Asc

    sigs = AEF * mom * (d - x) / Ine
  }
  else if (n > 0 && mom / n - (HFL / 2 - vc) <= HFL / 6 && mom / n - (HFL / 2 - vc) >= -HFL / 6) {
    // section entierement comprimée

    x = (AEF * Ast * d + AEF * Asc * GCF + BFL * HFL * HFL / 2) / (AEF * Ast + AEF * Asc + BFL * HFL)
    mom2 = mom + n * (x - HFL / 2)
    Ine = BFL * HFL ** 3 / 3 - BFL * HFL * x ** 2 + AEF * Ast * (d ** 2 - x ** 2) + AEF * Asc * (GCF ** 2 - x ** 2)

    sigs = -Math.abs(AEF * (n / (BFL * HFL + AEF * Ast + AEF * Asc) - mom2 * (HFL - x - GTF) / Ine))
  }
  else if (n < 0 && (mom / n >= -(HFL / 2 - GCF) && mom / n <= (HFL / 2 - GTF))) {
    // section entièrement tendue

    if (Asc == 0) {
      throw "Section entièrement tendue, donner une valeur de Asc"
    } else {
      ce = HFL / 2 - mom / n
      sigs = Math.abs(n * (ce - GCF) / ((d - GCF) * Ast))
    }
  } else {
    // section partiellement comprimée

    ce = HFL / 2 - mom / n
    p = -3 * ce ** 2 + 6 * AEF * Ast / BFL * (d - ce) + 6 * AEF * Asc / BFL * (GCF - ce)
    q = -2 * ce ** 3 - 6 * AEF * Ast / BFL * (d - ce) ** 2 - 6 * AEF * Asc / BFL * (GCF - ce) ** 2

    y = equ3(1, 0, p, q, HFL, ce)

    x = y + ce
    sigc = n * x / (0.5 * BFL * (x ** 2) - AEF * Ast * (d - x) - AEF * Asc * (GCF - x))
    sigs = AEF * sigc * (d - x) / x
  }

  return sigs;
}

/**
 * Flexion tab
 * @param BFL
 * @param Asc
 * @param Ast
 * @param AEF
 * @param d
 * @param HFL
 * @param GCF
 * @param GTF
 * @param n
 * @param mom
 * @returns
 */
export function getSigmaS2(
  BFL: number,
  Asc: number,
  Ast: number,
  AEF: number,
  d: number,
  HFL: number,
  GCF: number,
  GTF: number,
  n: number,
  mom: number,
) {

  let sigs2: number;

  let
    x: number,
    sigc: number,
    ce: number,
    p: number,
    q: number,
    y: number,
    vc: number,
    mom2: number,
    Ine: number;

  vc = (GCF * AEF * Asc + HFL / 2 * BFL * HFL + d * AEF * Ast) / (AEF * Asc + AEF * Ast + BFL * HFL)

  if (n == 0) {
    // flexion simple

    x = equ2(BFL / 2, AEF * Asc + AEF * Ast, -AEF * GCF * Asc - AEF * d * Ast, HFL)
    Ine = BFL * x * x * x / 3 + AEF * Ast * (d - x) * (d - x) + AEF * (x - GCF) ** 2 * Asc

    sigs2 = AEF * mom * (x - GCF) / Ine
  }
  else if (n > 0 && mom / n - (HFL / 2 - vc) <= HFL / 6 && mom / n - (HFL / 2 - vc) >= -HFL / 6) {
    // section entierement comprimée

    x = (AEF * Ast * d + AEF * Asc * GCF + BFL * HFL * HFL / 2) / (AEF * Ast + AEF * Asc + BFL * HFL)
    mom2 = mom + n * (x - HFL / 2)
    Ine = BFL * HFL ** 3 / 3 - BFL * HFL * x ** 2 + AEF * Ast * (d ** 2 - x ** 2) + AEF * Asc * (GCF ** 2 - x ** 2)

    sigs2 = -Math.abs(AEF * (n / (BFL * HFL + AEF * Ast + AEF * Asc) + mom2 * (x - GCF) / Ine))
  }
  else if (n < 0 && (mom / n >= -(HFL / 2 - GCF) && mom / n <= (HFL / 2 - GTF))) {
    // section entièrement tendue
    x = 0
    if (Asc == 0) {
      throw "Section entièrement tendue, donner une valeur de Asc"
    } else {

      ce = HFL / 2 - mom / n
      sigs2 = Math.abs(n * (d - ce) / ((d - GCF) * Asc))
    }
  } else {
    // section partiellement comprimée

    ce = HFL / 2 - mom / n
    p = -3 * ce ** 2 + 6 * AEF * Ast / BFL * (d - ce) + 6 * AEF * Asc / BFL * (GCF - ce)
    q = -2 * ce ** 3 - 6 * AEF * Ast / BFL * (d - ce) ** 2 - 6 * AEF * Asc / BFL * (GCF - ce) ** 2

    y = equ3(1, 0, p, q, HFL, ce)

    x = y + ce
    sigc = n * x / (0.5 * BFL * (x ** 2) - AEF * Ast * (d - x) - AEF * Asc * (GCF - x))

    if (Asc == 0) {
      sigs2 = 0
    } else {
      sigs2 = -AEF * sigc * (x - GCF) / x
    }
  }

  return sigs2;
}

/**
 * Get the "small" version of KUNIT (1/100/1000)
 * @param UNIT literal unit (MN/T/KN)
 * @returns (1/100/1000/NaN) resp. for (MN/T/KN/...)
 */
export function getSmallKUnit(UNIT: EnumUNIT) {
  return UNIT == EnumUNIT.KN ? 1000 : (UNIT == EnumUNIT.T) ? 100 : (UNIT == EnumUNIT.MN) ? 1 : NaN;
}

/**
 * Flexion function
 * Etat limite de service (ELS)
 * Etat limite ultime (ELU)
 * @param BFL
 * @param Asc
 * @param Ast
 * @param AEF
 * @param d
 * @param HFL
 * @param GCF
 * @param GTF
 * @param ns Nscara Or Nsquasi
 * @param ms Mscara Or Msquasi
 * @returns class to update
 */
export function contraintesELS(
  BFL: number,
  Asc: number,
  Ast: number,
  AEF: number,
  d: number,
  HFL: number,
  GCF: number,
  GTF: number,
  ns: number,
  ms: number,
): ElsParams {

  let result: ElsParams = {
    k2: NaN,
    sigc: NaN,
    sigct: NaN,
    sigs: NaN,
    sigs2: NaN,
    x: NaN
  };

  let ce: number,
    p: number,
    q: number,
    y: number,
    sh: number,
    yg: number,
    ig: number,
    vc: number,
    eps1: number,
    eps2: number,
    mom2: number,
    Ine: number;

  vc = (GCF * AEF * Asc + HFL / 2 * BFL * HFL + d * AEF * Ast) / (AEF * Asc + AEF * Ast + BFL * HFL)
  // vt = (_GCF * _AEF * Asc + d * _AEF * Ast) / (_AEF * Asc + _AEF * Ast)

  if (ns == 0) {
    // flexion simple

    result.x = equ2(BFL / 2, AEF * Asc + AEF * Ast, -AEF * GCF * Asc - AEF * d * Ast, HFL)
    Ine = BFL * result.x * result.x * result.x / 3 + AEF * Ast * (d - result.x) * (d - result.x) + AEF * (result.x - GCF) ** 2 * Asc
    result.sigc = ms * result.x / Ine
    if (result.sigc < 0) {
      result.sigc = 0
    }

    result.sigs = AEF * ms * (d - result.x) / Ine
    result.sigs2 = AEF * ms * (result.x - GCF) / Ine

    result.k2 = 0.5

    // calcul de sigct
    sh = BFL * HFL + Asc * AEF + Ast * AEF
    yg = (GCF * Asc * AEF + BFL * HFL ** 2 / 2 + d * Ast * AEF) / sh
    ig = BFL * HFL ** 3 / 3 + GCF ** 2 * Asc * AEF + d ** 2 * Ast * AEF - yg ** 2 * sh
    //result.sigct = -ns / sh + ms / ig * (HFL - yg)

  }
  else if (ns > 0 && ms / ns - (HFL / 2 - vc) <= HFL / 6 && ms / ns - (HFL / 2 - vc) >= -HFL / 6) {
    // section entierement comprimée

    result.x = (AEF * Ast * d + AEF * Asc * GCF + BFL * HFL * HFL / 2) / (AEF * Ast + AEF * Asc + BFL * HFL)
    mom2 = ms + ns * (result.x - HFL / 2)
    Ine = BFL * HFL ** 3 / 3 - BFL * HFL * result.x ** 2 + AEF * Ast * (d ** 2 - result.x ** 2) + AEF * Asc * (GCF ** 2 - result.x ** 2)
    result.sigc = Math.max(Math.abs(ns / (BFL * HFL + AEF * Ast + AEF * Asc) + mom2 * result.x / Ine), Math.abs(ns / (BFL * HFL + AEF * Ast + AEF * Asc) - mom2 * (HFL - result.x) / Ine))

    result.sigs = -Math.abs(AEF * (ns / (BFL * HFL + AEF * Ast + AEF * Asc) - mom2 * (HFL - result.x - GTF) / Ine))
    result.sigs2 = -Math.abs(AEF * (ns / (BFL * HFL + AEF * Ast + AEF * Asc) + mom2 * (result.x - GCF) / Ine))

    result.k2 = 0
    //result.sigct = 0
  }
  else if (ns < 0 && (ms / ns >= -(HFL / 2 - GCF) && ms / ns <= (HFL / 2 - GTF))) {
    // section entièrement tendue
    result.x = 0
    if (Asc == 0) {
      throw "Section entièrement tendue, donner une valeur de Asc"
    } else {

      ce = HFL / 2 - ms / ns
      result.sigs2 = Math.abs(ns * (d - ce) / ((d - GCF) * Asc))
      result.sigc = 0
      result.sigs = Math.abs(ns * (ce - GCF) / ((d - GCF) * Ast))
      //r.sigct = (((n * (ce - GCF) / ((d - GCF) * Ast)) - (n * (d - ce) / ((d - GCF) * Asc))) / (HFL - GCF) + (n * (d - ce) / ((d - GCF) * Asc))) / AEF
    }

    eps1 = Math.max(result.sigs, result.sigs2)
    eps2 = Math.min(result.sigs, result.sigs2)
    result.k2 = (eps1 + eps2) / (2 * eps1)

    // calcul de sigct
    sh = BFL * HFL + Asc * AEF + Ast * AEF
    yg = (GCF * Asc * AEF + BFL * HFL ** 2 / 2 + d * Ast * AEF) / sh
    ig = BFL * HFL ** 3 / 3 + GCF ** 2 * Asc * AEF + d ** 2 * Ast * AEF - yg ** 2 * sh
    //result.sigct = (-ns / sh + ms / ig * (HFL - yg))

  } else {
    // section partiellement comprimée

    ce = HFL / 2 - ms / ns
    p = -3 * ce ** 2 + 6 * AEF * Ast / BFL * (d - ce) + 6 * AEF * Asc / BFL * (GCF - ce)
    q = -2 * ce ** 3 - 6 * AEF * Ast / BFL * (d - ce) ** 2 - 6 * AEF * Asc / BFL * (GCF - ce) ** 2

    y = equ3(1, 0, p, q, HFL, ce)

    result.x = y + ce
    result.sigc = ns * result.x / (0.5 * BFL * (result.x ** 2) - AEF * Ast * (d - result.x) - AEF * Asc * (GCF - result.x))
    result.sigs = AEF * result.sigc * (d - result.x) / result.x
    if (Asc == 0) {
      result.sigs2 = 0
    } else {
      result.sigs2 = -AEF * result.sigc * (result.x - GCF) / result.x
    }

    result.k2 = 0.5

    // calcul de sigct
    sh = BFL * HFL + Asc * AEF + Ast * AEF
    yg = (GCF * Asc * AEF + BFL * HFL ** 2 / 2 + d * Ast * AEF) / sh
    ig = BFL * HFL ** 3 / 3 + GCF ** 2 * Asc * AEF + d ** 2 * Ast * AEF - yg ** 2 * sh
    //result.sigct = (-ns / sh + ms / ig * (HFL - yg))
  }

  return result;
}

export interface ElsParams {
  x: number;
  sigc: number;
  sigs: number;
  sigs2: number;
  k2: number;
  sigct: number;
}

/**
 * Bending/Flexion function returning the XQC param
 * Note: initially via contraintesELS function
 * @param BFL
 * @param Asc
 * @param Ast
 * @param AEF
 * @param d
 * @param HFL
 * @param GCF
 * @param GTF
 * @param ns Nscara Or Nsquasi
 * @param ms Mscara Or Msquasi
 * @returns class to update
 */
export function getBendingX(
  BFL: number,
  Asc: number,
  Ast: number,
  AEF: number,
  d: number,
  HFL: number,
  GCF: number,
  GTF: number,
  ns: number,
  ms: number,
): number {

  let x = NaN

  let ce: number,
    p: number,
    q: number,
    y: number,
    vc: number

  vc = (GCF * AEF * Asc + HFL / 2 * BFL * HFL + d * AEF * Ast) / (AEF * Asc + AEF * Ast + BFL * HFL)

  if (ns == 0) {
    // flexion simple
    x = equ2(BFL / 2, AEF * Asc + AEF * Ast, -AEF * GCF * Asc - AEF * d * Ast, HFL)

  }
  else if (ns > 0 && ms / ns - (HFL / 2 - vc) <= HFL / 6 && ms / ns - (HFL / 2 - vc) >= -HFL / 6) {
    // section entierement comprimée
    x = (AEF * Ast * d + AEF * Asc * GCF + BFL * HFL * HFL / 2) / (AEF * Ast + AEF * Asc + BFL * HFL)

  }
  else if (ns < 0 && (ms / ns >= -(HFL / 2 - GCF) && ms / ns <= (HFL / 2 - GTF))) {
    // section entièrement tendue
    x = 0

  } else {
    // section partiellement comprimée

    ce = HFL / 2 - ms / ns
    p = -3 * ce ** 2 + 6 * AEF * Ast / BFL * (d - ce) + 6 * AEF * Asc / BFL * (GCF - ce)
    q = -2 * ce ** 3 - 6 * AEF * Ast / BFL * (d - ce) ** 2 - 6 * AEF * Asc / BFL * (GCF - ce) ** 2
    y = equ3(1, 0, p, q, HFL, ce)

    x = y + ce
  }

  return x;
}

/**
 * Moment résistant béton par rapport à axe armatures tendu
 * @param z1
 * @param ec2
 * @param para
 * @param d
 * @param dzeta
 * @param n
 * @returns
 */
export function simpson1(
  z1: number,
  ec2: number,
  para: number,
  d: number,
  dzeta: number,
  n: number) {
  // let i: number, j: number
  // 'j = 0
  // 'simpson1 = 0
  // 'For i = 0.001 To z1 Step 0.0001
  // '    simpson1 = simpson1 + (i - j) / 6 * ((1 - (1 - j * para / ec2) ** n) * (j + d - dzeta * d) + 4 * (1 - (1 - (i + j) / 2 * para / ec2) ** n) * ((i + j) / 2 + d - dzeta * d) + (1 - (1 - i * para / ec2) ** n) * (i + d - dzeta * d))
  // '    j = i
  // 'Next i

  // Moment résistant béton par rapport à axe armatures tendu
  return (z1 + ec2 / (para * (n + 1)) * (Math.abs(1 - z1 * para / ec2)) ** (n + 1)) * (z1 + d - dzeta * d) - ec2 / (para * (n + 1)) * (d - dzeta * d) - z1 ** 2 / 2 - ec2 ** 2 / (para ** 2 * (n + 1) * (n + 2)) * (Math.abs(1 - z1 * para / ec2)) ** (n + 2) - ec2 ** 2 / (para ** 2 * (n + 1) * (n + 2))
}

/**
 * Effort normal résistant béton
 * Flexion/Bendling tab
 * @param z1
 * @param ec2
 * @param para
 * @param n
 * @returns
 */
export function simpson2(
  z1: number,
  ec2: number,
  para: number,
  n: number) {
  // let i: number, j: number
  // 'j = 0
  // 'simpson2 = 0
  // 'For i = 0.001 To z1 Step 0.00001
  // '    simpson2 = simpson2 + (i - j) / 6 * ((1 - (1 - j * para / ec2) ** n) + 4 * (1 - (1 - (i + j) / 2 * para / ec2) ** n) + (1 - (1 - i * para / ec2) ** n))
  // '    j = i
  // 'Next i

  // Effort normal résistant béton
  return z1 + ec2 / (para * (n + 1)) * (Math.abs(1 - z1 * para / ec2)) ** (n + 1) - ec2 / (para * (n + 1))
}

/**
 * Flexion tab
 * @param EC2
 * @param para
 * @param d
 * @param dzeta
 * @param N
 * @returns
 */
export function getIntegrale(
  EC2: number,
  para: number,
  d: number,
  dzeta: number,
  N: number): number {
  return simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2);
}

/**
 * Flexion tab
 * @param EC2
 * @param para
 * @param d
 * @param dzeta
 * @param N
 * @returns
 */
export function getIntegrale2(
  EC2: number,
  para: number,
  d: number,
  dzeta: number,
  N: number): number {

  return simpson2(EC2 / para, EC2, para, N) + (dzeta * d - EC2 / para);
}

/**
 * returns a ParamString used for translation of messages to GUI
 * @param template translation key, that can contain interpolated parameters like this: {{param1}}
 * @param params object, with keys the param names, and values as param values to replace in template
 * @returns ParamString object used by the translator
 */
export function toParamString(template: string, params: Object | undefined): ParamString {
  return {
    text: template,
    params: params
  }
}

export function toFixedTrimmed(n: number, fractionDigits?: number | undefined) {
  return parseFloat(n.toFixed(fractionDigits))
}


/** Array used by getAutoAsc(t)Array functions */
const TabdiaBauto = [0, 6, 8, 10, 12, 14, 16, 20, 25, 32, 40];

/**
 * Get the Ast Array when the BAUTO is activated (Flexion/Bending tab)
 * @param HFL 
 * @param BFL  
 * @param AST1 
 * @returns Array [
 * [NAST1, LAST1],
 * [NAST2, LAST2],
 * [NAST3, LAST3]
 * ]
 */
export function getAutoAstArray(HFL: number, BFL: number, AST1: number): number[][] {
  let asts = [[0, 0], [0, 0], [0, 0]];
  let Ast = AST1 / 10000;

  const diamax = Math.min(Math.floor(HFL * 100), 40); //40
  const nbmax = Math.floor(BFL / 0.1); //30

  let i = 1;
  let j = 1;
  let nb = 0;
  let aire: number; //= ASTB * 0.0001; //0.0005

  do {
    nb++;
    if (nb > nbmax && i !== 10) {
      nb = 1;
      i++;
    }
    if (TabdiaBauto[i] >= diamax) {
      j++;
    }
    aire = Math.PI * ((TabdiaBauto[i] * 0.001) ** 2) * nb / 4 * j;

    // [NAST1, LAST1]
    asts[0] = [nb * j, TabdiaBauto[i]];

  } while (aire < Ast);

  return asts;
}


/**
 * Get the Asc Array when the BAUTO is activated (Flexion/Bending tab)
 * @param HFL 
 * @param BFL 
 * @param ASC1 
 * @returns Array [
 * [NASC1, LASC1],
 * [NASC2, LASC2],
 * [NASC3, LASC3]
 * ]
 */
export function getAutoAscArray(HFL: number, BFL: number, ASC1: number): number[][] {

  let ascs = [[0, 0], [0, 0], [0, 0]];

  if (ASC1 == 0)
    return ascs;

  let Asc = ASC1 / 10000;

  const diamax = Math.min(Math.floor(HFL * 100), 40); //40
  const nbmax = Math.floor(BFL / 0.1); //30

  let i = 1;
  let j = 1;
  let nb = -1;
  let aire: number; // = ASTB * 0.0001; //0.0005

  do {
    nb++;
    if (nb > nbmax && i !== 10) {
      nb = 1;
      i++;
    }
    if (TabdiaBauto[i] >= diamax) {
      j++;
    }
    aire = Math.PI * ((TabdiaBauto[i] * 0.001) ** 2) * nb / 4 * j;

    ascs[0] = [nb * j, TabdiaBauto[i]];
  } while (aire < Math.abs(Asc));

  ascs[1] = [0, 0];
  ascs[2] = [0, 0];

  return ascs;
}

/**
 * Param: alpha._cw
 * Value ex: 1.00
 * Onglet: ShearForce/EffortTranchant/Torsion
 * Champ: I24/H11(Torsion)
 * C'est le meme calcul que alpha_cw de Torsion, avec param differents
 * @param STA 
 * @param KUNIT 
 * @param BFL 
 * @param HFL 
 * @param FCTM 
 * @param ned 
 * @returns 
 */
export function getAcw(
  STA: EnumSTA,
  KUNIT: number,
  BFL: number,
  HFL: number,
  FCTM: number,
  ned: number,
): number {
  if (BFL == 0 || HFL == 0) {
    throw "b ou h ne peuvent être à 0";
    //return 1;
  }
  let ac = BFL * HFL;

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
    case EnumSTA.RCC_CW_2018:
      return 1;

    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      if (ned * 0.000001 * KUNIT / ac < 0 && ned * 0.000001 * KUNIT / ac <= -FCTM) {
        throw "Sigct > fctm  Erreur, ce cas n'est pas traité dans la NF EN 1992-1-1/NA ";
      }
      if (ned * 0.000001 * KUNIT / ac < 0) {
        return 1 + ned * 0.000001 * KUNIT / ac / FCTM;
      } else {
        return 1;
      }
  }
}

export function isHidden(propertyCode: PropertyCode, propertyValues: Record<PropertyCode, any>): boolean {
  const STA = propertyValues[PropertyCode.STA];

  switch (propertyCode) {

    // Concrete carac. / Carac béton
    case PropertyCode.F0C:
    case PropertyCode.BCTT0:
      switch (STA) {
        case EnumSTA.EN1992_2_BS:
        case EnumSTA.NF_EN_1992_2_NA:
          const FCK: number = propertyValues[PropertyCode.FCK]
          const TSE: boolean = propertyValues[PropertyCode.TSE]
          return (TSE || FCK >= 55)

        case EnumSTA.RCC_CW_2018:
          return true

        default:
          return false
      }

    case PropertyCode.FBTT0:
    case PropertyCode.FDTT0:
      switch (STA) {
        case EnumSTA.EN1992_2_BS:
        case EnumSTA.NF_EN_1992_2_NA:
          const FCK: number = propertyValues[PropertyCode.FCK]
          const TSE: boolean = propertyValues[PropertyCode.TSE]
          return !(FCK >= 55 || TSE)

        case EnumSTA.RCC_CW_2018:
          return false

        default:
          return true
      }

    case PropertyCode.SFC:
    case PropertyCode.TSE:
      return !(STA === EnumSTA.EN1992_2_BS || STA === EnumSTA.NF_EN_1992_2_NA || STA === EnumSTA.RCC_CW_2018);

    // Deflexion / Flèche
    case PropertyCode.AM0D:
      const ENT = propertyValues[PropertyCode.ENT];
      return (ENT !== EnumENT.LOADS);

    case PropertyCode.TACFL:
      const LIFE = propertyValues[PropertyCode.LIFE];
      return LIFE;

    // Bending / Flexion
    // case PropertyCode.MELSC:
    //     case PropertyCode.NELSC:
    //         return STA === EnumSTA.NF_EN_1992_2_NA;
    case PropertyCode.MELSF:
    case PropertyCode.NELSF:
      return STA !== EnumSTA.NF_EN_1992_2_NA;

    // case "Moment.subtitle":
    //     return STA !== EnumSTA.NF_EN_1992_2_NA;
    case PropertyCode.MELSQ:
    case PropertyCode.NELSQ:
      return STA === EnumSTA.NF_EN_1992_2_NA;

    case PropertyCode.CBAR:
      const HCOC = propertyValues[PropertyCode.HCOC];
      return (STA === EnumSTA.NF_EN_1992_2_NA && HCOC);

    case PropertyCode.ASTF:
    case PropertyCode.ASCF:
    case PropertyCode.HCOC:
      return (STA !== EnumSTA.NF_EN_1992_2_NA);

    case PropertyCode.QCF:
      return (STA !== EnumSTA.RCC_CW_2018);

    case PropertyCode.QCC:
      switch (STA) {
        case EnumSTA.EN1992_2_BS:
        case EnumSTA.NF_EN_1992_2_NA:
        case EnumSTA.NF_EN_1992_3_NA:
          return true

        default:
          return false
      }

    // Shear Force / Effort Tranchant
    //case PropertyCode.NEDPI:
    case PropertyCode.SREP:
    case PropertyCode.BFLI:
    case PropertyCode.BESF:
    case PropertyCode.VEDI:
    case PropertyCode.VEDI_INFO:
    case PropertyCode.VRDI:
    case PropertyCode.CDY:
    case PropertyCode.CDY_INFO:
      return (STA === EnumSTA.RCC_CW_2018);

    case PropertyCode.SSAS: {
      let visible = true;
      if (STA === EnumSTA.RCC_CW_2018) {
        return !visible;
      }
      else {
        const VEDI = propertyValues[PropertyCode.VEDI];
        const VRDI = propertyValues[PropertyCode.VRDI];
        const FCK = propertyValues[PropertyCode.FCK];
        const ACC = propertyValues[PropertyCode.ACC];
        const GACF = propertyValues[PropertyCode.GACF];
        visible = (VEDI >= VRDI) && ((0.5 * (0.6 * (1 - FCK / 250)) * (ACC * FCK / GACF)) >= VEDI)
        return !visible
      }
    }

    // Torsion
    case PropertyCode.SLMY:
    case PropertyCode.STMY:
    case PropertyCode.ASSY:
    case PropertyCode.ASSYT:
    case PropertyCode.ASSMY:
    case PropertyCode.VEDYR:
    case PropertyCode.VRDMY:
    case PropertyCode.VRDCY:
      const VEDY = propertyValues[PropertyCode.VEDY];
      return (VEDY === 0);

    // Corbels / Console
    case PropertyCode.SFS:
      return true;

    default:
      return false;
  }

  // if any of the mentionned cases
  return false;
}

/**
 * Bielle de compression / Compression strut
 * VRd,max (t)
 * Value ex: VRd,max =	25.17	t
 * Excel: EffortTranchant.I32
 * @param STA 
 * @param KUNIT 
 * @param BFL 
 * @param HFL 
 * @param GTF 
 * @param ACW 
 * @param str 
 * @param SRSF 
 * @param NEDSF 
 * @param GACF 
 * @param FCK 
 * @param ACC 
 * @param FCTM 
 * @returns VRd,max (t); ex: 25.17
 */
export async function getBasicVRDM(
  STA: EnumSTA,
  KUNIT: number,
  BFL: number,
  HFL: number,
  GTF: number,
  ACW: number,
  str: number,
  SRSF: number,
  NEDSF: number,
  GACF: number,
  FCK: number,
  ACC: number,
  FCTM: number,
): Promise<number> {

  let d = HFL - GTF;
  let z = 0.9 * d;

  let teta = await getTeta(STA, KUNIT, str, NEDSF, BFL, HFL, FCTM, ACC, FCK, GACF);
  let alpha = getRadians(SRSF);

  let v = 0.6 * (1 - FCK / 250)
  let v1: number;
  let vrdmax: number;

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      v1 = v;
      break;

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      v1 = v * (1 - 0.5 * Math.cos(alpha));
      break;

    case EnumSTA.RCC_CW_2018:
      v1 = Math.max(0.6 * (1 - FCK / 250), 0.5)
      break;
  }

  /* procédure de vérification bielle*/
  let fcd = getFcd(ACC, FCK, GACF);
  vrdmax = ACW * BFL * z * v1 * fcd * (1 / Math.tan(teta) + 1 / Math.tan(alpha)) / (1 + (1 / Math.tan(teta)) ** 2) * 1000000.0 / KUNIT;

  return vrdmax;
}

/**
 * N1TO de base (sans correction suite au calcul de TTVV)
 * @param STA
 * @param N622X06
 * @param ATO
 * @param FCK
 * @returns N1TO de base (sans correction suite au calcul de TTVV)
 */
export async function getBasicN1TO(
  STA: EnumSTA,
  N622X06: number,
  ATO: number,
  FCK: number,
): Promise<number> {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      return 0.6 * (1 - FCK / 250); // _N1TO = 0.6 * (1 - fck / 250)

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      let alpha = getRadians(ATO);
      return N622X06 * (1 - 0.5 * Math.cos(alpha)); // _N1TO = _N622X06 * (1 - 0.5 * Cos(alpha))

    case EnumSTA.RCC_CW_2018:
      return NaN; // En attente de Samuel
  }
}

export function isReadonly(propertyCode: PropertyCode, propertyValues: Record<PropertyCode, any>): boolean | undefined {
  if (propertyCode === PropertyCode.STR_SF) {
    return propertyValues[PropertyCode.STA] === EnumSTA.RCC_CW_2018;
  }
  return undefined
}

/**
 * phi_d(t,t0)
 * onglet: Cata béton
 * Excel: line R59 => ...
 * @returns phi_d(t,t0)
 */
export async function getBasicFdtt0(
  STA: EnumSTA,
  TYC: EnumTYC,
  T0C: number,
  FCM: number,
  SFC: boolean,
  FCK: number,
  RH: number,
  TCO: number,
  TSC: number,
  H0C: number,
): Promise<number> {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return NaN;

    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.RCC_CW_2018:
      {
        //=IF(F25=J17;1000*(T32-S86)/1000;3200*(T32-S86)/1000)        
        /*
        F25=J17 - SFC
        T32     - eps._cd,t(STA.2)
        S86     - esp._cd,t0
        */
        let ecdt = await getBasicECDT(EnumSTA.EN1992_2_BS, TYC, TCO, TSC, H0C, RH, FCM, FCK, SFC);
        let ecdt0 = getEcdt0(FCK, RH, T0C, TSC, H0C, SFC);
        return (SFC ? 1000 : 3200) * (ecdt - ecdt0) / 1000;
      }
  }
}


export function getEcdt0(
  FCK: number,
  RH: number,
  T0C: number,
  TSC: number,
  H0C: number,
  SFC: boolean,
): number {
  //=T36*(72*EXP(-0.046*K22)+75-F19)*(F22-F21)*0.000001/((F22-F21)+T37*F31^2)*1000
  /*
T36 - Kfck
K22 - FCK
F19 - RH
F22 - T0C
F21 - TSC
T37 - bcd
F31 - H0C
   */
  let bcd = getBcd(SFC)
  let Kfck = getKfck(FCK)

  return Kfck * (72 * Math.exp(-0.046 * FCK) + 75 - RH) * (T0C - TSC) * 0.000001 / ((T0C - TSC) + bcd * H0C ** 2) * 1000
}
