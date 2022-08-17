import { getRadians } from '../common/functions';

/**
 * σEd,c strut (s1) (MPa)
 * Value Ex: 0.59
 * Excel: ShearForce/EffortTranchant.C37
 * @param KUNIT 
 * @param BFL 
 * @param HFL 
 * @param VED 
 * @param CNOM 
 * @param STR_SF 
 * @param GTF 
 * @param ASF 
 * @returns σEd,c strut (s1) (MPa)
 */
export default async function S1EDCB(
  KUNIT: number,
  BFL: number,
  HFL: number,
  VED: number,
  CNOM: number,
  STR_SF: number,
  GTF: number,
  ASF: number,
): Promise<number> {

  let sigbielle: number;

  let d = HFL - GTF;
  let z = 0.9 * d;
  let teta = getRadians(STR_SF);
  let cnom = CNOM / 1000;

  let coteta2 = (ASF + z * 1 / Math.tan(teta) - cnom) / (2 * z);
  let teta2 = Math.atan(1 / coteta2);
  sigbielle = VED * KUNIT / 1000000 / (Math.sin(teta2) * Math.sin(teta2) * (ASF - cnom)) / BFL;

  return sigbielle;
}
