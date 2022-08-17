import { EnumSFS, EnumSTA, PropertyCode } from '../common/enums';
import { checkStrut, getRadians, getTeta } from '../common/functions';

/**
 * A_l (m)
 * Excel: ShearForce/EffortTranchant.C38
 * @param STA
 * @param SFS
 * @param KUNIT
 * @param BFL
 * @param HFL
 * @param GTF
 * @param STR_SF
 * @param SRSF
 * @param NEDSF
 * @returns A_l (m); ex 1.67
 */
export default async function ALSF(
  STA: EnumSTA,
  SFS: EnumSFS,
  KUNIT: number,
  BFL: number,
  HFL: number,
  GTF: number,
  STR_SF: number,
  SRSF: number,
  NEDSF: number,
  FCTM: number,
  ACC: number,
  FCK: number,
  GACF: number,
): Promise<number> {

  checkStrut(STR_SF, PropertyCode.STR_SF, STA, KUNIT, NEDSF, BFL, HFL, FCTM);

  let teta = await getTeta(STA, KUNIT, STR_SF, NEDSF, BFL, HFL, FCTM, ACC, FCK, GACF);
  let alpha = getRadians(SRSF);
  let d = HFL - GTF;
  let z = 0.9 * d;

  let al: number;

  if (SFS == EnumSFS.OTSLAB || SFS == EnumSFS.TRSLAB) { //"Dalle autre" || "Dalle bénéficiant d'un effet de redistribution transversale"
    al = d;
  } else {
    al = z * (1 / Math.tan(teta) - 1 / Math.tan(alpha))
  }

  return al;
}
