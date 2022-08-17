import { EnumUNIT } from '../common/enums';
import { getSigmaS, getSigmaS2, getSmallKUnit } from '../common/functions';

/**
 * sigma_c, MPa
 * Flexion/Bending tab
 * Excel: B41
 * Value ex: 265.77
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
export default async function CCS(
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

  let ccs: number = NaN

  let d = HFL - GTF
  let Ast = ASTB * 0.0001
  let Asc = ASCB * 0.0001

  let kunit = getSmallKUnit(UNIT)

  let Nscara = NELSC / kunit
  let Mscara = MELSC / kunit

  if (Nscara < 0 || Nscara > 0) {
    if (Mscara / Nscara < -100 || Mscara / Nscara > 100) {
      Nscara = 0
    }
  }

  let sigs: number = getSigmaS(BFL, AEF, GCF, GTF, HFL, d, Ast, Asc, Nscara, Mscara)

  if (Asc == 0) {
    ccs = Math.abs(sigs)
  } else {
    let sigs2: number = getSigmaS2(BFL, Asc, Ast, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
    ccs = Math.max(Math.abs(sigs), Math.abs(sigs2))
  }

  return ccs;
}
