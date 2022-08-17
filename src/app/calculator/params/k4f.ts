import { EnumSTA } from '../common/enums';

export default async function K4F(
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
    case EnumSTA.RCC_CW_2018:
      return 0.425;
  }
}
