/**
 * Calcul des armatures transversales du à la torsion
 * Param: t_ef (m)
 * Value ex: 0.09
 * Onglet: Torsion
 * Champ: E27
 * Notes: < 2gt ou < 2gc --> KO !
 * @param STA 
 * @param BFL 
 * @param HFL 
 * @returns t_ef (m); ex: 0.09 
 */
export default async function TEF(
  BFL: number,
  HFL: number,
): Promise<number> {

  // Calcul des armatures transversales du à la torsion
  let u = 2 * (BFL + HFL)
  let a = BFL * HFL
  return a / u;
}