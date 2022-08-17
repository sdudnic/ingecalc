import { EnumECF, TextColor } from "../common/enums"
import { toFixedTrimmed, toParamString } from "../common/functions"
import { ParamString } from "../common/param-string"

export default async function CCC_INFO(
  CCC: number,
  FCK: number,
  ECF: EnumECF,
): Promise<ParamString> {

  let ksigc = (ECF == EnumECF.XC) ? 1 : 0.6
  let ksigcString = ksigc == 1 ? "" : toFixedTrimmed(ksigc, 1)

  let ksigc_x_FCK = ksigc * FCK


  let sign: string, status: string, color: string;
  if (CCC < ksigc_x_FCK) {
    status = "OK"
    sign = "<"
    color = TextColor.GREEN
  }
  else {
    status = "NOK!"
    sign = ">="
    color = TextColor.RED
  }
  let template = `${sign} {{ksigc}}f<sub>ck</sub> = {{ksigc_x_FCK}} MPa --> {{{${status}}}}${color}`
  return toParamString(template, {
    ksigc: ksigcString,
    ksigc_x_FCK: ksigc_x_FCK,
  })
}
