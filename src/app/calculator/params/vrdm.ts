import { EnumSTA, PropertyCode } from '../common/enums';
import { checkStrut, getBasicVRDM, getFcd, getRadians, getTeta } from '../common/functions';

/**
 * Bielle de compression / Compression strut
 * VRd,max (t)
 * Value ex: VRd,max =	25.17	t
 * Excel: ShareForce/EffortTranchant.I32
 * @param STA
 * @param KUNIT
 * @param BFL
 * @param HFL
 * @param GTF
 * @param ACW
 * @param STR_SF
 * @param SRSF
 * @param VED
 * @param NEDSF
 * @param GACF
 * @param FCK
 * @param ACC
 * @param FCTM
 * @returns VRd,max (t); ex: 25.17
 */
export default async function VRDM(
  STA: EnumSTA,
  KUNIT: number,
  BFL: number,
  HFL: number,
  GTF: number,
  ACW: number,
  STR_SF: number,
  SRSF: number,
  VED: number,
  NEDSF: number,
  GACF: number,
  FCK: number,
  ACC: number,
  FCTM: number,
): Promise<number> {

  checkStrut(STR_SF, PropertyCode.STR_SF, STA, KUNIT, NEDSF, BFL, HFL, FCTM);

  let d = HFL - GTF;
  let z = 0.9 * d;

  let teta = await getTeta(STA, KUNIT, STR_SF, NEDSF, BFL, HFL, FCTM, ACC, FCK, GACF);
  let alpha = getRadians(SRSF);

  let v = 0.6 * (1 - FCK / 250)

  let vrdmax: number;

  /* procédure de vérification bielle*/
  vrdmax = await getBasicVRDM(STA, KUNIT, BFL, HFL, GTF, ACW, STR_SF, SRSF, NEDSF, GACF, FCK, ACC, FCTM)

  if (vrdmax < VED) {
    let v1: number;

    switch (STA) {
      case EnumSTA.RCC_CW_2018:
        v1 = Math.max(0.6 * (1 - FCK / 250), 0.5)
        break;
      case EnumSTA.BS_EN_1992_1_1_NA:
      case EnumSTA.BS_EN_1992_3_NA:
        if (FCK <= 60) {
          v1 = 0.54 * (1 - 0.5 * Math.cos(alpha));
        } else {
          v1 = Math.max((0.9 - FCK / 200) * (1 - 0.5 * Math.cos(alpha)), 0.5)
        }
        break;
      default:
        if (FCK <= 60) {
          v1 = 0.6;
        } else {

          v1 = Math.max(0.9 - FCK / 200, 0.5)
        }
        break;
    }
    let fcd = getFcd(ACC, FCK, GACF)
    vrdmax = ACW * BFL * z * v1 * fcd * (1 / Math.tan(teta) + 1 / Math.tan(alpha)) / (1 + (1 / Math.tan(teta)) ** 2) * 1000000.0 / KUNIT;
  }

  return vrdmax;
}