import { compareInfo } from "../common/functions";

/**
 * S2EDCA vs SIGRMAX textual relation
 * Excel: ShearForce.I38 
 */
export default async function S2EDCA_INFO(
  S2EDCA: number,
  SIGRMAX: number,
): Promise<string> {

  return compareInfo(S2EDCA, SIGRMAX);
}
