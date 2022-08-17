import { EnumSTA } from '../common/enums';
/**
 * Alpha_cc (ACC)
 * Excel: 
 * Corbels/Console.B16
 * Bending/Flexion.B12
 * ShareForce/EffortTranchant.K24
 * Torsion.B16
 * @param STA 
 * @returns Alpha_cc (coef)
 */
export default async function ACC(
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
      return 1;

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      return 0.85;
  }
}