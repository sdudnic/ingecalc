import { EnumSTA } from '../common/enums';
import { getRadians } from '../common/functions';

/**
 * Param: A_sw/s min,z (cm²/ml)
 * Value ex: 2.63
 * Onglet: Torsion
 * Champ: H20
 * @param STA
 * @param ATO
 * @param FYK
 * @param FCK
 * @param HFL
 * @returns A_sw/s min,z (cm²/ml); ex: 2.63
 */
export default async function ASSMZ(
  STA: EnumSTA,
  ATO: number,
  FYK: number,
  FCK: number,
  BFL: number,
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
      return BFL * Math.sin(alpha) * 0.08 * Math.sqrt(FCK) / FYK * 10000

    case EnumSTA.RCC_CW_2018:
      return NaN; // En attente de Samuel
  }
}
