import { EnumSTA } from '../common/enums';
/**
 * Excel: Flexion.J40
 * @param STA 
 * @returns 
 */
export default async function WKF_INFO2(
  STA: EnumSTA
): Promise<string> {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.RCC_CW_2018:
    case EnumSTA.EN_1992_3_BS:
      return "({{{Quasi-permanent combination}}})"

    case EnumSTA.NF_EN_1992_2_NA:
      return "({{{Frequent combination}}})"

    case EnumSTA.NF_EN_1992_3_NA:
      return "({{{Characteristic combination}}})"
  }
}
