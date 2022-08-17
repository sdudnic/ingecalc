import * as Common from '../common/functions';
import { EnumSFS, EnumSTA, ErrorLevel } from '../common/enums';
import { checkTorsionParams, getFcd, getKByD, getRadians, getRolByD, getSigmaCp, getTrdc, getVminByD, getVrdc, throwCalculatorError } from '../common/functions';

/**
 * Param: A_l,Torsion (cm²)	(Torsion)	(% min § 9.2.1.1)
 * Excel: Torsion.E33
 * Note: (% min § 9.2.1.1)
 * @param STA
 * @param SFS
 * @param GTF
 * @param HFL
 * @param GCF
 * @param BFL
 * @param GSF
 * @param GACF
 * @param TED
 * @param KUNIT
 * @param VEDYR
 * @param VEDZR
 * @param FCTM
 * @param TEF
 * @param FYK
 * @param CRDC622
 * @param K1622
 * @param FCK
 * @param ASLSF
 * @param NEDT
 * @param ACT
 * @param FCTK005
 * @param ACC
 * @param STR_TO
 * @returns A_l,Torsion (cm²); ex: 1.90
 */
export default async function ALT(
  STA: EnumSTA,
  SFS: EnumSFS,
  GTF: number,
  HFL: number,
  GCF: number,
  BFL: number,
  GSF: number,
  GACF: number,
  TED: number,
  KUNIT: number,
  VEDYR: number,
  VEDZR: number,
  FCTM: number,
  TEF: number,
  FYK: number,
  CRDC622: number,
  K1622: number,
  FCK: number,
  ASLSF: number,
  NEDT: number,
  ACT: number,
  FCTK005: number,
  ACC: number,
  STR_TO: number,

): Promise<number> {

  checkTorsionParams(GTF, HFL, GCF, BFL, FYK, GSF, GACF);

  let dy = BFL - GCF;
  let dz = HFL - GTF;

  let vminy = getVminByD(dy, STA, SFS, FCK);
  let vminz = getVminByD(dz, STA, SFS, FCK);

  let roly = getRolByD(dy, HFL, ASLSF);
  let rolz = getRolByD(dz, BFL, ASLSF);

  let ky = getKByD(dy);
  let kz = getKByD(dz);

  let fcd = getFcd(ACC, FCK, GACF);
  let sigcp = getSigmaCp(NEDT, HFL, BFL, KUNIT, fcd);

  let vrdcy = getVrdc(dy, ky, roly, sigcp, HFL, vminy, CRDC622, FCK, K1622);
  let vrdcz = getVrdc(dz, kz, rolz, sigcp, BFL, vminz, CRDC622, FCK, K1622);

  let ak = (HFL - TEF) * (BFL - TEF);
  let trdc = getTrdc(ACT, FCTK005, GACF, HFL, BFL, TEF);

  let _ALT_INFO = ""; // message à afficher à coté du champ

  if ((TED * KUNIT / trdc + VEDYR * KUNIT / vrdcy + VEDZR * KUNIT / vrdcz) < 1) {
    _ALT_INFO = "(% min § 9.2.1.1)";
    return 0.26 * BFL * dz * FCTM / FYK * 10000;
  }
  else {
    let uk = 2 * (HFL - TEF + BFL - TEF);
    let teta = getRadians(STR_TO);
    let fyd = FYK / GSF;
    let asl = TED * KUNIT / (2 * ak) * Math.cos(teta) / Math.sin(teta) * uk / (fyd * 1000000);
    if (asl > 0.04 * BFL * HFL) {
      _ALT_INFO = "message.Asl > 004Ac";
      throwCalculatorError(_ALT_INFO, "ALT", undefined, asl * 10000, ErrorLevel.WARNING);
    }
    return asl * 10000;
  }
}
