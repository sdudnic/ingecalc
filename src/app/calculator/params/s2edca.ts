/**
 * σEd,c Support (s2) - (MPa)
 * Value ex:	0.23
 * Excel: Effort.Tranchant.
 * @param KUNIT
 * @param BFL
 * @param VED
 * @param CNOM
 * @param ASF
 * @returns σEd,c Support (s2) - (MPa)
 */
export default async function S2EDCA(
  KUNIT: number,
  BFL: number,
  VED: number,
  CNOM: number,
  ASF: number): Promise<number> {

  let cnom = CNOM / 1000;
  let sigappui = VED * KUNIT / 1000000 / (ASF - cnom) / BFL;

  return sigappui;
}
