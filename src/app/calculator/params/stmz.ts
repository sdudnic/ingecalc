/**
 * Param: s_t,max,z (m)
 * Value ex: 0.32
 * Onglet: Torsion
 * Champ: H22
 * @param BFL 
 * @param GCF 
 * @returns s_t,max,z (m); ex 0.32
 */
export default async function STMZ(
  HFL: number,
  GTF: number,
): Promise<number> {

  let dz = HFL - GTF;
  return Math.min(0.75 * dz, 0.6);
}