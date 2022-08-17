import { EnumSTA } from '../common/enums';

/**
 * Param: alpha_ct
 * Excel: Torsion.H10
 * @param STA 
 * @returns alpha._ct, ex: 1.00
 */
export default async function ACT(
  STA: EnumSTA
): Promise<number> {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return 1;

    case EnumSTA.RCC_CW_2018:
      return NaN; //En attente de Samuel
  }
}