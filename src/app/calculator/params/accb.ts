import { EnumLFL, EnumSTA } from '../common/enums';
/**
 * alpha_cc for Bending/Flexion
 * Excel: Bending/Flexion.B12
 * @param STA 
 * @param LFL Type de chargement
 * @returns alpha_cc for Bending/Flexion (coeff.)
 */
export default async function ACCB(
  STA: EnumSTA,
  LFL: EnumLFL,
): Promise<number> {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      return 1;

    case EnumSTA.RCC_CW_2018:
      return (LFL == EnumLFL.LTL) ? 0.85 : 1;

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return 0.85;
  }
}