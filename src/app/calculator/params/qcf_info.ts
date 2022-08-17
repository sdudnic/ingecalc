import { EnumCBAR, EnumSTA, TextColor } from '../common/enums';
import { toFixedTrimmed } from '../common/functions';
/**
 * Excel: Flexion.E42
 * @param STA 
 * @param CBAR 
 * @param QCF 
 * @param FYK 
 * @param FCTM 
 * @returns 
 */
export default async function QCF_INFO(
  STA: EnumSTA,
  CBAR: EnumCBAR,
  QCF: number,
  FYK: number,
  FCTM: number,
): Promise<string> {

  if (STA !== EnumSTA.RCC_CW_2018)
    return "";

  let nub = CBAR == EnumCBAR.HY ? 1.6 : 1
  let sigslim = Math.min(2 / 3 * FYK, Math.max(0.5 * FYK, 110 * (nub * FCTM) ** (1 / 2)))

  if (QCF < sigslim)
    return `< ${toFixedTrimmed(sigslim, 2)} MPa --> {{{OK}}}${TextColor.GREEN}`
  else
    return `>= ${toFixedTrimmed(sigslim, 2)} MPa --> {{{NOK!}}}${TextColor.RED}`
}
