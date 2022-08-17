import { EnumSTA } from '../common/enums';
/**
 * Bending/Flexion.J45
 */
export default async function XQC_INFO2(
  STA: EnumSTA
): Promise<string> {

  switch (STA) {
    case EnumSTA.NF_EN_1992_2_NA:
      return "({{{Frequent combination}}})"

    case EnumSTA.NF_EN_1992_3_NA:
      return "({{{Characteristic combination}}})"

    default:
      return "({{{Quasi-permanent combination}}})"
  }
}
