import { compareInfo } from "../common/functions";

/**
 * ShearForce.J45
 * VEDI vs VRDI textual relation
 */
export default async function VEDI_INFO(
  VEDI: number,
  VRDI: number,
): Promise<string> {

  return compareInfo(VEDI, VRDI);
}
