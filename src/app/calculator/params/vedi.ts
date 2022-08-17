/**
 * Contrainte de cisaillement a l'interface
 * v_Edi (MPa)
 * Excel: EffortTranchant.I44
 * Value ex: 3.97
 * @param KUNIT
 * @param BFLI
 * @param BESF
 * @param HFL
 * @param GTF
 * @param VEDR
 * @returns v_Edi (MPa); ex: 3.97
 */
export default async function VEDI(
  KUNIT: number,
  BFLI: number,
  BESF: number,
  HFL: number,
  GTF: number,
  VEDR: number,
): Promise<number> {

  let d: number = HFL - GTF;
  let z = 0.9 * d;
  let vedi: number = BESF * VEDR * KUNIT / 1000000 / (z * BFLI);

  return vedi;
}
