import { EnumSTA } from '../common/enums';
import { getDegrees, getTeta } from '../common/functions';

/**
 * theta' (°) TPSF
 * Value ex: 39.2
 * Excel: ShareForce/Eff.Trachant.C39
 * @param STA
 * @param KUNIT
 * @param BFL
 * @param HFL
 * @param GTF
 * @param STR_SF
 * @param NEDSF
 * @param ASF
 * @param CNOM
 * @param ACC
 * @param FCTM
 * @param FCK
 * @param GACF
 * @returns theta' (°), ex: 39.2
 */
export default async function TPSF(
  STA: EnumSTA,
  KUNIT: number,
  BFL: number,
  HFL: number,
  GTF: number,
  STR_SF: number,
  NEDSF: number,
  ASF: number,
  CNOM: number,
  ACC: number,
  FCTM: number,
  FCK: number,
  GACF: number,
): Promise<number> {

  let cnom = CNOM / 1000;
  let d = HFL - GTF;
  let z = 0.9 * d;
  let teta = await getTeta(STA, KUNIT, STR_SF, NEDSF, BFL, HFL, FCTM, ACC, FCK, GACF);
  let coteta2 = (ASF + z * 1 / Math.tan(teta) - cnom) / (2 * z)
  let teta2 = Math.atan(1 / coteta2);
  let result = getDegrees(teta2);
  return result;
}
