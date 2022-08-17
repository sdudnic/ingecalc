/**
 * Coefficient d'équivalence acier/béton
 * α_E (-)
 * Excel: CaraBeton.F51
 * @param ECEFF 
 * @returns α_E; ex: 12.95
 */
export default async function AEC(ECEFF: number): Promise<number> {
  return 200000 / ECEFF;
}