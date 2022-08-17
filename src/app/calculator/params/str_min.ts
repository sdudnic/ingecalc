import { EnumSTA } from "../common/enums";
import { getDegrees } from "../common/functions";

/**
 * Get the min value of teta based on NED value and STA.
 * The same formula is used in ShareForce and Torsion for respective NED values.
 * @returns Min for teta
 */
export default async function STR_MIN(
  ned: number,
  STA: EnumSTA,
  BFL: number,
  HFL: number,
  KUNIT: number,
  FCTM: number,
)
  : Promise<number> {

  let min = -Infinity;

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return 21.8

    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA: {
      const ac: number = BFL * HFL;
      if ((ned * 0.000001 * KUNIT / ac) < 0) {
        min = getDegrees(Math.atan(1 / (2.5 * Math.sqrt(1 + ned * 0.000001 * KUNIT / ac / FCTM))))

      } else {
        min = getDegrees(Math.atan(1 / 2.5))
      }
      return min
    }

    case EnumSTA.RCC_CW_2018:
      //En attente de Samuel
      return -Infinity;
  }
}