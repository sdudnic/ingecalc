/**
 * @param PDD Fleche!G52
 * @param DLD17 Fleche!G54
 * @returns Promise of IF(G52>G54;"NON";"OK")
 */
export default async function FNOK(
  PDD: number, DLD17: number
): Promise<boolean> {
  return PDD <= DLD17;
}
