import { checkTorsionParams, getRadians } from '../common/functions';

/**
 * Param: A_sw/s,y (cm²/ml)	(Tranchant)
 * Value ex: 0.00 
 * Onglet: Torsion
 * Champ: E28
 * @returns A_sw/s,y (cm²/ml); ex: 0.00
 * @param VEDYR 
 * @param KUNIT 
 * @param BFL 
 * @param GCF 
 * @param FYK 
 * @param GSF 
 * @param STR_TO 
 * @param ATO 
 * @param GTF 
 * @param HFL 
 * @param TTVV
 * @param GACF
 */
export default async function ASSY(
  VEDYR: number,
  KUNIT: number,
  BFL: number,
  GCF: number,
  FYK: number,
  GSF: number,
  STR_TO: number,
  ATO: number,
  GTF: number,
  HFL: number,
  TTVV: number,
  GACF: number,
): Promise<number> {


  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  let dy = BFL - GCF;
  let fyd = FYK / GSF;
  let teta = getRadians(STR_TO)
  let alpha = getRadians(ATO);

  // Calcul des armatures transversales du à l'effort tranchant
  let aswstrany = VEDYR * KUNIT / (0.9 * dy * fyd * 1000000 * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) * Math.sin(alpha));

  if (!(TTVV < 1)) {
    aswstrany = VEDYR * KUNIT / (0.9 * dy * 0.8 * FYK * 1000000 * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) * Math.sin(alpha));
  }

  return aswstrany * 10000;
}