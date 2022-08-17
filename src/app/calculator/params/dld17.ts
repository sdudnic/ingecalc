/**
 * DLD17 Fleche!G54
 * @param LND Fleche!D20
 * @returns promise of IF(D20>5;0,5+D20/10;D20/5)
 */
export default async function DLD17(
  LND: number
): Promise<number> {
  return LND > 5 ? 0.5 + LND / 10 : LND / 5;
}
