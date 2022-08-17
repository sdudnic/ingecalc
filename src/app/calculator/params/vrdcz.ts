import { EnumSFS, EnumSTA } from '../common/enums';
import { getFcd, getKByD, getRolByD, getSigmaCp, getVminByD, getVrdc } from '../common/functions';

/**
 * Param: V_Rd,c,z (t)
 * Value ex: 5.31
 * Onglet: Torsion
 * Champ: H39
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
 * @returns V_Rd,c,z (t); ex: 5.31
 */
export default async function VRDCZ(
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
  GTF: number,
  GACF: number,
  NEDT: number,
): Promise<number> {

  let dz = HFL - GTF;
  let kz = getKByD(dz);
  let vminz = getVminByD(dz, STA, SFS, FCK);
  let rolz = getRolByD(dz, BFL, ASLSF);

  let fcd = getFcd(ACC, FCK, GACF);
  let sigcp = getSigmaCp(NEDT, HFL, BFL, KUNIT, fcd);

  let vrdcz = getVrdc(dz, kz, rolz, sigcp, BFL, vminz, CRDC622, FCK, K1622);

  return vrdcz / KUNIT;
}
