import { checkTorsionParams, getFcd, getRadians, getTrdMax, getVrdMax } from '../common/functions';

/**
 * Param: TEd / TRd,max + VEdz / VRd,max,z | + info < 1 --> OK
 * Value ex: 0.07
 * Onglet: Torsion
 * Champ: E36
 * @param GTF
 * @param HFL
 * @param GCF
 * @param BFL
 * @param GSF
 * @param FYK
 * @param GACF
 * @param TED
 * @param KUNIT
 * @param VEDY
 * @param VEDZ
 * @param STR_TO
 * @param ATO
 * @param ACWT
 * @param N622X06
 * @param TEF
 * @param N1TO
 * @param FCK
 * @param ACC
 * @returns coef TTVV
 */
export default async function TTVV(
  GTF: number,
  HFL: number,
  GCF: number,
  BFL: number,
  GSF: number,
  FYK: number,
  GACF: number,
  TED: number,
  KUNIT: number,
  VEDY: number,
  VEDZ: number,
  STR_TO: number,
  ATO: number,
  ACWT: number,
  N622X06: number,
  TEF: number,
  N1TO: number,
  FCK: number,
  ACC: number,
): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  let teta = getRadians(STR_TO);
  let alpha = getRadians(ATO);

  let dy = BFL - GCF;
  let dz = HFL - GTF;

  let fcd = getFcd(ACC, FCK, GACF);

  // Vérification des bielles de béton
  let trdmax = getTrdMax(HFL, BFL, ACC, FCK, GACF, STR_TO, N622X06, ACWT, TEF);

  //let vrdmaxy = ACW * HFL * 0.9 * dy * N1TO * fcd * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) / (1 + (Math.cos(teta) / Math.sin(teta)) ** 2) * 1000000;
  //let vrdmaxz= ACW * BFL * 0.9 * dz * N1TO * fcd * (Math.cos(teta) / Math.sin(teta) + Math.cos(alpha) / Math.sin(alpha)) / (1 + (Math.cos(teta) / Math.sin(teta)) ** 2) * 1000000;
  let vrdmaxy = getVrdMax(dy, HFL, alpha, teta, fcd, ACWT, N1TO);
  let vrdmaxz = getVrdMax(dz, BFL, alpha, teta, fcd, ACWT, N1TO);

  let ttvv = TED * KUNIT / trdmax + VEDY * KUNIT / vrdmaxy + VEDZ * KUNIT / vrdmaxz;

  return ttvv;
}
