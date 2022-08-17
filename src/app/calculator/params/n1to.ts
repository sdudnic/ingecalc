import { EnumSTA } from '../common/enums';
import { checkTorsionParams, getBasicN1TO, getRadians } from '../common/functions';
import TTVV from './ttvv';

/**
 * Gets the basic (pre ttvv) niu._1
 * Value ex: 0.53
 * Excel: Torsion.H9
 * @returns niu._1 (ex 0.53)
 * @param STA 
 * @param N622X06 
 * @param ATO 
 * @param GTF 
 * @param HFL 
 * @param GCF 
 * @param BFL 
 * @param FYK 
 * @param GSF 
 * @param GACF 
 * @param FCK 
 * @param TED 
 * @param KUNIT 
 * @param VEDY 
 * @param VEDZ 
 * @param STR_TO 
 * @param ACWT 
 * @param TEF 
 * @param ACC 
 */
export default async function N1TO(
  STA: EnumSTA,
  N622X06: number,
  ATO: number,
  GTF: number,
  HFL: number,
  GCF: number,
  BFL: number,
  FYK: number,
  GSF: number,
  GACF: number,
  FCK: number,
  TED: number,
  KUNIT: number,
  VEDY: number,
  VEDZ: number,
  STR_TO: number,
  ACWT: number,
  TEF: number,
  ACC: number,
): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  const basicN1TO = await getBasicN1TO(STA, N622X06, ATO, FCK);
  const basicTTVV = await TTVV(GTF, HFL, GCF, BFL, GSF, FYK, GACF, TED, KUNIT, VEDY, VEDZ, STR_TO, ATO, ACWT, N622X06, TEF, basicN1TO, FCK, ACC)
  const n1to = (basicTTVV < 1) ? basicN1TO : await N1TO_lowTTVV(STA, ATO, GTF, HFL, GCF, BFL, FYK, GSF, GACF, FCK);

  return n1to;
}

/**
 * Gets the updated (post ttvv) niu._1
 * Value ex: 0.53
 * Excel: Torsion.H9
 * @param STA
 * @param ATO
 * @param GTF
 * @param HFL
 * @param GCF
 * @param BFL
 * @param FYK
 * @param GSF
 * @param GACF
 * @param FCK
 * @returns niu._1 (ex 0.53)
 */
export async function N1TO_lowTTVV(
  STA: EnumSTA,
  ATO: number,
  GTF: number,
  HFL: number,
  GCF: number,
  BFL: number,
  FYK: number,
  GSF: number,
  GACF: number,
  FCK: number,
): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  return getLowTtvvN1TO(STA, ATO, FCK);
}


/**
 * N1TO dans le cas ou TTVV est supérieur ou égal à 1
 * @param STA
 * @param ATO
 * @param FCK
 * @returns
 */
export function getLowTtvvN1TO(
  STA: EnumSTA,
  ATO: number,
  FCK: number,
): number {

  switch (STA) {
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      {
        let alpha = getRadians(ATO)
        // AN British
        return (FCK < 60) ? 0.54 * (1 - 0.5 * Math.cos(alpha))
          : Math.max((0.84 - FCK / 200) * (1 - 0.5 * Math.cos(alpha)), 0.5);
      }

    default: {
      // Autres réglement
      return (FCK < 60) ? 0.6 : Math.max(0.9 - FCK / 200, 0.5);
    }
  }
}