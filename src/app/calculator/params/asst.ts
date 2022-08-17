import { checkTorsionParams, getRadians } from '../common/functions';

/**
 * Param: A_sw/s,Torsion (cm²/ml)	(Torsion)
 * Value ex: 0.03
 * Onglet: Torsion
 * Champ: E30
 * @param ATO
 * @param STR_TO 
 * @param TED 
 * @param KUNIT 
 * @param TEF 
 * @param BFL 
 * @param HFL 
 * @param GTF 
 * @param GCF 
 * @param FYK 
 * @param GSF 
 * @returns A_sw/s,Torsion (cm²/ml); ex: .03
 */
export default async function ASST(
  ATO: number,
  STR_TO: number,
  TED: number,
  KUNIT: number,
  TEF: number,
  BFL: number,
  HFL: number,
  GTF: number,
  GCF: number,
  FYK: number,
  GSF: number,
  GACF: number,
): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  let alpha = getRadians(ATO);
  let teta = getRadians(STR_TO);
  let zy = HFL - GTF - GCF;
  let zz = BFL - GCF - GCF;
  let fyd = FYK / GSF;

  let ak = (HFL - TEF) * (BFL - TEF);
  let tottef = TED * KUNIT / (2 * ak);
  let vedtors = tottef * Math.max(zz, zy);
  let aswstors = vedtors / (Math.max(zz, zy) * fyd * 1000000 * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) * Math.sin(alpha));

  return aswstors * 10000 * 2;
}