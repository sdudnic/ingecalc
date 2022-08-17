import { EnumSTA, TextColor } from '../common/enums';
import { toParamString } from '../common/functions';
import { ParamString } from '../common/param-string';


export default async function QCC_INFO(
  STA: EnumSTA,
  QCC: number,
  FCK: number,
): Promise<ParamString> {

  let coef = (STA === EnumSTA.RCC_CW_2018) ? 0.6 : 0.45
  let limit = coef * FCK
  let template: string

  if (QCC < limit) {
    template = `< {{coef}}f<sub>ck</sub> = {{limit}} MPa --> {{{OK}}}${TextColor.GREEN}`
  }
  else {
    template = (STA === EnumSTA.RCC_CW_2018) ?
      `>= {{coef}}f<sub>ck</sub>  = {{limit}} MPa --> {{{NOK!}}}${TextColor.RED}` :
      `>= {{coef}}f<sub>ck</sub>  --> {{{Non-linear creep}}}`
  }

  return toParamString(template, { limit: limit, coef: coef })
}