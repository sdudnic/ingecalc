import { EnumSTA } from '../common/enums';
import { checkTorsionParams, getBasicN1TO, getRadians } from '../common/functions';
import TTVV from './ttvv';

/**
 * Param: A_sw/s,z (cm²/ml)	(Tranchant)
 * Value ex: 2.04
 * Excel: Torsion.E29
 * @returns A_sw/s,z (cm²/ml); ex: 2.04
 * @param STA 
 * @param N622X06 
 * @param TED 
 * @param VEDY 
 * @param VEDZ 
 * @param ACWT 
 * @param TEF 
 * @param FCK 
 * @param ACC 
 * @param VEDZR 
 * @param KUNIT 
 * @param BFL 
 * @param GCF 
 * @param FYK 
 * @param GSF 
 * @param STR_TO 
 * @param ATO 
 * @param GTF 
 * @param HFL 
 * @param GACF 
 */
export default async function ASSZ(
  STA: EnumSTA,
  N622X06: number,
  TED: number,
  VEDY: number,
  VEDZ: number,
  ACWT: number,
  TEF: number,
  FCK: number,
  ACC: number,
  VEDZR: number,
  KUNIT: number,
  BFL: number,
  GCF: number,
  FYK: number,
  GSF: number,
  STR_TO: number,
  ATO: number,
  GTF: number,
  HFL: number,
  GACF: number,
): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  let dz = HFL - GTF;
  let fyd = FYK / GSF;
  let teta = getRadians(STR_TO)
  let alpha = getRadians(ATO);

  // Calcul des armatures transversales du à l'effort tranchant
  let aswstranz = VEDZR * KUNIT / (0.9 * dz * fyd * 1000000 * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) * Math.sin(alpha));

  const basicN1TO = await getBasicN1TO(STA, N622X06, ATO, FCK);
  const basicTTVV = await TTVV(GTF, HFL, GCF, BFL, GSF, FYK, GACF, TED, KUNIT, VEDY, VEDZ, STR_TO, ATO, ACWT, N622X06, TEF, basicN1TO, FCK, ACC);

  if (basicTTVV >= 1) {
    aswstranz = VEDZR * KUNIT / (0.9 * dz * 0.8 * FYK * 1000000 * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) * Math.sin(alpha));
  }

  return aswstranz * 10000;
}
