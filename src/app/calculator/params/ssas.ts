import { EnumSREP, EnumSTA } from "../common/enums";
import { getFcd, getRadians } from "../common/functions";

/**
 * Asw /s,min (cm²/ml) - SSAS - Section d'acier nécessaire pour respecter la contrainte
 * Value ex: 0.29
 * Excel. EffTranchant.K47
 * @param STA
 * @param VEDI
 * @param VRDI
 * @param BFLI
 * @param KUNIT
 * @param VEDR
 * @param BFL
 * @param GSF
 * @param FYK
 * @param HFL
 * @param GTF
 * @param SRSF
 * @param FCK
 * @param GACF
 * @param ACC
 * @param SREP
 * @param NEDPI
 * @param CDY
 * @param FCTK005
 * @returns Asw /s,min (cm²/ml), by eg: 0.29
 */
export default async function SSAS(
  STA: EnumSTA,
  VEDI: number,
  VRDI: number,
  BFLI: number,
  KUNIT: number,
  VEDR: number,
  BFL: number,
  GSF: number,
  FYK: number,
  HFL: number,
  GTF: number,
  SRSF: number,
  FCK: number,
  GACF: number,
  ACC: number,
  SREP: EnumSREP,
  NEDPI: number,
  CDY: boolean,
  FCTK005: number,
): Promise<number> {
  //debugger;
  let alpha = getRadians(SRSF);

  let d = (HFL - GTF); //en m
  let ai = BFLI * 1; //en m²
  let ac = BFL * HFL; //en m²
  let sig1 = NEDPI * KUNIT / 1000000 / ac;
  let result: number;

  if (STA === EnumSTA.RCC_CW_2018) {
    result = (VEDR * KUNIT / 1000000 / (BFL * d) - sig1) * BFL * GSF / (0.9 * FYK * (Math.cos(alpha) + Math.sin(alpha))) * 10000;
    return result;
  }
  else {
    if (VEDI < VRDI) {
      //_SSAS.Hidden = True
      return Infinity; //hidden
    }
    else {
      let v = 0.6 * (1 - FCK / 250);
      let fcd = getFcd(ACC, FCK, GACF);

      if (0.5 * v * fcd < VEDI) {
        //_SSAS.Hidden = True
        return Infinity; //hidden
      }
      else {
        let cu = getCuBySurface(SREP);
        if (NEDPI < 0) cu = 0;
        if (CDY) cu /= 2;

        let Mu = getMuBySurface(SREP);
        let act = 1;
        let fctd = act * FCTK005 / GACF;
        let sign = (sig1 < 0.6 * fcd) ? sig1 : 0.6 * fcd;
        let fyd = FYK / GSF;
        //_SSAS.Hidden = false
        result = ai * (VEDI - cu * fctd - Mu * sign) / (fyd * (Mu * Math.sin(alpha) + Math.cos(alpha))) * 10000
        return result;
      }
    }
  }
}

function getCuBySurface(SREP: EnumSREP): number {
  switch (SREP) {
    case EnumSREP.VSMOOTH: return 0.025;
    case EnumSREP.SMOOTH: return 0.2;
    case EnumSREP.ROUGH: return 0.4;
    default: return 0.5;
  }
}

function getMuBySurface(SREP: EnumSREP): number {
  switch (SREP) {
    case EnumSREP.VSMOOTH: return 0.5;
    case EnumSREP.SMOOTH: return 0.6;
    case EnumSREP.ROUGH: return 0.7;
    default: return 0.9;
  }
}
