export default async function ASMAIN(
  GSF: number,
  FED: number,
  KUNIT: number,
  ACCO: number,
  Z0CO: number,
  HED: number,
  GTC: number,
  FYK: number): Promise<number> {

  let ftd = FED * KUNIT / 1000000 * ACCO / Z0CO + HED * KUNIT / 1000000 * (GTC + Z0CO) / Z0CO;
  let asmain = ftd * GSF / FYK * 10000;

  return asmain;
}