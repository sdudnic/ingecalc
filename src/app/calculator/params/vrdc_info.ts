/**
 * ShearForce.J45
 * VEDI vs VRDI textual relation
 */
export default async function VRDC_INFO(
  VEDR: number,
  VRDC: number,
): Promise<string> {

  if (VEDR < VRDC) {
    return "{{{Transverse reinforcement not required}}}"
  }
  else {
    return "{{{Transverse reinforcement required}}}"
  }
}
