import { getFcd } from "../common/functions";

export default async function SRDM(
  ACC: number,
  FCK: number,
  GACF: number,
  K1S654: number,
  N622: number
): Promise<number> {

  let fcd = getFcd(ACC, FCK, GACF);
  return K1S654 * N622 * fcd;
}
