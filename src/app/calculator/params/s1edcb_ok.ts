/**
 * ShearForce.L37
 */
export default async function S1EDCB_OK(
  S1EDCB: number,
  SIGRMAX: number): Promise<boolean> {

  return S1EDCB < SIGRMAX;
}
