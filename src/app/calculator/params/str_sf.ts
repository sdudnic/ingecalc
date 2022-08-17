import { EnumSTA, PropertyCode } from "../common/enums"
import { checkStrut, getDegrees } from "../common/functions"
/**
 * Bielle/Theta angle for RCC standard only ! of ShearForce θ (°)
 * Excel: ShearForce/EffortTranchant.I16
 * Value ex: 3.97
 * @returns θ (°); ex: 39.8
 */
export default async function STR_SF(
  STR_SF: number,
  STA: EnumSTA,
  KUNIT: number,
  FCK: number,
  BFL: number,
  HFL: number,
  GACF: number,
  ACC: number,
  NEDSF: number,
  FCTM: number,
): Promise<number> {

  if (STA === EnumSTA.RCC_CW_2018) {
    const ac = BFL * HFL
    const fcd = ACC * FCK / GACF
    const sigmacp = Math.min(NEDSF * 0.000001 * KUNIT / ac, 0.2 * fcd)

    if (sigmacp < 0) {
      STR_SF = getDegrees(Math.atan(1 / Math.max(1, 1.2 + 0.9 * sigmacp / FCTM)))
    }
    else {
      STR_SF = getDegrees(Math.atan(1 / Math.max(1, 1.2 + 0.2 * sigmacp / FCTM)))
    }
    return STR_SF
  }
  else {
    checkStrut(STR_SF, PropertyCode.STR_SF, STA, KUNIT, NEDSF, BFL, HFL, FCTM);
    return STR_SF;
  }
}