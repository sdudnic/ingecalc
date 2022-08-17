import { getFcd, getRadians, getVrdMax } from '../common/functions';

/**
 * Param: V_Rd,max,z (t)
 * Value ex: 59.88
 * Onglet: Torsion
 * Champ: H38
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
 * @returns V_Rd,max,z (t); ex: 59.88
 */
export default async function VRDMZ(
  KUNIT: number,
  HFL: number,
  BFL: number,
  GTF: number,
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
  let dz = HFL - GTF;
  let fcd = getFcd(ACC, FCK, GACF);
  let vrdmaxz = getVrdMax(dz, BFL, alpha, teta, fcd, ACW, N1TO);

  return vrdmaxz / KUNIT;
}
