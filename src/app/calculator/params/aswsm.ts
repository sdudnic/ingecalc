import { getRadians, } from '../common/functions';
import { EnumSFS, EnumSTA } from '../common/enums';

export default async function ASWSM(
  STA: EnumSTA,
  SFS: EnumSFS,
  BFL: number,
  SRSF: number,
  FYK: number,
  FCK: number,
): Promise<number> {

  let alpha: number = getRadians(SRSF);
  let ro: number = 0.08 * Math.sqrt(FCK) / FYK;
  let asmin: number = ro * BFL * 10 ** 4 * Math.sin(alpha);

  if (SFS == EnumSFS.TRSLAB) { //"Dalle bénéficiant d'un effet de redistribution transversale"
    asmin = 0;
  }

  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      if (SFS == EnumSFS.WALLA) { // Voile
        return 0;
        /* afficher "Voir EC2 § 9.6.4" à la place du champ*/
      } else {
        return asmin;
      }
    case EnumSTA.RCC_CW_2018:
      if (SFS == EnumSFS.WALLA) { // Voile
        return 0;
        /* afficher "4 épingles par m2" à la place du champ*/
      } else {
        return asmin;
      }
  }
}





