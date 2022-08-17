/**
 * Param: A_sw/s,y,Total (cm²/ml) (Tranchant + Torsion)
 * Value ex: 0.03
 * Onglet: Torsion
 * Champ: E31
 * @param ASST
 * @param ASSY
 * @returns A_sw/s,y,Total (cm²/ml); ex: .03
 */
export default async function ASSYT(
  ASST: number,
  ASSY: number,
): Promise<number> {

  return ASST + ASSY;
}