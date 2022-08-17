import { EnumCDF } from '../common/enums';
import { checkInvalidEluFlexionValues } from '../common/functions';

/**
 * A_st	(cm²)
 * Excel: Flexion.XXX
 * Value ex: 0.61
 * @param STA
 * @param KUNIT
 * @param MELU
 * @param BFL
 * @param HFL
 * @param GCF
 * @param GTF
 * @param GSF
 * @param GACF
 * @param FYK
 * @param FCK
 * @param AEF
 * @param WMAX
 * @param MELSQ
 * @param NELSQ
 * @param AST1
 * @param ASTB
 * @param ASCB
 * @param ASC1
 * @param MELSC
 * @param NELSC
 * @param MELSF
 * @param NELSF
 * @returns
 */
export default async function ASCM(
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
): Promise<number> {

  let ascm = getAscm(CDF, KUNIT, NELU, MELU, BFL, HFL, GCF, GTF, GSF, GACF, FYK, FCK, ACC, FCTM)
  ascm = ascm * 10000;
  return ascm;
}

function getAscm(
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
): number {

  let Ascmin: number = NaN;

  checkInvalidEluFlexionValues(NELU, MELU, BFL, HFL, GCF, GTF, GSF, GACF)

  let Mui = MELU + NELU * (HFL / 2 - GTF)
  let d = HFL - GTF
  let fyd = FYK * 1000000 / GSF
  let nu = 1

  if (FCK <= 50) {
    nu = 1
  } else if (CDF == EnumCDF.RSD) {
    nu = 1 - (FCK - 50) / 200
  }

  let fcd = nu * ACC * FCK * 1000000 / GACF

  if (NELU == 0 && (CDF == EnumCDF.RSD)) {
    // flexion simple rectangulaire simplifié
    Ascmin = 0
  }
  else if (NELU == 0 && (CDF == EnumCDF.PRD)) {
    // flexion simple parabole rectangle
    Ascmin = 0
  }
  else if (NELU < 0 && (MELU / NELU >= -(HFL / 2 - GCF) && MELU / NELU <= (HFL / 2 - GTF))) {
    // section entierement tendue

    let kas: number
    if (HFL < 0.3) {
      kas = 1
    } else if (HFL > 0.8) {
      kas = 0.65
    } else {
      kas = (0.8 - HFL) * 0.35 / 0.5 + 0.65
    }
    let kc = 1
    let act = BFL * HFL
    let Asmin = kc * kas * FCTM * act / FYK / 2
    Ascmin = -Asmin
  }
  else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) || ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) && CDF == EnumCDF.PRD) {
    // section partiellement comprimées parabole rectangle
    Ascmin = 0
  }
  else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) || ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) && CDF == EnumCDF.RSD) {
    // section partiellement comprimées rectangulaire simplifié
    Ascmin = 0
  }
  else if ((d - GCF) * NELU * KUNIT - Mui * KUNIT > (0.337 - 0.81 * GCF / HFL) * BFL * HFL ** 2 * fcd) {
    // section entierement comprimée
    Ascmin = 0
  }

  return Ascmin;
}
