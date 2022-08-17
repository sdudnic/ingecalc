/**
 * Sigma R Max
 * Excel: EffortTranchant.J37 & J38
 * @param ACC
 * @param GACF
 * @param FCK
 * @returns
 */
export default async function SIGRMAX(
  ACC: number,
  GACF: number,
  FCK: number,
): Promise<number> {

  const k2 = 0.85;
  const fcd = ACC * FCK / GACF;

  const nuprime = (1 - FCK / 250);
  const sigRmax = k2 * nuprime * fcd;

  return sigRmax;
}