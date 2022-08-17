import { EnumSTA } from '../common/enums';
import { getBasicVRDM, getDegrees, getFcd, getRadians, getSigmaCp } from '../common/functions';

/**
 * Armatures transversales
 * A_sw /s (cm²/ml)
 * Value ex: 26.46
 * Excel: ShearForce/EffortTranchant.I28
 * @param STA
 * @param KUNIT
 * @param BFL
 * @param HFL
 * @param VEDR
 * @param VRDC
 * @param STR_SF
 * @param SRSF
 * @param GACF
 * @param NEDSF
 * @param GTF
 * @param FYK
 * @param GSF
 * @param FCK
 * @param FCTM
 * @param ACC
 * @param ACW
 * @returns A_sw /s (cm²/ml); ex: 26.46
 */
export default async function ASWS(
  STA: EnumSTA,
  KUNIT: number,
  BFL: number,
  HFL: number,
  VEDR: number,
  VRDC: number,
  STR_SF: number,
  SRSF: number,
  GACF: number,
  NEDSF: number,
  GTF: number,
  FYK: number,
  GSF: number,
  FCK: number,
  FCTM: number,
  ACC: number,
  VED: number,
  ACW: number,
): Promise<number> {

  if (VEDR < VRDC) {
    return 0;
  }

  checkParams(GTF, HFL, BFL, FYK, VED, VEDR, GACF, GSF);

  let bw = BFL;
  let d = HFL - GTF; //OK
  let z = 0.9 * d; // OK
  let fywd = FYK / GSF;

  let teta = getRadians(STR_SF);
  let alpha = getRadians(SRSF);

  let fcd = getFcd(ACC, FCK, GACF);
  let sigmaCp = getSigmaCp(NEDSF, HFL, BFL, KUNIT, fcd);

  let vfd: number;
  if (sigmaCp < 0) {
    vfd = Math.max(bw * d / GACF * (sigmaCp * (2.454 / FCK + 0.27) + 0.03 * FCK + 0.27), 0)
  } else {
    vfd = Math.max(bw * d / GACF * (sigmaCp * (0.736 / FCK + 0.081) + 0.03 * FCK + 0.27), 0)
  }

  let asws: number
  switch (STA) {
    case EnumSTA.EN1992_1_1_BS:
    case EnumSTA.EN1992_2_BS:
    case EnumSTA.EN_1992_3_BS:
    case EnumSTA.NF_EN_1992_1_1_NA:
    case EnumSTA.NF_EN_1992_2_NA:
    case EnumSTA.NF_EN_1992_3_NA:
    case EnumSTA.BS_EN_1992_1_1_NA:
    case EnumSTA.BS_EN_1992_3_NA:
      let basicVRDM = await getBasicVRDM(STA, KUNIT, BFL, HFL, GTF, ACW, STR_SF, SRSF, NEDSF, GACF, FCK, ACC, FCTM)
      if (basicVRDM < VED) {
        fywd = 0.8 * FYK;
      }
      asws = VEDR * KUNIT / 1000000 / (z * fywd) / (1 / Math.tan(teta) + 1 / Math.tan(alpha)) / Math.sin(alpha) * 10000; // 951
      break;

    case EnumSTA.RCC_CW_2018:
      let angleCoef = (sigmaCp < 0) ? 0.9 : 0.2;
      let angle = Math.atan(1 / Math.max(1, 1.2 + angleCoef * sigmaCp / FCTM))
      let str = getDegrees(angle); // str(theta) est-une valeur calculéé pour le reglement RCC-CW 2018
      teta = getRadians(str);
      asws = Math.max((VEDR * KUNIT / 1000000 - vfd) / (z * fywd) / (1 / Math.tan(teta) + 1 / Math.tan(alpha)) / Math.sin(alpha), 0) * 10000; // 949
      break;
  }
  return asws;
}

function checkParams(GTF: number, HFL: number, BFL: number, FYK: number, VED: number, VEDR: number, GACF: number, GSF: number) {
  if (GTF > HFL / 2)
    throw "gt doit être inférieur à h/2";
  else if (BFL == 0 || HFL == 0 || FYK == 0 || VED == 0 || VEDR == 0 || GACF == 0 || GSF == 0)
    throw "Certaines valeurs nulles rendent le calcul impossible";
  else if (VED < 0 || VEDR < 0)
    throw "Les valeurs de l'effort tranchant doivent être positives";
}

