import { EnumSFS, EnumSTA } from '../common/enums';
import { getRadians } from '../common/functions';

export default async function SLM(
    STA: EnumSTA,
    SFS: EnumSFS,
    SRSF: number,
    HFL: number,
    GTF: number): Promise<number> {

    let d: number = HFL - GTF;
    let alpha: number = getRadians(SRSF);

    if (SFS == EnumSFS.WALLA) { // Voile
        return 0;
    }

    switch (STA) {
        case EnumSTA.EN1992_1_1_BS:
        case EnumSTA.EN1992_2_BS:
        case EnumSTA.EN_1992_3_BS:
            return 0.75 * d * (1 + 1 / Math.tan(alpha))
        case EnumSTA.NF_EN_1992_1_1_NA:
        case EnumSTA.NF_EN_1992_2_NA:
        case EnumSTA.NF_EN_1992_3_NA:
            if (HFL <= 0.25 && SFS == EnumSFS.BEAM) { // Poutre
                return 0.9 * d;
            } else {
                return 0.75 * d * (1 + 1 / Math.tan(alpha))
            }
        case EnumSTA.BS_EN_1992_1_1_NA:
        case EnumSTA.BS_EN_1992_3_NA:
            return 0.75 * d * (1 + 1 / Math.tan(alpha))
        case EnumSTA.RCC_CW_2018:
            return 0.75 * d * (1 + 1 / Math.tan(alpha))
    }
}
