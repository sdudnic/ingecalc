/**
 * Coef de calcul
 * Utilisé pour le Min/MAx
 * @param CNOM
 * @returns CNOM * 0.001
 */
export default async function MCNOM(CNOM: number): Promise<number> {
  return CNOM * 0.001;
}
