import { EnumCON, EnumSREP, ErrorLevel, SettingProperty } from '../common/enums';
import * as Common from '../common/functions';
import { getRadians, getSettingValue, throwCalculatorError } from '../common/functions';

/**
 * Contrainte de cisaillement a l'interface
 * v_Rdi (MPa)
 * Excel: EffortTranchant.K44
 * Value ex: 3.31
 * @param CON
 * @param SREP
 * @param KUNIT
 * @param SRSF
 * @param ASWS
 * @param HFL
 * @param BFL
 * @param BFLI
 * @param GACF
 * @param NEDPI
 * @param GSF
 * @param FYK
 * @param FCK
 * @returns v_Rdi (MPa); ex: 3.31; ou Infinity si devrait pas etre visible
 */
export default async function VRDI(
  CON: EnumCON,
  SREP: EnumSREP,
  KUNIT: number,
  SRSF: number,
  ASWS: number,
  HFL: number,
  BFL: number,
  BFLI: number,
  GACF: number,
  NEDPI: number,
  GSF: number,
  FYK: number,
  FCK: number,
  VEDI: number,
  CDY: boolean
): Promise<number> {



  let fcd: number = FCK / GACF;
  let alpha: number = getRadians(SRSF);
  let cu: number;
  let mu: number;
  let ro = (ASWS * 0.0001) / BFLI;
  let fctd = await getSettingValue(CON, SettingProperty.FCTK005) / GACF;
  let ac: number = BFL * HFL;
  let fyd: number = FYK / GSF;
  let v = 0.6 * (1 - FCK / 250);

  switch (SREP) {
    case EnumSREP.VSMOOTH: // Très lisse
      cu = 0.025;
      mu = 0.5;
      break;
    case EnumSREP.SMOOTH: // Lisse
      cu = 0.2;
      mu = 0.6;
      break;
    case EnumSREP.ROUGH: // Rugueuse
      cu = 0.4;
      mu = 0.7;
      break;
    default:
      cu = 0.5;
      mu = 0.9;
      break;
  }

  let sig1: number = NEDPI * KUNIT / 1000000.0 / ac;
  let sign: number;

  if (sig1 < 0.6 * fcd) {
    sign = sig1;
  } else {
    sign = 0.6 * fcd
  }
  if (CDY) {
    cu = cu / 2;
  }
  let vrdi: number = Math.min(cu * fctd + mu * sign + ro * fyd * (mu * Math.sin(alpha) + Math.cos(alpha)), 0.5 * v * fcd);

  await checkVRDI(CON, SREP, KUNIT, SRSF, HFL, BFL, BFLI, GACF, NEDPI, GSF, FYK, VEDI, vrdi, FCK)

  return vrdi;
}

export async function checkVRDI(
  CON: EnumCON,
  SREP: EnumSREP,
  KUNIT: number,
  SRSF: number,
  HFL: number,
  BFL: number,
  BFLI: number,
  GACF: number,
  NEDPI: number,
  GSF: number,
  FYK: number,
  VEDI: number,
  VRDI: number,
  FCK: number,
): Promise<void> {

  let fcd: number = FCK / GACF;
  let alpha: number = getRadians(SRSF);
  let cu: number;
  let mu: number;
  let ai: number = BFLI;

  let fctd: number = await Common.getSettingValue(CON, SettingProperty.FCTK005) / GACF;
  let ac: number = BFL * HFL; 4
  let fyd: number = FYK / GSF;
  let v = 0.6 * (1 - FCK / 250);

  switch (SREP) {
    case EnumSREP.VSMOOTH: // Très lisse
      cu = 0.025;
      mu = 0.5;
      break;
    case EnumSREP.SMOOTH: // Lisse
      cu = 0.2;
      mu = 0.6;
      break;
    case EnumSREP.ROUGH: // Rugueuse
      cu = 0.4;
      mu = 0.7;
      break;
    default:
      cu = 0.5;
      mu = 0.9;
      break;
  }

  let sig1: number = NEDPI * KUNIT / 1000000.0 / ac;
  let sign: number;

  if (sig1 < 0.6 * fcd) {
    sign = sig1;
  } else {
    sign = 0.6 * fcd
  }

  if (VEDI < VRDI) {
    //Common.displayMessage("VRDI", "Vedi<Vrdi, contrainte de cisaillement admissible", "black");
  } else {
    if (0.5 * v * fcd > VEDI) {
      let Asw_smin = ai * (VEDI - cu * fctd - mu * sign) / (fyd * (mu * Math.sin(alpha) + Math.cos(alpha))) * 10000;
      throwCalculatorError(`Vedi > Vrdi, contrainte de cisaillement non admissible; section d'acier nécessaire pour respecter la contrainte: ${Asw_smin} cm²/ml`, "VRDI", undefined, VRDI, ErrorLevel.ERROR);
    }
    else {
      throwCalculatorError("Vedi > Vrdi, contrainte de cisaillement non admissible", "VRDI", undefined, VRDI, ErrorLevel.ERROR);
    }
  }
}
