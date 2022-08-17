import { EnumSFS, EnumSTA } from '../common/enums';
import { getFcd, getKByD, getRolByD, getSigmaCp, getVminByD, getVrdc } from '../common/functions';

/**
 * Param: V_Rd,c,y (t)
 * Value ex: 5.76
 * Onglet: Torsion
 * Champ: E39
 * @param STA
 * @param SFS
 * @param KUNIT
 * @param HFL
 * @param BFL
 * @param CRDC622
 * @param K1622
 * @param ASLSF
 * @param ACC
 * @param FCK
 * @param GCF
 * @param GACF
 * @param NEDT
 * @returns V_Rd,c,y (t); ex: 5.76
 */
export default async function VRDCY(
  STA: EnumSTA,
  SFS: EnumSFS,
  KUNIT: number,
  HFL: number,
  BFL: number,
  CRDC622: number,
  K1622: number,
  ASLSF: number,
  ACC: number,
  FCK: number,
  GCF: number,
  GACF: number,
  NEDT: number,
): Promise<number> {

  let dy = BFL - GCF;
  let ky = getKByD(dy);
  let vminy = getVminByD(dy, STA, SFS, FCK);
  let roly = getRolByD(dy, HFL, ASLSF);

  let fcd = getFcd(ACC, FCK, GACF);
  let sigcp = getSigmaCp(NEDT, HFL, BFL, KUNIT, fcd);

  let vrdcy = getVrdc(dy, ky, roly, sigcp, HFL, vminy, CRDC622, FCK, K1622);

  return vrdcy / KUNIT;
}
