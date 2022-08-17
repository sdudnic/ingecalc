import { EnumSTA } from '../common/enums';
import { getRadians } from '../common/functions';

/**
 * Param: Asw/s min,y (cm²/ml)
 * Value ex: 4.38
 * Onglet: Torsion
 * Champ: H16
 * @param STA
 * @param ATO
 * @param FYK
 * @param FCK
 * @param HFL
 * @returns Asw/s min,y (cm²/ml); ex: 4.38
 */
export default async function ASSMY(
  STA: EnumSTA,
  ATO: number,
  FYK: number,
  FCK: number,
  HFL: number,
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
      let alpha = getRadians(ATO);
      return HFL * Math.sin(alpha) * 0.08 * Math.sqrt(FCK) / FYK * 10000;

    case EnumSTA.RCC_CW_2018:
      return NaN; // En attente de Samuel
  }
}
