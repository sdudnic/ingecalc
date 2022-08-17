import { EnumSTA, PropertyCode } from '../common/enums';
import { throwCalculatorError } from '../common/functions';

export default async function K1PJ3(
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
      return 0.25;

    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      throwCalculatorError("{{{Does not apply in the UK - see PD 6687 for an alternative Annex J}}}", PropertyCode.K1PJ3, undefined, NaN);
      return NaN;
  }
}