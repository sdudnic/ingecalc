import { EnumSTA } from '../common/enums';
import { getAcw } from '../common/functions';

/**
 * Param: alpha._cw
 * Value ex: 1.00
 * Excel: ShearForce/EffortTranchant.I24
 * C'est le meme calcul que alpha_cw (ACWT) de Torsion,
 * avec param differents
 * @param STA 
 * @param KUNIT 
 * @param BFL 
 * @param HFL  
 * @param FCTM 
 * @param NEDSF 
 * @returns alpha._cw, ex. 1.00
 */
export default async function ACW(
  STA: EnumSTA,
  KUNIT: number,
  BFL: number,
  HFL: number,
  FCTM: number,
  NEDSF: number,
): Promise<number> {

  let acw = await getAcw(STA, KUNIT, BFL, HFL, FCTM, NEDSF);
  return acw;
}