import { EnumCDF, EnumKCO } from '../common/enums';
import { checkInvalidEluFlexionValues, getIntegrale, getIntegrale2, simpson1, simpson2 } from '../common/functions';

/**
 * Flexion.D25
 * @param CDF
 * @param KCO
 * @param KUNIT
 * @param NELU
 * @param MELU
 * @param BFL
 * @param HFL
 * @param GCF
 * @param GTF
 * @param GSF
 * @param GACF
 * @param FYK
 * @param FCK
 * @param ACC
 * @param ECU2
 * @param EC2
 * @param N
 * @param EPSUK
 * @param K
 * @returns
 */
export default async function ASC1(
  CDF: EnumCDF,
  KCO: EnumKCO,
  KUNIT: number,
  NELU: number,
  MELU: number,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  GSF: number,
  GACF: number,
  FYK: number,
  FCK: number,
  ACC: number,
  ECU2: number,
  EC2: number,
  N: number,
  EPSUK: number,
  K: number,
): Promise<number> {

  let asc = getAsc(CDF, KCO, KUNIT, NELU, MELU, BFL, HFL, GCF, GTF, GSF, GACF, FYK, FCK, ACC, ECU2, EC2, N, EPSUK, K)
  let asc1 = asc * 10000;
  return asc1;
}

/**
 * Flexion tab
 * @param CDF
 * @param KCO
 * @param KUNIT
 * @param NELU
 * @param MELU
 * @param BFL
 * @param HFL
 * @param GCF
 * @param GTF
 * @param GSF
 * @param GACF
 * @param FYK
 * @param FCK
 * @param ACC
 * @param ECU2
 * @param EC2
 * @param N
 * @param EPSUK
 * @param K
 * @returns
 */
function getAsc(
  CDF: EnumCDF,
  KCO: EnumKCO,
  KUNIT: number,
  NELU: number,
  MELU: number,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  GSF: number,
  GACF: number,
  FYK: number,
  FCK: number,
  ACC: number,
  ECU2: number,
  EC2: number,
  N: number,
  EPSUK: number,
  K: number,
): number {

  let asc: number = 0
  let u: number, ur: number

  checkInvalidEluFlexionValues(NELU, MELU, BFL, HFL, GCF, GTF, GSF, GACF)

  let Mui = MELU + NELU * (HFL / 2 - GTF)
  let d = HFL - GTF
  let fyd = FYK * 1000000 / GSF
  let Es = 200000000000
  let Nsc: number, Mc: number, sigsc: number, epsc: number,
    integrale: number, integrale2: number,
    dzeta: number, para: number, upara: number,
    upivota: number, Ast: number, sigst: number,
    epsst: number, epso: number, Nst: number,
    Nc: number;

  let nu = 1

  let lambda = NaN
  if (FCK <= 50) {
    lambda = 0.8
    nu = 1
  } else if (CDF == EnumCDF.RSD) {
    lambda = 0.8 - (FCK - 50) / 400
    nu = 1 - (FCK - 50) / 200
  }


  let fcd = nu * ACC * FCK * 1000000 / GACF

  if (NELU == 0 && (CDF == EnumCDF.RSD)) {
    // flexion simple rectangulaire simplifié

    u = (MELU) * KUNIT / (BFL * d * d * fcd)
    ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))

    if (!(u < ur)) {
      u = ur
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
      epsst = ECU2 * (1 - dzeta) / dzeta

      if (KCO == EnumKCO.H) {
        sigst = Math.min(epsst * Es / 1000, fyd)
      }
      else {
        if (epsst > 0.9 * EPSUK * 10) {
          epsst = 0.9 * EPSUK * 10
        }
        epso = fyd / Es
        sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))
      }
      epsc = getEpsC(ECU2, fyd, Es, d, GCF)
      sigsc = getSigSc(epsc, fyd, Es);
      Mc = getMc(ur, BFL, d, fcd)
      Nsc = (MELU * KUNIT - Mc) / (d - GCF)
      asc = Nsc / sigsc // 224
    }
  }
  else if (NELU == 0 && (CDF == EnumCDF.PRD)) {
    // flexion simple parabole rectangle

    u = (MELU) * KUNIT / (BFL * d * d * fcd)
    dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
    para = ECU2 / (dzeta * d)
    integrale = getIntegrale(EC2, para, d, dzeta, N)
    ur = integrale / (d ** 2)

    if (KCO == EnumKCO.H) {
      if (!(u < ur)) {
        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
        epsc = getEpsC(ECU2, fyd, Es, d, GCF)
        sigsc = getSigSc(epsc, fyd, Es);
        Mc = getMc(ur, BFL, d, fcd)
        Nsc = (MELU * KUNIT - Mc) / (d - GCF)
        asc = Nsc / sigsc // 285
      }
    }
    else { // KCO !== EnumKCO.H
      dzeta = ECU2 / (0.9 * EPSUK * 10) / (1 + ECU2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = getIntegrale(EC2, para, d, dzeta, N)
      upivota = getU(integrale, d)

      dzeta = EC2 / (0.9 * EPSUK * 10) / (1 + EC2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = getIntegrale(EC2, para, d, dzeta, N)
      upara = getU(integrale, d)

      if (!(u < upara || u < upivota || u < ur)) {
        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
        epsc = getEpsC(ECU2, fyd, Es, d, GCF)
        sigsc = getSigSc(epsc, fyd, Es);
        epsst = ECU2 * (1 - dzeta) / dzeta
        epso = fyd / Es
        sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))

        Mc = getMc(ur, BFL, d, fcd)
        Nsc = (MELU * KUNIT - Mc) / (d - GCF)
        asc = Nsc / sigsc // 368
      }
    }
  }
  else if (NELU < 0 && (MELU / NELU >= -(HFL / 2 - GCF) && MELU / NELU <= (HFL / 2 - GTF))) {
    // section entierement tendue
    if (KCO == EnumKCO.H)
      sigst = fyd
    else {
      epso = (fyd / Es) * 1000
      sigst = fyd * (1 + (K - 1) * (0.9 * EPSUK * 10 - epso) / (EPSUK * 10 - epso))
    }
    let e = d - (HFL / 2 - MELU / NELU)

    asc = NELU * KUNIT / sigst * e / (d - GCF) // 403
  }
  else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) || ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) && CDF == EnumCDF.PRD) {
    // section partiellement comprimées parabole rectangle
    u = (Mui) * KUNIT / (BFL * d * d * fcd)
    dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
    para = ECU2 / (dzeta * d)
    integrale = getIntegrale(EC2, para, d, dzeta, N)
    ur = integrale / (d ** 2)

    if (KCO == EnumKCO.H) {
      if (!(u < ur)) {
        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
        epsc = getEpsC(ECU2, fyd, Es, d, GCF)
        sigsc = getSigSc(epsc, fyd, Es);
        Mc = getMc(ur, BFL, d, fcd)
        Nc = BFL * fcd * (getIntegrale2(EC2, para, d, dzeta, N))
        Nsc = (Mui * KUNIT - Mc) / (d - GCF)
        Nst = Nc + Nsc - NELU * KUNIT
        asc = Nsc / sigsc // 458
        Ast = Nst / fyd
        if (Ast < 0) {
          Ast = 0
          dzeta = 0

          do {
            dzeta = dzeta + 0.00001
            para = ECU2 / (dzeta * d)
            integrale = getIntegrale(EC2, para, d, dzeta, N)
            integrale2 = getIntegrale2(EC2, para, d, dzeta, N)
          } while (Mui * KUNIT > integrale * BFL * fcd + (d - GTF) * (NELU * KUNIT - integrale2 * BFL * fcd))

          epsc = getEpsCbis(ECU2, dzeta, d, GCF)
          sigsc = getSigSc(epsc, fyd, Es)
          Nc = integrale2 * BFL * fcd

          asc = (NELU * KUNIT - Nc) / sigsc // 478
          if (asc < 0) {
            asc = 0 // 480
          }
        }
      }
    }
    else { // _KCO !== "H"
      dzeta = ECU2 / (0.9 * EPSUK * 10) / (1 + ECU2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = getIntegrale(EC2, para, d, dzeta, N)
      upivota = getU(integrale, d)

      dzeta = EC2 / (0.9 * EPSUK * 10) / (1 + EC2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = getIntegrale(EC2, para, d, dzeta, N)
      upara = getU(integrale, d)

      if (!(u < upara || u < upivota || u < ur)) {
        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
        epsc = getEpsC(ECU2, fyd, Es, d, GCF)
        sigsc = getSigSc(epsc, fyd, Es)
        epsst = ECU2 * (1 - dzeta) / dzeta
        epso = fyd / Es
        sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))
        Mc = getMc(ur, BFL, d, fcd)
        Nc = BFL * fcd * (getIntegrale2(EC2, para, d, dzeta, N))
        Nsc = (Mui * KUNIT - Mc) / (d - GCF)
        Nst = Nc + Nsc - NELU * KUNIT

        asc = Nsc / sigsc // 568
        Ast = Nst / sigst

        if (Ast < 0) {
          Ast = 0
          dzeta = 0

          do {
            dzeta = dzeta + 0.00001
            para = ECU2 / (dzeta * d)
            integrale = getIntegrale(EC2, para, d, dzeta, N)
            integrale2 = getIntegrale2(EC2, para, d, dzeta, N)
          } while (Mui * KUNIT > integrale * BFL * fcd + (d - GTF) * (NELU * KUNIT - integrale2 * BFL * fcd))

          epsc = getEpsCbis(ECU2, dzeta, d, GCF)
          sigsc = getSigSc(epsc, fyd, Es)
          Nc = integrale2 * BFL * fcd
          asc = (NELU * KUNIT - Nc) / sigsc // 589
          if (asc < 0) {
            asc = 0 // 591
          }
        }
      }
    }
  }
  else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) || ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) && CDF == EnumCDF.RSD) {
    // section partiellement comprimées rectangulaire simplifié
    u = (Mui) * KUNIT / (BFL * d * d * fcd)
    ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))

    if (!(u < ur)) {
      u = ur
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
      epsst = ECU2 * (1 - dzeta) / (dzeta + 10 ** -19)

      if (KCO == EnumKCO.H) {
        sigst = Math.min(epsst * Es / 1000, fyd)
      }
      else {
        if (epsst > 0.9 * EPSUK * 10) {
          epsst = 0.9 * EPSUK * 10
        }
        epso = fyd / Es
        sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))
      }
      epsc = getEpsC(ECU2, fyd, Es, d, GCF)
      sigsc = getSigSc(epsc, fyd, Es);
      Mc = getMc(ur, BFL, d, fcd)
      Nc = lambda * dzeta * BFL * d * fcd
      Nsc = (Mui * KUNIT - Mc) / (d - GCF)
      Nst = Nc + Nsc - NELU * KUNIT

      asc = Nsc / sigsc // 684
      Ast = Nst / sigst

      if (Ast < 0) {
        Ast = 0
        dzeta = (GCF + Math.sqrt(GCF ** 2 + 2 * ((d - GCF) * NELU * KUNIT - Mui * KUNIT) / (BFL * fcd))) / (lambda * d)
        epsc = getEpsCbis(ECU2, dzeta, d, GCF)
        sigsc = getSigSc(epsc, fyd, Es);
        Nc = lambda * dzeta * BFL * d * fcd

        asc = (NELU * KUNIT - Nc) / sigsc // 696
        if (asc < 0) {
          asc = 0 // 698
        }
      }
    }
  }
  else if ((d - GCF) * NELU * KUNIT - Mui * KUNIT > (0.337 - 0.81 * GCF / HFL) * BFL * HFL ** 2 * fcd) {
    // section entierement comprimée

    let xi = (0.5 - GCF / HFL - ((d - GCF) * NELU * KUNIT - Mui * KUNIT) / (BFL * HFL ** 2 * fcd)) / (6 / 7 - GCF / HFL)
    if (xi >= 0) {
      epsst = EC2 * (1 + (3 - 7 * GTF / HFL) / 1.75 * xi ** (1 / 2))

      if (KCO == EnumKCO.H) {
        sigst = Math.min(epsst * Es / 1000, fyd)
      }
      else {
        if (epsst > 0.9 * EPSUK * 10) {
          epsst = 0.9 * EPSUK * 10
        }
        epso = fyd / Es
        sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))
      }
      //Ast = 0
      asc = 1 / sigst * (NELU * KUNIT - (1 - xi) * BFL * HFL * fcd) // 747
      if (asc < 0) {
        asc = 0 // 750
      }
    }
    else { // xi < 0
      if (EC2 / 1000 < fyd / Es) {
        sigst = Es * EC2 / 1000
      }
      else {
        epsst = EC2

        if (KCO == EnumKCO.H) {
          sigst = Math.min(epsst * Es / 1000, fyd)
        }
        else {
          if (epsst > 0.9 * EPSUK * 10) {
            epsst = 0.9 * EPSUK * 10
          }
          epso = fyd / Es
          sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))
        }
      }
      asc = (Mui * KUNIT - (d - HFL / 2) * BFL * HFL * fcd) / ((d - GCF) * sigst) // 781
      if (asc < 0) {
        asc = 0 // 777
      }
    }
  }

  return asc;
}

/**
 * Flexion tab
 * @param integrale
 * @param d
 * @returns
 */
function getU(integrale: number, d: number): any {
  return integrale / (d ** 2);
}

/**
 * Flexion tab
 * @param ECU2
 * @param dzeta
 * @param d
 * @param GCF
 * @returns
 */
function getEpsCbis(
  ECU2: number,
  dzeta: number,
  d: number,
  GCF: number): number {
  return ECU2 / 1000 * (dzeta * d - GCF) / (dzeta * d + 10 ** -19);
}

/**
 * Flexion tab
 * @param ECU2
 * @param fyd
 * @param Es
 * @param d
 * @param GCF
 * @returns
 */
export function getEpsC(
  ECU2: number,
  fyd: number,
  Es: number,
  d: number,
  GCF: number): number {
  return (ECU2 / 1000 + fyd / Es) * (d - GCF) / d - fyd / Es;
}

/**
 * Flexion tab
 * @param epsc
 * @param fyd
 * @param Es
 * @returns
 */
function getSigSc(epsc: number, fyd: number, Es: number): number {
  return (epsc < fyd / Es) ? Es * epsc : fyd;
}

/**
 * Flexion tab
 * @param u
 * @param b
 * @param d
 * @param fcd
 * @returns
 */
function getMc(u: number, b: number, d: number, fcd: number): number {
  return u * b * d * d * fcd;
}
