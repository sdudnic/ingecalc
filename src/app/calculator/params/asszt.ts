/**
 * Param: A_sw/s,z,Total (cm²/ml) (Tranchant + Torsion)
 * Value ex: 2.07
 * Onglet: Torsion
 * Champ: E32
 * @param ASST
 * @param ASSZ
 * @returns A_sw/s,z,Total (cm²/ml); ex: 2.07
 */
 export default async function ASSZT(
  ASST: number,
  ASSZ: number,
): Promise<number> {

  return ASST + ASSZ;
}