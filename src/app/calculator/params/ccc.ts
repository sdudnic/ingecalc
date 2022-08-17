import { EnumUNIT } from '../common/enums';
import { getSigmaC, getSmallKUnit } from '../common/functions';

/**
 * sigma_c, MPa
 * Flexion/Bending tab
 * Excel: B43
 * Value ex: 5.47
 * @param UNIT
 * @param NELSC
 * @param MELSC
 * @param BFL
 * @param AEF
 * @param GCF
 * @param GTF
 * @param HFL
 * @param ASTB
 * @param ASCB
 * @returns
 */
export default async function CCC(
  UNIT: EnumUNIT,
  NELSC: number,
  MELSC: number,
  BFL: number,
  AEF: number,
  GCF: number,
  GTF: number,
  HFL: number,
  ASTB: number,
  ASCB: number,
): Promise<number> {

  let sigc: number = NaN;

  let d = HFL - GTF
  let kunit = getSmallKUnit(UNIT)

  let Nscara = NELSC / kunit
  let Mscara = MELSC / kunit

  // Limitation rapport M/N pour éviter erreur arrondi
  if (Nscara < 0 || Nscara > 0) {
    if (Mscara / Nscara < -100 || Mscara / Nscara > 100) {
      Nscara = 0
    }
  }

  // Calcul ELS
  let Ast = ASTB * 0.0001
  let Asc = ASCB * 0.0001

  sigc = getSigmaC(BFL, AEF, GCF, GTF, HFL, d, Ast, Asc, Nscara, Mscara)

  return sigc;
}
