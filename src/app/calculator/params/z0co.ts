import { TextColor } from "../common/enums";
import { CalculatorError } from "../common/exceptions/calculator-error";

/**
 * z_0 (m)
 * Value ex: 0.60
 * Excel: Console.E29 *
 * @param FED
 * @param HED
 * @param HCC
 * @param KUNIT
 * @param ACCO
 * @param GTC
 * @param BCO
 * @param SRDM
 * @returns z_0 (m)
 */
export default async function Z0CO(
  FED: number,
  HED: number,
  HCC: number,
  KUNIT: number,
  ACCO: number,
  GTC: number,
  BCO: number,
  SRDM: number
): Promise<number> {

  let d = HCC - GTC
  let a = ACCO + FED * KUNIT / 1000000 / (2 * BCO * SRDM)
  let e = -ACCO * d
  let c = (FED * KUNIT / 1000000 * ACCO * ACCO + HED * KUNIT / 1000000 * GTC * ACCO) / (2 * BCO * SRDM)
  let z0co = (-e + Math.sqrt(e ** 2 - 4 * a * c)) / (2 * a);
  if (ACCO > z0co)
    throw new CalculatorError('a<sub>c</sub> > z<sub>0</sub> --> {{{NOK!}}}' + TextColor.RED, "ACCO", NaN)

  return z0co;
}
