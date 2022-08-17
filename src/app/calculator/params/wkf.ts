import { EnumAGF, EnumCBAR, EnumLFL, EnumSTA, EnumUNIT } from '../common/enums';
import { contraintesELS, getSmallKUnit } from '../common/functions';

/**
 * WKF (mm)
 * Excel: Flexion.B40
 * Value ex: 0.23
 * Note: should not be greater than Wmax = 0.3 mm
 * @param STA
 * @param UNIT
 * @param LFL
 * @param AGF
 * @param AEF
 * @param HFL
 * @param BFL
 * @param FCTM
 * @param CFL
 * @param GCF
 * @param GTF
 * @param ASCB
 * @param ASTB
 * @param MELSQ
 * @param NELSQ
 * @param NELSC
 * @param MELSC
 * @param ECM
 * @param SPBT
 * @param SPBC
 * @param K3F
 * @param K4F
 * @param CBAR
 * @param NAST1
 * @param NAST2
 * @param NAST3
 * @param LAST1
 * @param LAST2
 * @param LAST3
 * @param NASC1
 * @param NASC2
 * @param NASC3
 * @param LASC1
 * @param LASC2
 * @param LASC3
 * @returns WKF (mm); ex: 0.23
 */
export default async function WKF(
  STA: EnumSTA,
  UNIT: EnumUNIT,
  LFL: EnumLFL,
  AGF: EnumAGF,
  AEF: number,
  HFL: number,
  BFL: number,
  FCTM: number,
  CFL: number,
  GCF: number,
  GTF: number,
  ASCB: number,
  ASTB: number,
  MELSQ: number,
  MELSF: number,
  NELSQ: number,
  NELSF: number,
  NELSC: number,
  MELSC: number,
  ECM: number,
  SPBT: number,
  SPBC: number,
  K3F: number,
  K4F: number,
  CBAR: EnumCBAR,
  NAST1: number,
  NAST2: number,
  NAST3: number,
  LAST1: number,
  LAST2: number,
  LAST3: number,
  NASC1: number,
  NASC2: number,
  NASC3: number,
  LASC1: number,
  LASC2: number,
  LASC3: number,
): Promise<number> {

  let wk = NaN;

  let
    kt: number,
    hceff: number,
    Aceff: number,
    peff: number,
    deltaeps: number,
    srmax: number,
    wksup: number,
    wkinf: number


  let Es = 200000000000
  let d = HFL - GTF
  let Asc = ASCB * 0.0001
  let Ast = ASTB * 0.0001
  let espinf = SPBT
  let espsup = SPBC

  let k1 = (CBAR == EnumCBAR.HY) ? 0.8 : 0.6
  let k3 = K3F
  let k4 = K4F

  let unit = getSmallKUnit(UNIT)
  let Msquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? MELSF : MELSQ) / unit
  let Nsquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? NELSF : NELSQ) / unit
  let Nscara = NELSC / unit
  let Mscara = MELSC / unit

  let Ecm = getBendingElsEcm(ECM, AGF);

  let Deqinf = getDeq(NAST1, LAST1, NAST2, LAST2, NAST3, LAST3);
  let Deqsup = getDeq(NASC1, LASC1, NASC2, LASC2, NASC3, LASC3);

  kt = (LFL == EnumLFL.LTL) ? 0.4 : 0.6

  if (Nsquasi < 0 || Nsquasi > 0) {
    if (Msquasi / Nsquasi < -100 || Msquasi / Nsquasi > 100) {
      Nsquasi = 0
    }
  }

  if (Nscara < 0 || Nscara > 0) {
    if (Mscara / Nscara < -100 || Mscara / Nscara > 100) {
      Nscara = 0
    }
  }

  let els = contraintesELS(BFL, Asc, Ast, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

  if (STA === EnumSTA.NF_EN_1992_3_NA) {
    // Calcul ouverture fissures avec NF EN1992-3
    kt = 0.4
    if (els.k2 == 0) {
      els.x = HFL
      wk = 0

    } else if (els.k2 == 0.5) {

      hceff = Math.min(2.5 * (HFL - d), (HFL - els.x) / 3, HFL / 2)
      Aceff = hceff * BFL
      peff = Ast / Aceff
      Es = Es * 0.000001
      deltaeps = Math.max((els.sigs - kt * (FCTM / peff) * (1 + (Es / (Ecm * 1000)) * peff)) / Es, 0)


      if (espinf * 0.001 < 5 * (CFL * 0.001 + Deqinf * 0.001 / 2)) {
        srmax = 2 * CFL * 0.001 + 1 / (2 * 1.8) * Deqinf * 0.001 / peff
      } else {
        srmax = 1.3 * (HFL - els.x)
      }

      wk = srmax * deltaeps * 1000

      if (els.sigs < 0) {
        wk = 0
      }

    } else {
      // acier sup
      hceff = Math.min(2.5 * GCF, HFL / 2, HFL / 3)
      Aceff = hceff * BFL
      peff = Asc / Aceff
      Es = Es * 0.000001
      deltaeps = Math.max((els.sigs2 - kt * (FCTM / peff) * (1 + (Es / (Ecm * 1000)) * peff)) / Es, 0)


      if (espsup * 0.001 < 5 * (CFL * 0.001 + Deqsup * 0.001 / 2)) {
        srmax = 2 * CFL * 0.001 + 1 / (2 * 1.8) * Deqsup * 0.001 / peff
      } else {
        srmax = 1.3 * (HFL - els.x)
      }

      wksup = srmax * deltaeps * 1000

      // acier inf
      hceff = Math.min(2.5 * (HFL - d), HFL / 2, HFL / 3)
      Aceff = hceff * BFL
      peff = Ast / Aceff

      deltaeps = Math.max((els.sigs - kt * (FCTM / peff) * (1 + (Es / (Ecm * 1000)) * peff)) / Es, 0)


      if (espinf * 0.001 < 5 * (CFL * 0.001 + Deqinf * 0.001 / 2)) {
        srmax = 2 * CFL * 0.001 + 1 / (2 * 1.8) * Deqinf * 0.001 / peff
      } else {
        srmax = 1.3 * (HFL - els.x)
      }

      wkinf = srmax * deltaeps * 1000

      wk = Math.max(wksup, wkinf)
    }
  } else {
    // Calcul ouverture fissures avec autres réglements
    if (els.k2 == 0) {
      els.x = HFL
      wk = 0

    } else if (els.k2 == 0.5) {

      hceff = Math.min(2.5 * (HFL - d), (HFL - els.x) / 3, HFL / 2)
      Aceff = hceff * BFL
      peff = Ast / Aceff
      Es = Es * 0.000001
      deltaeps = Math.max((els.sigs - kt * (FCTM / peff) * (1 + (Es / (Ecm * 1000)) * peff)) / Es, 0.6 * els.sigs / Es)


      if (espinf * 0.001 < 5 * (CFL * 0.001 + Deqinf * 0.001 / 2)) {
        srmax = k3 * CFL * 0.001 + k1 * els.k2 * k4 * Deqinf * 0.001 / peff
      } else {
        srmax = 1.3 * (HFL - els.x)
      }

      wk = srmax * deltaeps * 1000

      if (els.sigs < 0) {
        wk = 0
      }

    } else {
      // acier sup
      hceff = Math.min(2.5 * GCF, HFL / 2, HFL / 3)
      Aceff = hceff * BFL
      peff = Asc / Aceff
      Es = Es * 0.000001
      deltaeps = Math.max((els.sigs2 - kt * (FCTM / peff) * (1 + (Es / (Ecm * 1000)) * peff)) / Es, 0.6 * els.sigs2 / Es)


      if (espsup * 0.001 < 5 * (CFL * 0.001 + Deqsup * 0.001 / 2)) {
        srmax = k3 * CFL * 0.001 + k1 * els.k2 * k4 * Deqsup * 0.001 / peff
      } else {
        srmax = 1.3 * (HFL - els.x)
      }

      wksup = srmax * deltaeps * 1000

      // acier inf
      hceff = Math.min(2.5 * (HFL - d), HFL / 2, HFL / 3)
      Aceff = hceff * BFL
      peff = Ast / Aceff

      deltaeps = Math.max((els.sigs - kt * (FCTM / peff) * (1 + (Es / (Ecm * 1000)) * peff)) / Es, 0.6 * els.sigs / Es)


      if (espinf * 0.001 < 5 * (CFL * 0.001 + Deqinf * 0.001 / 2)) {
        srmax = k3 * CFL * 0.001 + k1 * els.k2 * k4 * Deqinf * 0.001 / peff
      } else {
        srmax = 1.3 * (HFL - els.x)
      }

      wkinf = srmax * deltaeps * 1000

      wk = Math.max(wksup, wkinf)

    }
  }

  return wk;
}

function getDeq(
  nas1: number, las1: number,
  nas2: number, las2: number,
  nas3: number, las3: number,
) {

  let numerator = 0;
  let denominator = 0;

  numerator = nas1 * las1 ** 2 + numerator;
  denominator = nas1 * las1 + denominator;

  numerator = nas2 * las2 ** 2 + numerator;
  denominator = nas2 * las2 + denominator;

  numerator = nas3 * las3 ** 2 + numerator;
  denominator = nas3 * las3 + denominator;

  let deqInf = (denominator == 0) ? 0 : numerator / denominator;
  return deqInf;
}

/**
 * Ecm in GPa as used in Els method in Blending/Flexion Excel sheet
 * @param ECM Ecm from Data sheet ! in MPa !
 * @param AGF
 * @returns Ecm in GPa
 */
function getBendingElsEcm(
  ECM: number,
  AGF: EnumAGF): number {

  let ecm = ECM / 1000; // MPa en GPa

  switch (AGF) {
    case EnumAGF.QUARTZITE:
      // nothing to do
      break;
    case EnumAGF.LIMESTONE:
    case EnumAGF.SANDSTONE:
      ecm *= 0.9;
      break;
    case EnumAGF.BASALT:
      ecm *= 1.2;
      break;
  }
  return ecm;
}

/**
 * Flexion function
 * @param BFL
 * @param Asc
 * @param Ast
 * @param AEF
 * @param d
 * @param HFL
 * @param GCF
 * @param GTF
 * @param ns Nscara Or Nsquasi
 * @param ms Mscara Or Msquasi
 * @returns class to update
export function getK2(
  BFL: number,
  Asc: number,
  Ast: number,
  AEF: number,
  d: number,
  HFL: number,
  GCF: number,
  GTF: number,
  ns: number,
  ms: number,
): number {

  let k2: number;

  let ce: number,
    vc: number,
    eps1: number,
    eps2: number

  vc = (GCF * AEF * Asc + HFL / 2 * BFL * HFL + d * AEF * Ast) / (AEF * Asc + AEF * Ast + BFL * HFL)
  // vt = (_GCF * _AEF * Asc + d * _AEF * Ast) / (_AEF * Asc + _AEF * Ast)

  if (ns == 0) {
    // flexion simple
    k2 = 0.5
  }
  else if (ns > 0 && ms / ns - (HFL / 2 - vc) <= HFL / 6 && ms / ns - (HFL / 2 - vc) >= -HFL / 6) {
    // section entierement comprimée
    k2 = 0
  }
  else if (ns < 0 && (ms / ns >= -(HFL / 2 - GCF) && ms / ns <= (HFL / 2 - GTF))) {
    // section entièrement tendue
    if (Asc == 0) {
      throw "Section entièrement tendue, donner une valeur de Asc"
    }

    ce = HFL / 2 - ms / ns

    let sigs2 = Math.abs(ns * (d - ce) / ((d - GCF) * Asc))
    let sigs = Math.abs(ns * (ce - GCF) / ((d - GCF) * Ast))

    eps1 = Math.max(sigs, sigs2)
    eps2 = Math.min(sigs, sigs2)

    k2 = (eps1 + eps2) / (2 * eps1)

  } else {
    // section partiellement comprimée
    k2 = 0.5
  }

  return k2;
}
*/