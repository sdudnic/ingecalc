import { EnumCDF } from '../common/enums';
import { checkInvalidEluFlexionValues } from '../common/functions';

/**
 * A_stmin (cm²)
 * Excel: Flexion.I24
 * Value ex: 1.90
 * @param CDF
 * @param KUNIT
 * @param NELU
 * @param MELU
 * @param BFL
 * @param HFL
 * @param GCF
 * @param GTF
 * @param GSF
 * @param GACF
 * @param FYK
 * @param FCK
 * @param ACC
 * @param FCTM
 * @param NELSC
 * @returns
 */
export default async function ASTM(
  CDF: EnumCDF,
  KUNIT: number,
  NELU: number,
  MELU: number,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  GSF: number,
  GACF: number,
  FYK: number,
  FCK: number,
  ACC: number,
  FCTM: number,
  NELSC: number,
): Promise<number> {

  let asmin = getAsmin(CDF, KUNIT, NELU, MELU, BFL, HFL, GCF, GTF, GSF, GACF, FYK, FCK, ACC, FCTM, NELSC)
  let astm = asmin * 10000;
  return astm;
}

function getAsmin(
  CDF: EnumCDF,
  KUNIT: number,
  NELU: number,
  MELU: number,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  GSF: number,
  GACF: number,
  FYK: number,
  FCK: number,
  ACC: number,
  FCTM: number,
  NELSC: number,
): number {

  let Asmin: number = NaN;
  let Asmin2: number

  checkInvalidEluFlexionValues(NELU, MELU, BFL, HFL, GCF, GTF, GSF, GACF)

  let Mui = MELU + NELU * (HFL / 2 - GTF)
  let d = HFL - GTF
  let fyd = FYK * 1000000 / GSF
  let nu = 1
  let kas: number, kc: number, act: number;

  if (FCK <= 50) {
    nu = 1
  } else if (CDF == EnumCDF.RSD) {
    nu = 1 - (FCK - 50) / 200
  }

  let fcd = nu * ACC * FCK * 1000000 / GACF

  if (NELU == 0 && (CDF == EnumCDF.RSD)) {
    // flexion simple rectangulaire simplifié
    Asmin = Math.max(0.26 * FCTM / FYK * BFL * d, 0.0013 * BFL * d)

    if (HFL < 0.3) {
      kas = 1
    } else if (HFL > 0.8) {
      kas = 0.65
    } else {
      kas = (0.8 - HFL) * 0.35 / 0.5 + 0.65
    }

    kc = 0.4
    act = BFL * HFL / 2
    Asmin2 = kc * kas * FCTM * act / FYK
    Asmin = Math.max(Asmin, Asmin2)
  }
  else if (NELU == 0 && (CDF == EnumCDF.PRD)) {
    // flexion simple parabole rectangle
    Asmin = Math.max(0.26 * FCTM / FYK * BFL * d, 0.0013 * BFL * d)

    if (HFL < 0.3) {
      kas = 1
    } else if (HFL > 0.8) {
      kas = 0.65
    } else {
      kas = (0.8 - HFL) * 0.35 / 0.5 + 0.65
    }
    kc = 0.4
    act = BFL * HFL / 2

    Asmin2 = kc * kas * FCTM * act / FYK
    Asmin = Math.max(Asmin, Asmin2)
  }
  else if (NELU < 0 && (MELU / NELU >= -(HFL / 2 - GCF) && MELU / NELU <= (HFL / 2 - GTF))) {
    // section entierement tendue

    if (HFL < 0.3) {
      kas = 1
    } else if (HFL > 0.8) {
      kas = 0.65
    } else {
      kas = (0.8 - HFL) * 0.35 / 0.5 + 0.65
    }
    let kc = 1
    let act = BFL * HFL
    Asmin = kc * kas * FCTM * act / FYK / 2
  }
  else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) || ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) && CDF == EnumCDF.PRD) {
    // section partiellement comprimées parabole rectangle

    Asmin = Math.max(0.26 * FCTM / FYK * BFL * d, 0.0013 * BFL * d)

    if (HFL < 0.3) {
      kas = 1
    } else if (HFL > 0.8) {
      kas = 0.65
    } else {
      kas = (0.8 - HFL) * 0.35 / 0.5 + 0.65
    }

    let hetoile = Math.min(HFL, 1)
    let k1 = (NELSC > 0) ? 1.5 : 2 / 3 * (hetoile / HFL);

    kc = Math.min(1, 0.4 * (1 - NELSC * KUNIT / (k1 * (HFL / hetoile) * FCTM * 1000000 * BFL * HFL)))


    act = Math.max((HFL / 2 - NELU / MELU * HFL * HFL / 6) * BFL, 0)

    Asmin2 = kc * kas * FCTM * act / FYK
    Asmin = Math.max(Asmin, Asmin2)

  }
  else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) || ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) && CDF == EnumCDF.RSD) {
    // section partiellement comprimées rectangulaire simplifié
    Asmin = Math.max(0.26 * FCTM / FYK * BFL * d, 0.0013 * BFL * d)

    if (HFL < 0.3) {
      kas = 1
    } else if (HFL > 0.8) {
      kas = 0.65
    } else {
      kas = (0.8 - HFL) * 0.35 / 0.5 + 0.65
    }

    let hetoile = Math.min(HFL, 1)
    let k1 = (NELSC > 0) ? 1.5 : 2 / 3 * (hetoile / HFL);

    kc = Math.min(1, 0.4 * (1 - NELSC * KUNIT / (k1 * (HFL / hetoile) * FCTM * 1000000 * BFL * HFL)))

    act = Math.max((HFL / 2 - NELU / MELU * HFL * HFL / 6) * BFL, 0)

    Asmin2 = kc * kas * FCTM * act / FYK
    Asmin = Math.max(Asmin, Asmin2)

  }
  else if ((d - GCF) * NELU * KUNIT - Mui * KUNIT > (0.337 - 0.81 * GCF / HFL) * BFL * HFL ** 2 * fcd) {
    // section entierement comprimée
    Asmin = Math.max(0.26 * FCTM / FYK * BFL * d, 0.0013 * BFL * d)
  }

  return Asmin;
}
