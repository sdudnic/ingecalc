import { TextColor } from "../common/enums"

/**
 * Excel: ShearForce.H46
 * @param VEDI 
 * @param VRDI 
 * @returns 
 */
export default async function CDY_INFO(
  VEDI: number,
  VRDI: number,
): Promise<string> {

  if (VEDI < VRDI) {
    // "Shear stress allowable"
    // "Contrainte de cisaillement
    return "{{{Shear stress allowable}}}" + TextColor.GREEN
  }
  else {
    return "{{{Shear stress not allowable}}}" + TextColor.RED
  }
}