import { getFcd, getRadians, getVrdMax } from '../common/functions';

/**
 * Param: V_Rd,max,y (t)
 * Value ex: 52.27
 * Onglet: Torsion
 * Champ: E38
 * @param KUNIT
 * @param HFL
 * @param BFL
 * @param GCF
 * @param ATO
 * @param STR_TO
 * @param ACC
 * @param FCK
 * @param GACF
 * @param ACW
 * @param N1TO
 * @returns VRd,max,y (t); ex: 52.27
 */
export default async function VRDMY(
  KUNIT: number,
  HFL: number,
  BFL: number,
  GCF: number,
  ATO: number,
  STR_TO: number,
  ACC: number,
  FCK: number,
  GACF: number,
  ACW: number,
  N1TO: number,
): Promise<number> {

  let alpha = getRadians(ATO);
  let teta = getRadians(STR_TO);
  let dy = BFL - GCF;
  let fcd = getFcd(ACC, FCK, GACF);
  let vrdmaxy = getVrdMax(dy, HFL, alpha, teta, fcd, ACW, N1TO);

  return vrdmaxy / KUNIT;
}
