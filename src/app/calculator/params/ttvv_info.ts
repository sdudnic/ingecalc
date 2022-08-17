import { TextColor } from "../common/enums";

/**
 *
 * Excel: Torsion.F36
 * @param TTVV
 * @returns
 */
export default async function TTVV_INFO(
  TTVV: number,

): Promise<string> {

  return (TTVV < 1) ? "< 1 --> {{{OK}}}" + TextColor.GREEN : "> 1 --> {{{NOK!}}}" + TextColor.RED
}
