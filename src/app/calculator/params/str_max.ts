import { EnumSTA } from "../common/enums";
import { getDegrees } from "../common/functions";

/**
 * Get the max of Teta (angle of the strut inclination)
 * @returns max Teta value
 */
export default async function STR_MAX(
  ned: number,
  STA: EnumSTA,
  BFL: number,
  HFL: number,
  KUNIT: number,
  FCTM: number,
)
  : Promise<number> {

  let max = -Infinity;

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return 45

    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      {
        const ac: number = BFL * HFL;
        if ((ned * 0.000001 * KUNIT / ac) < 0) {
          max = getDegrees(Math.atan(1 / (1 * Math.sqrt(1 + ned * 0.000001 * KUNIT / ac / FCTM))))
        } else {
          max = getDegrees(Math.atan(1 / 1))
        }
        return max;
      }

    case EnumSTA.RCC_CW_2018:
      //En attente de Samuel
      return Infinity;
  }
}