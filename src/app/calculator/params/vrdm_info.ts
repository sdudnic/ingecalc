import { TextColor } from "../common/enums"

/**
 * Excel: ShearForce.C33
 */
export default async function VRDM_INFO(
  VRDM: number,
  VED: number,
): Promise<string> {

  if (VRDM < VED)
    return "{{{NOK!}}}: {{{Stress in the strut not allowable: change the section}}}" + TextColor.RED
  else
    return "{{{OK}}}" + TextColor.GREEN
}
