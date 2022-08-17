/**
 * A_inf (cm²)	AISF
 * Value ex: 0.89
 * Excel: EffortTranchant.C37
 * @param KUNIT
 * @param HFL
 * @param GTF
 * @param GSF
 * @param VED
 * @param NEDSF
 * @param MED
 * @param FYK
 * @param ALSF
 * @returns A_inf (cm²); ex: 0.98
 */
export default async function AISF(
  KUNIT: number,
  HFL: number,
  GTF: number,
  GSF: number,
  VED: number,
  NEDSF: number,
  MED: number,
  FYK: number,
  ALSF: number): Promise<number> {

  let ainf: number;
  let fe: number;
  let d = HFL - GTF;
  let z = 0.9 * d;

  fe = VED * KUNIT * ALSF / z - NEDSF * KUNIT / 2 - MED * KUNIT / z;
  ainf = fe * GSF / (FYK * 1000000.0) * 10000.0;
  if (ainf < 0) ainf = 0;
  return ainf;
}
