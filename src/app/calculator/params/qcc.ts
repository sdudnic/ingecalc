import { EnumSTA, EnumUNIT } from '../common/enums';
import { getSigmaC, getSmallKUnit } from '../common/functions';

/**
 * sigma_c, MPa
 * Flexion/Bending tab
 * Excel: B44
 * @param STA 
 * @param UNIT 
 * @param MELSQ 
 * @param NELSQ 
 * @param MELSF 
 * @param NELSF 
 * @param BFL 
 * @param AEF 
 * @param GCF 
 * @param GTF 
 * @param HFL 
 * @param ASTB 
 * @param ASCB 
 * @returns Value ex: 5.47
 */
export default async function QCC(
  STA: EnumSTA,
  UNIT: EnumUNIT,
  MELSQ: number,
  NELSQ: number,
  MELSF: number,
  NELSF: number,
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
  let unit = getSmallKUnit(UNIT)

  let Msquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? MELSF : MELSQ) / unit
  let Nsquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? NELSF : NELSQ) / unit

  // Limitation rapport M/N pour éviter erreur arrondi
  if (Nsquasi < 0 || Nsquasi > 0) {
    if (Msquasi / Nsquasi < -100 || Msquasi / Nsquasi > 100) {
      Nsquasi = 0
    }
  }

  // Calcul ELS
  let Ast = ASTB * 0.0001
  let Asc = ASCB * 0.0001

  sigc = getSigmaC(BFL, AEF, GCF, GTF, HFL, d, Ast, Asc, Nsquasi, Msquasi)

  return sigc;
}