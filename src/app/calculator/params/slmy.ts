import { EnumSTA } from '../common/enums';
import { getRadians } from '../common/functions';

/**
 * Param: s_l,max,y (m)
 * Value ex: 0.17
 * Onglet: Torsion
 * Champ: H17
 * @param STA
 * @param BFL
 * @param HFL
 * @param ATO
 * @param GCF
 * @returns s_l,max,y (m); ex. 0.17
 */
export default async function SLMY(
  STA: EnumSTA,
  BFL: number,
  HFL: number,
  ATO: number,
  GCF: number,
): Promise<number> {

  let alpha = getRadians(ATO);
  let dy = BFL - GCF;
  let coef = .75;

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      coef = 0.75;
      break;

    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      coef = (HFL <= 0.25) ? 0.9 : 0.75;
      break;

    case EnumSTA.RCC_CW_2018:
      return NaN; //En attente de Samuel
  }

  return Math.min(2 * (BFL + HFL) / 8, coef * dy * (1 + Math.cos(alpha) / Math.sin(alpha)), BFL, HFL);
}
