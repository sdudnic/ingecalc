import { EnumSFS, EnumSTA } from '../common/enums';
import { getVminByD } from '../common/functions';

/**
 * Param: v_min
 * Value ex: 0.42
 * Onglet: Torsion.H13
 * @param STA
 * @param SFS
 * @param BFL
 * @param GCF
 * @param FCK
 * @returns v_min, ex .42
 */
export default async function VMY(
  STA: EnumSTA,
  SFS: EnumSFS,
  BFL: number,
  GCF: number,
  FCK: number,
): Promise<number> {

  let dy = BFL - GCF;
  return getVminByD(dy, STA, SFS, FCK);
}
