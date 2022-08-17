/**
 * FTOK Fleche!I60
 * @param TDD Fleche!G60
 * @param DLD92 Fleche!G62
 * @returns Promise of IF(G60>G62;"NON";"OK")
 */
export default async function FTOK(
  TDD: number, DLD92: number
): Promise<boolean> {
  return TDD <= DLD92;
}
