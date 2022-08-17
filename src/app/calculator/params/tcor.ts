import { ErrorLevel } from '../common/enums';
import { throwCalculatorError, getDegrees } from '../common/functions';

/**
 *
 * @param HCC
 * @param GTC
 * @param ABCO
 * @param ACCO
 * @param AECO
 * @returns
 */
export default async function TCOR(
  HCC: number,
  GTC: number,
  ABCO: number,
  ACCO: number,
  AECO: number,
): Promise<number> {

  let dz = HCC - GTC;
  let teta = Math.atan((dz - ABCO / 2) / (ACCO + AECO / 2))
  let tcor = getDegrees(teta);
  return tcor;
}
