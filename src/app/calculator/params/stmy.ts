/**
 * Param: s_t,max,y (m)
 * Value ex: 0.17
 * Onglet: Torsion
 * Champ: H18
 * @param BFL 
 * @param GCF 
 * @returns s_t,max,y (m); ex 0.17
 */
export default async function STMY(
  BFL: number,
  GCF: number,
): Promise<number> {

  let dy = BFL - GCF;
  return Math.min(0.75 * dy, 0.6);
}