/**
 * a_e (m)
 * Excel: Console.
 * @param FED 
 * @param KUNIT 
 * @param BCO 
 * @param SRDM 
 * @returns a_e (m); ex: 0.07
 */
export default async function AECO(
  FED: number,
  KUNIT: number,
  BCO: number,
  SRDM: number): Promise<number> {

  return FED * KUNIT / 1000000 / (BCO * SRDM);
}