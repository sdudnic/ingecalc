import { EnumSTA, TextColor } from '../common/enums';
import { toParamString } from '../common/functions';
import { ParamString } from '../common/param-string';

/**
 * Flexion/Bending tab
 * Excel: Flexion.G54
 * @param STA 
 * @param BFL 
 * @param HFL 
 * @param ASCF
 * @param FCK 
 * @returns 
 */
export default async function SIGCC_INFO(
  STA: EnumSTA,
  BFL: number,
  HFL: number,
  ASCF: number,
  FCK: number,
): Promise<ParamString> {

  let sigcc_info = ""
  let params = {}

  if (STA === EnumSTA.NF_EN_1992_2_NA) {
    const ASCF_MULTIPLIER = 10000
    let ascf = ASCF / ASCF_MULTIPLIER

    const fckCoef = 0.6

    if (Math.abs(ascf) > 0.04 * BFL * HFL) {
      sigcc_info = "Asc > 0.04Ac --> {{{NOK!}}}" + TextColor.RED
    }
    else {
      params = { fckxCoef: FCK * fckCoef }
      sigcc_info = "< 0.6f<sub>ck</sub> = {{fckxCoef}} MPa --> {{{OK}}}"
    }
  }

  return toParamString(sigcc_info, params)
}