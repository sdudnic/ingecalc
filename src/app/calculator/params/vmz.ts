import { EnumSFS, EnumSTA } from '../common/enums';
import { getVminByD } from '../common/functions';

/**
 * Param: v_min
 * Value ex: 0.42
 * Onglet: Torsion.H13
 * @param STA
 * @param SFS
 * @param HFL
 * @param GTF
 * @param FCK
 * @returns v_min, ex .42
 */
export default async function VMZ(
  STA: EnumSTA,
  SFS: EnumSFS,
  HFL: number,
  GTF: number,
  FCK: number,
): Promise<number> {

  let dz = HFL - GTF;
  return getVminByD(dz, STA, SFS, FCK);
}
