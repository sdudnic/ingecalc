import { EnumSTA } from '../common/enums';

/**
 *
 * @param STA
 * @param _CFL
 * @returns
 */
export default async function K3F(
  STA: EnumSTA,
  _CFL: number,
): Promise<number> {

  let _K3F: number;

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
    case EnumSTA.RCC_CW_2018:
      _K3F = 3.4
      break

    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
      if (_CFL < 25) {
        _K3F = 3.4
      } else {
        _K3F = 3.4 * (25 / _CFL) ** (2 / 3)
      }
      break
  }

  return _K3F;
}
