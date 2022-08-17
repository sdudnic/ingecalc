import { compareInfo } from "../common/functions";

/** 
 * S1EDCB vs SIGRMAX textual relation
 * Excel: ShearForce.I37
 */
export default async function S1EDCB_INFO(
  S1EDCB: number,
  SIGRMAX: number,
): Promise<string> {

  return compareInfo(S1EDCB, SIGRMAX);
}
