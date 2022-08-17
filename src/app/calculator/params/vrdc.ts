import { EnumSFS, EnumSTA } from '../common/enums';
import { getFcd, getKByD, getSigmaCp, getVminByD } from '../common/functions';

/**
 * VRd,c (t)
 * Excel: EffortTranchant.C26
 * Value ex: 5.31
 * @param STA
 * @param FCK
 * @param KUNIT
 * @param SFS
 * @param ASLSF
 * @param GACF
 * @param BFL
 * @param HFL
 * @param NEDSF
 * @param GTF
 * @param VEDR
 * @returns VRd,c (t)
 */
export default async function VRDC(
  STA: EnumSTA,
  FCK: number,
  KUNIT: number,
  SFS: EnumSFS,
  ASLSF: number,
  GACF: number,
  BFL: number,
  HFL: number,
  NEDSF: number,
  GTF: number,
  VEDR: number,
  ACC: number): Promise<number> {

  let d = HFL - GTF;

  let fcd = getFcd(ACC, FCK, GACF);
  let sigmaCp = getSigmaCp(NEDSF, HFL, BFL, KUNIT, fcd);

  let vMin = getVminByD(d, STA, SFS, FCK);
  let k1 = 0.15;

  let crdc = 0.18 / GACF;
  let k = getKByD(d);
  let rol = Math.min(ASLSF * 0.0001 / (BFL * d), 0.02);
  let vrdc1 = (crdc * k * (100 * rol * FCK) ** (1 / 3) + k1 * sigmaCp) * BFL * d * 1000000 / KUNIT;

  let vrdc = 0;
  let vrdcmin = (vMin + k1 * sigmaCp) * BFL * d * 1000000 / KUNIT;

  if (vrdcmin < vrdc1) {
    vrdc = vrdc1;
  } else {
    vrdc = vrdcmin;
  }

  if (vrdc < 0) {
    vrdc = 0;
  }

  if (vrdc > VEDR) {
    /* Afficher "Ferraillage transversal non requis" (traduit)*/
  } else {
    /* Afficher "Ferraillage transversal requis" (traduit)*/
  }

  return vrdc;
}
