import { EnumSTA, EnumUNIT } from '../common/enums';
import { contraintesELS, ElsParams, getSmallKUnit } from '../common/functions';

/**
 * x (m)
 * Bending/Flexion.B45
 * @param STA 
 * @param UNIT 
 * @param BFL 
 * @param AEF 
 * @param HFL 
 * @param GCF 
 * @param GTF 
 * @param ASTB 
 * @param ASCB 
 * @param MELSQ 
 * @param NELSQ 
 * @param MELSF 
 * @param NELSF 
 * @returns x (m)
 */
export default async function XQC(
  STA: EnumSTA,
  UNIT: EnumUNIT,
  BFL: number,
  AEF: number,
  HFL: number,
  GCF: number,
  GTF: number,
  ASTB: number,
  ASCB: number,
  MELSQ: number,
  NELSQ: number,
  MELSF: number,
  NELSF: number,
): Promise<number> {

  let els: ElsParams = {
    k2: NaN,
    sigc: NaN,
    sigct: NaN,
    sigs: NaN,
    sigs2: NaN,
    x: NaN,
  }

  let d = HFL - GTF
  let Ast = ASTB * 0.0001
  let Asc = ASCB * 0.0001
  let kunit = getSmallKUnit(UNIT)
  let Msquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? MELSF : MELSQ) / kunit
  let Nsquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? NELSF : NELSQ) / kunit


  if (Nsquasi < 0 || Nsquasi > 0) {
    if (Msquasi / Nsquasi < -100 || Msquasi / Nsquasi > 100)
      Nsquasi = 0
  }

  els = contraintesELS(BFL, Asc, Ast, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi) //  <<<<<<<<<

  if (STA === EnumSTA.NF_EN_1992_3_NA) {
    // Calcul ouverture fissures avec NF EN1992-3
    if (els.k2 == 0) {
      els.x = HFL //  <<<<<<<<<
    }
  } else {
    // Calcul ouverture fissures avec autres réglements
    if (els.k2 == 0) {
      els.x = HFL //  <<<<<<<<<
    }
  }

  return els.x;
}
