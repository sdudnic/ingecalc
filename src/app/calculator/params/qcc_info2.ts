import { EnumSTA } from '../common/enums';
/**
 * Excel: Flexion.J44
 * @param STA 
 * @returns 
 */
export default async function QCC_INFO2(
  STA: EnumSTA,
): Promise<string> {

  switch (STA) {
    case EnumSTA.NF_EN_1992_3_NA:
      return "({{{Characteristic combination}}})"

    default:
      return "({{{Quasi-permanent combination}}})"
  }
}
