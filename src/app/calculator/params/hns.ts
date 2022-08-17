/**
 * HNS h0
 * Excel: Fleche.D46
 * @param BFL
 * @param HFL
 * @param UDR
 * @returns 2*D22*D23/D45*1000
 */
export default async function HNS(
  BFL: number,
  HFL: number,
  UDR: number,
): Promise<number> {

  return 2 * BFL * HFL / UDR * 1000;
}
