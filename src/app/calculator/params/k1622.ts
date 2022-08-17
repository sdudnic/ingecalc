import { EnumSTA } from '../common/enums';

/**
 * Param: k_1
 * Value ex: 0.15
 * Onglet: Torsion
 * Champ: H12
 * @param STA 
 * @returns k_1; ex: .15
 */
export default async function K1622(
  STA: EnumSTA
): Promise<number> {


  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.RCC_CW_2018:
      return 0.15;

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      //throw "Does not apply in the UK - see PD 6687 for an alternative Annex J";
      return 0.15; // Torsion case
  }
}