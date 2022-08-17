import { checkTorsionParams, getTrdMax } from '../common/functions';

/**
 * Param: T_Rd,max (t)
 * Value ex: 8.30
 * Onglet: Torsion
 * Champ: B38
 * @param GTF
 * @param HFL
 * @param GCF
 * @param BFL
 * @param FYK
 * @param GSF
 * @param GACF
 * @param KUNIT
 * @param ACC
 * @param FCK
 * @param STR_TO
 * @param N622X06
 * @param ACW
 * @param TEF
 * @returns T_Rd,max (t)
 */
export default async function TRDM(
  GTF: number,
  HFL: number,
  GCF: number,
  BFL: number,
  FYK: number,
  GSF: number,
  GACF: number,
  KUNIT: number,
  ACC: number,
  FCK: number,
  STR_TO: number,
  N622X06: number,
  ACW: number,
  TEF: number,
): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  var trdmax = getTrdMax(HFL, BFL, ACC, FCK, GACF, STR_TO, N622X06, ACW, TEF);
  return trdmax / KUNIT;
}
