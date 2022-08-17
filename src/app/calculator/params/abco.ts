/**
 *
 * @param FED
 * @param HED
 * @param UNIT
 * @param BCO
 * @param SRDM
 * @param ACCO
 * @param Z0CO
 * @param GTC
 * @returns
 */
export default async function ABCO(
  FED: number,
  HED: number,
  KUNIT: number,
  BCO: number,
  SRDM: number,
  ACCO: number,
  Z0CO: number,
  GTC: number): Promise<number> {

  let ftd = FED * KUNIT / 1000000 * ACCO / Z0CO + HED * KUNIT / 1000000 * (GTC + Z0CO) / Z0CO;
  let result = (ftd - HED * KUNIT / 1000000) / (BCO * SRDM);
  return result;
}
