import { EnumSTA, TextColor } from '../common/enums';
import { toFixedTrimmed, toParamString } from '../common/functions';
import { ParamString } from '../common/param-string';

export default async function CCS_INFO(
  STA: EnumSTA,
  CCS: number,
  FYK: number,
): Promise<ParamString> {

  let sigslim = (STA === EnumSTA.NF_EN_1992_3_NA) ? 200 : 0.8 * FYK
  let prefix = (STA === EnumSTA.NF_EN_1992_3_NA) ? "" : "0.8f<sub>yk</sub> = "

  let sign: string, status: string, color: string;

  if (CCS < sigslim) {
    sign = "<"
    status = "OK"
    color = TextColor.GREEN
  }
  else {
    sign = ">="
    status = "NOK!"
    color = TextColor.RED
  }

  let template = `${sign} ${prefix}{{sigslim}} MPa --> {{{${status}}}}${color}`

  return toParamString(template, { sigslim: toFixedTrimmed(sigslim, 2) })
}
