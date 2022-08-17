import { checkTorsionParams, getTrdc } from '../common/functions';

/**
 * Param: TRDC: T_Rd,c (kN)
 * Value ex: 215.43
 * Onglet: Torsion
 * Champ: B39
 * @param KUNIT
 * @param GTF
 * @param HFL
 * @param GCF
 * @param BFL
 * @param FYK
 * @param GSF
 * @param GACF
 * @param ACT
 * @param FCTK005
 * @param TEF
 * @returns T_Rd,c (kN)
 */
export default async function TRDC(
  KUNIT: number,
  GTF: number,
  HFL: number,
  GCF: number,
  BFL: number,
  FYK: number,
  GSF: number,
  GACF: number,
  ACT: number,
  FCTK005: number,
  TEF: number,
): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  let trdc = getTrdc(ACT, FCTK005, GACF, HFL, BFL, TEF);

  return trdc / KUNIT;
}
