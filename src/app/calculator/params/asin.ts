import { getFcd, getSigmaCp } from "../common/functions";

/**
 * A_s,ink,v (cm²)
 * Excel: Console.E32
 * @param BCO
 * @param HED
 * @param KUNIT
 * @param ASLSF
 * @param HCC
 * @param GTC
 * @param ACC
 * @param GACF
 * @param CRDC622
 * @param FCK
 * @param K1622
 * @param FED
 * @param VMC
 * @param ACCO
 * @param FYK
 * @param GSF
 * @param K2PJ3
 * @returns A_s,ink,v (cm²); ex: 5.75
 */
export default async function ASIN(
  BCO: number,
  HED: number,
  KUNIT: number,
  ASLSF: number,
  HCC: number,
  GTC: number,
  ACC: number,
  GACF: number,
  CRDC622: number,
  FCK: number,
  K1622: number,
  FED: number,
  VMC: number,
  ACCO: number,
  FYK: number,
  GSF: number,
  K2PJ3: number,
): Promise<number> {

  let asin = 0; // par default
  let d = HCC - GTC;
  let fyd = FYK / GSF;
  let k = Math.min(2, 1 + (200 / (d * 1000)) ** (1 / 2));

  let fcd = getFcd(ACC, FCK, GACF);
  let sigmaCp = getSigmaCp(-HED, HCC, BCO, KUNIT, fcd) //Math.min(-HED * KUNIT * 0.000001 / ac, 0.2 * fcd);

  let rol = Math.min(ASLSF * 0.0001 / (BCO * d), 0.02);
  let vrdc = Math.max((CRDC622 * k * (rol * FCK) ** (1 / 3) + K1622 * sigmaCp) * BCO * d, (VMC + K1622 * sigmaCp) * BCO * d);

  if (ACCO > 0.5 * HCC && FED * KUNIT / 1000000 > vrdc) {
    asin = K2PJ3 * FED * KUNIT / 1000000 / fyd * 10000;
  } else {
    asin = 0
  }
  return asin;
}
