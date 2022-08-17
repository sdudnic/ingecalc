import { EnumSTA } from '../common/enums';

export default async function XQC_INFO(
  STA: EnumSTA,
  XQC: number,
  HFL: number,
): Promise<string> {

  switch (STA) {
    case EnumSTA.BS_EN_1992_3_NA:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.EN_1992_3_BS:
      {
        let xMin = Math.min(50 * 0.001, 0.2 * HFL)
        return (XQC < xMin) ?
          `< xmin = ${xMin} m --> {{{Class}}} 1` : ""
      }

    default:
      return ""

  }
}
