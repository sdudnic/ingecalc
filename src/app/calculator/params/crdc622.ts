import { EnumSTA } from '../common/enums';
/**
 * Param: C_Rd,c
 * Value ex: 0.12
 * Onglet: Torsion
 * Champ: H14
 * @param STA 
 * @param GACF 
 * @returns C_Rd,c, ex .12
 */
export default async function CRDC622(
  STA: EnumSTA,
  GACF: number
): Promise<number> {

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.RCC_CW_2018:
      return 0.18 / GACF;

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      //throw "Does not apply in the UK - see PD 6687 for an alternative Annex J"
      return 0.18 / GACF; // Torsion tab
  }
}