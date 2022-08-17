import { EnumSTA, EnumUNIT } from '../common/enums';
import { getSigmaS, getSigmaS2, getSmallKUnit } from '../common/functions';

/**
 * Flexion.B42
 */
export default async function QCF(
  STA: EnumSTA,
  UNIT: EnumUNIT,
  NELSQ: number,
  MELSQ: number,
  BFL: number,
  AEF: number,
  GCF: number,
  GTF: number,
  HFL: number,
  ASTB: number,
  ASCB: number,
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
      return NaN;

    case EnumSTA.RCC_CW_2018:
      let qcf: number = NaN

      let d = HFL - GTF
      let Ast = ASTB * 0.0001
      let Asc = ASCB * 0.0001

      let kunit = getSmallKUnit(UNIT)

      let Msquasi = MELSQ / kunit
      let Nsquasi = NELSQ / kunit

      // Limitation rapport M/N pour éviter erreur arrondi
      if (Nsquasi < 0 || Nsquasi > 0) {
        if (Msquasi / Nsquasi < -100 || Msquasi / Nsquasi > 100) {
          Nsquasi = 0
        }
      }

      let sigs: number = getSigmaS(BFL, AEF, GCF, GTF, HFL, d, Ast, Asc, Nsquasi, Msquasi)

      if (Asc == 0) {
        qcf = Math.abs(sigs)
      } else {
        let sigs2: number = getSigmaS2(BFL, Asc, Ast, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi);
        qcf = Math.max(Math.abs(sigs), Math.abs(sigs2))
      }

      return qcf;
  }
}