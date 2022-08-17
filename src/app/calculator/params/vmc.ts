import { EnumSFS, EnumSTA } from '../common/enums';
import { getVminByD } from '../common/functions';

/**
 * Param: v_min
 * Value ex: 0.36
 * Excel: Console.H15
 * @param STA
 * @param SFS
 * @param HCC
 * @param GTC
 * @param FCK
 * @returns v_min, ex .36
 */
export default async function VMC(
  STA: EnumSTA,
  SFS: EnumSFS,
  HCC: number,
  GTC: number,
  FCK: number,
): Promise<number> {

  let d = HCC - GTC;
  return getVminByD(d, STA, SFS, FCK);
}
