/**
 * ShearForce.L38
 */
export default async function S2EDCA_OK(
  S2EDCA: number,
  SIGRMAX: number): Promise<boolean> {

  return S2EDCA < SIGRMAX;
}
