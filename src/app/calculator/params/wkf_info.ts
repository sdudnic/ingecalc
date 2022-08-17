import { TextColor } from "../common/enums";
import { toFixedTrimmed, toParamString } from "../common/functions"
import { ParamString } from "../common/param-string";

/**
 * Excel: Flexion.E40
 * @param WKF 
 * @param WMAX 
 * @returns 
 */
export default async function WKF_INFO(
  WKF: number,
  WMAX: number,
): Promise<ParamString> {

  let params = { wmax: toFixedTrimmed(WMAX, 1) };
  let status: string, sign: string, color = '';

  if (WKF < WMAX) {
    sign = "<"
    status = "OK"
    color = TextColor.GREEN
  }
  else {
    status = "NOK!"
    sign = ">="
    color = TextColor.RED
  }

  let template = `${sign} w<sub>max</sub> = {{wmax}} mm --> {{{${status}}}}${color}`

  return toParamString(template, params);
}
