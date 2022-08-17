import { EnumCDF, EnumKCO, EnumSTA } from "../common/enums";
import { getIntegrale2, simpson2 } from "../common/functions";

/**
 * δ coef
 * Excel: Flexion.C50
 * Value ex: 0.47
 * @param FCK
 * @returns
 */
export default async function DFL(
  STA: EnumSTA,
  CDF: EnumCDF,
  KCO: EnumKCO,
  FCK: number,
  MELU: number,
  NELU: number,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  ECU2: number,
  KUNIT: number,
  EC2: number,
  N: number,
  ACC: number,
  GACF: number,
  FYK: number,
  GSF: number,
  EPSUK: number,
  K: number,
): Promise<number> {

  let delta = getDelta(STA, CDF, KCO, FCK, MELU, NELU, BFL, HFL, GCF, GTF, ECU2, KUNIT, EC2, N, ACC, GACF, FYK, GSF, EPSUK, K);
  return delta;
}


function getDelta(
  STA: EnumSTA,
  CDF: EnumCDF,
  KCO: EnumKCO,
  FCK: number,
  MELU: number,
  NELU: number,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  ECU2: number,
  KUNIT: number,
  EC2: number,
  N: number,
  ACC: number,
  GACF: number,
  FYK: number,
  GSF: number,
  EPSUK: number,
  K: number,
): number {

  let delta = NaN;

  let Es = 200000000000;

  let
    Mo: number,
    nu: number,
    xu: number = NaN,
    u: number,
    ur: number,
    upivota: number,
    upara: number,
    lambda: number,
    dzeta: number,
    para: number,
    integrale: number,
    integrale2: number,
    epsc: number,
    Mc: number,
    Nc: number,
    Nsc: number,
    Nst: number,
    Ast: number,
    Asc: number,
    epsst: number,
    epso: number,
    sigst: number,
    xi: number;

  let
    k1: number,
    k2: number,
    k3: number,
    k4: number;

  if (FCK <= 50) {
    lambda = 0.8
    nu = 1
  } else {
    lambda = 0.8 - (FCK - 50) / 400
    nu = 1 - (FCK - 50) / 200
  }

  let fcd = nu * ACC * FCK * 1000000 / GACF
  let fyd = FYK * 1000000 / GSF
  let Mui = (MELU + NELU * (HFL / 2 - GTF))

  let d = HFL - GTF


  if (NELU == 0 && (CDF == EnumCDF.RSD)) {
    // flexion simple rectangulaire simplifié

    u = (MELU) * KUNIT / (BFL * d * d * fcd)

    ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))


    if (u < ur) {
      // z = 0.5 * d * (1 + Math.sqrt(1 - 2 * u))
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
      // epsst = _ECU2 * (1 - dzeta) / dzeta

      // if (_KCO == EnumKCO.H) {
      //   sigst = Math.min(epsst * Es / 1000, fyd)
      // } else {

      //   if (epsst > 0.9 * _EPSUK * 10) {
      //     epsst = 0.9 * _EPSUK * 10
      //   }

      //   epso = (fyd / Es) * 1000
      //   sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))
      // }


      // Ast = _MELU * KUNIT / (z * sigst)
      // if (Ast < 0) {
      //   Ast = 0
      // }

    } else {
      u = ur
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
      // epsst = _ECU2 * (1 - dzeta) / dzeta

      // if (_KCO == EnumKCO.H) {
      //   sigst = Math.min(epsst * Es / 1000, fyd)
      // } else {

      //   if (epsst > 0.9 * _EPSUK * 10) {
      //     epsst = 0.9 * _EPSUK * 10

      //   }
      //   epso = fyd / Es
      //   sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

      // }

      // epsc = (_ECU2 / 1000 + fyd / Es) * (d - _GCF) / d - fyd / Es
      // if (epsc < fyd / Es) {
      //   sigsc = Es * epsc
      // } else {
      //   sigsc = fyd
      // }

      // Mc = u * _BFL * d * d * fcd
      // Nc = lambda * dzeta * _BFL * d * fcd
      // Nsc = (_MELU * KUNIT - Mc) / (d - _GCF)
      // Nst = Nc + Nsc
      // Asc = Nsc / sigsc
      // Ast = Nst / sigst
      // if (Ast < 0) {
      //   Ast = 0
      // }

    }
    // Asmin = Math.max(0.26 * _FCTM / _FYK * _BFL * d, 0.0013 * _BFL * d)
    xu = dzeta * d


    // if (_HFL < 0.3) {
    //   kas = 1
    // } else if (_HFL > 0.8) {
    //   kas = 0.65
    // } else {
    //   kas = (0.8 - _HFL) * 0.35 / 0.5 + 0.65
    // }
    // kc = 0.4
    // act = _BFL * _HFL / 2

    // Asmin2 = kc * kas * _FCTM * act / _FYK
    // Asmin = Math.max(Asmin, Asmin2)
    // Ascmin = 0

  } else if (NELU == 0 && (CDF == EnumCDF.PRD)) {
    // flexion simple parabole rectangle

    u = (MELU) * KUNIT / (BFL * d * d * fcd)

    dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
    para = ECU2 / (dzeta * d)
    integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
    ur = integrale / (d ** 2)

    if (KCO == EnumKCO.H) {
      if (u < ur) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = ECU2 / (dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        } while (!(MELU * KUNIT < integrale * BFL * fcd))

        // Ast = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para)) / fyd

      } else {

        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)

        // epsc = (_ECU2 / 1000 + fyd / Es) * (d - _GCF) / d - fyd / Es
        // if (epsc < fyd / Es) {
        //   sigsc = Es * epsc
        // } else {
        //   sigsc = fyd
        // }

        // Mc = ur * _BFL * d * d * fcd
        // Nc = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para))
        // Nsc = (_MELU * KUNIT - Mc) / (d - _GCF)
        // Nst = Nc + Nsc
        // Asc = Nsc / sigsc
        // Ast = Nst / fyd
        // if (Ast < 0) {
        //   Ast = 0
        // }
      }

    } else {
      dzeta = ECU2 / (0.9 * EPSUK * 10) / (1 + ECU2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
      upivota = integrale / (d ** 2)

      dzeta = EC2 / (0.9 * EPSUK * 10) / (1 + EC2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
      upara = integrale / (d ** 2)

      if (u < upara) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(dzeta * d, EC2, para, d, dzeta, N))
        } while (!(MELU * KUNIT < integrale * BFL * fcd))

        // epsst = 0.9 * _EPSUK * 10
        // epso = fyd / Es
        // sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

        // Ast = _BFL * fcd * (simpson2(dzeta * d, _EC2, para, d, dzeta, _N)) / sigst

      } else if (u < upivota) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        } while (!(MELU * KUNIT < integrale * BFL * fcd))


        // epsst = 0.9 * _EPSUK * 10
        // epso = fyd / Es
        // sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

        // Ast = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para)) / sigst

      } else if (u < ur) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = ECU2 / (dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        } while (!(MELU * KUNIT < integrale * BFL * fcd))


        // epsst = _ECU2 * (1 - dzeta) / dzeta
        // epso = fyd / Es
        // sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

        // Ast = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para)) / sigst

      } else {

        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)

        // epsc = (_ECU2 / 1000 + fyd / Es) * (d - _GCF) / d - fyd / Es
        // if (epsc < fyd / Es) {
        //   sigsc = Es * epsc
        // } else {
        //   sigsc = fyd
        // }

        // epsst = _ECU2 * (1 - dzeta) / dzeta
        // epso = fyd / Es
        // sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

        // Mc = ur * _BFL * d * d * fcd
        // Nc = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para))
        // Nsc = (_MELU * KUNIT - Mc) / (d - _GCF)
        // Nst = Nc + Nsc
        // Asc = Nsc / sigsc
        // Ast = Nst / sigst

        // if (Ast < 0) {
        //   Ast = 0
        // }
      }

    }
    // Asmin = Math.max(0.26 * _FCTM / _FYK * _BFL * d, 0.0013 * _BFL * d)
    xu = dzeta * d

    // if (_HFL < 0.3) {
    //   kas = 1
    // } else if (_HFL > 0.8) {
    //   kas = 0.65
    // } else {
    //   kas = (0.8 - _HFL) * 0.35 / 0.5 + 0.65
    // }
    // kc = 0.4
    // act = _BFL * _HFL / 2

    // Asmin2 = kc * kas * _FCTM * act / _FYK
    // Asmin = Math.max(Asmin, Asmin2)
    // Ascmin = 0


  } else if (NELU < 0 && (MELU / NELU >= -(HFL / 2 - GCF) && MELU / NELU <= (HFL / 2 - GTF))) {
    // section entierement tendue

    // if (_KCO == EnumKCO.H) {
    //   sigst = fyd
    // } else {
    //   epso = (fyd / Es) * 1000
    //   sigst = fyd * (1 + (_K - 1) * (0.9 * _EPSUK * 10 - epso) / (_EPSUK * 10 - epso))
    // }

    // e = d - (_HFL / 2 - _MELU / _NELU)
    // Ast = -_NELU * KUNIT / sigst * (1 - e / (d - _GCF))
    // Asc = _NELU * KUNIT / sigst * e / (d - _GCF)

    xu = 0

    // if (_HFL < 0.3) {
    //   kas = 1
    // } else if (_HFL > 0.8) {
    //   kas = 0.65
    // } else {
    //   kas = (0.8 - _HFL) * 0.35 / 0.5 + 0.65
    // }
    // kc = 1
    // act = _BFL * _HFL

    // Asmin = kc * kas * _FCTM * act / _FYK / 2
    // Ascmin = -Asmin


  } else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) ||
    ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) &&
    CDF == EnumCDF.PRD) {
    //section partiellement comprimées parabole rectangle

    u = (Mui) * KUNIT / (BFL * d * d * fcd)

    dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
    para = ECU2 / (dzeta * d)
    integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
    ur = integrale / (d ** 2)

    if (KCO == EnumKCO.H) {

      if (u < ur) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = ECU2 / (dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        } while (!(Mui * KUNIT < integrale * BFL * fcd))

        // Ast = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para)) / fyd - _NELU * KUNIT / fyd
        // if (Ast < 0) {
        //   Ast = 0
        // }

      } else {

        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)

        epsc = (ECU2 / 1000 + fyd / Es) * (d - GCF) / d - fyd / Es
        // if (epsc < fyd / Es) {
        //   sigsc = Es * epsc
        // } else {
        //   sigsc = fyd
        // }

        Mc = ur * BFL * d * d * fcd
        Nc = BFL * fcd * (getIntegrale2(EC2, para, d, dzeta, N))
        Nsc = (Mui * KUNIT - Mc) / (d - GCF)
        Nst = Nc + Nsc - NELU * KUNIT
        //Asc = Nsc / sigsc
        Ast = Nst / fyd
        if (Ast < 0) {
          Ast = 0
          dzeta = 0
          do {
            dzeta = dzeta + 0.00001
            para = ECU2 / (dzeta * d)
            integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            integrale2 = (getIntegrale2(EC2, para, d, dzeta, N))

          } while (!(Mui * KUNIT > integrale * BFL * fcd + (d - GTF) * (NELU * KUNIT - integrale2 * BFL * fcd)))

          // epsc = _ECU2 / 1000 * (dzeta * d - _GCF) / (dzeta * d + 10 ** -19)
          // if (epsc < fyd / Es) {
          //   sigsc = Es * epsc
          // } else {
          //   sigsc = fyd
          // }
          // Nc = integrale2 * _BFL * fcd
          // Asc = (_NELU * KUNIT - Nc) / sigsc
          // if (Asc < 0) {
          //   Asc = 0
          // }
        }
      }

    } else {
      dzeta = ECU2 / (0.9 * EPSUK * 10) / (1 + ECU2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
      upivota = integrale / (d ** 2)

      dzeta = EC2 / (0.9 * EPSUK * 10) / (1 + EC2 / (0.9 * EPSUK * 10))
      para = (0.9 * EPSUK * 10) / (d - dzeta * d)
      integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
      upara = integrale / (d ** 2)

      if (u < upara) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(dzeta * d, EC2, para, d, dzeta, N))
        } while (!(Mui * KUNIT < integrale * BFL * fcd))

        // epsst = 0.9 * _EPSUK * 10
        // epso = fyd / Es
        // sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

        // Ast = _BFL * fcd * (simpson2(dzeta * d, _EC2, para, d, dzeta, _N)) / sigst - _NELU * KUNIT / sigst
        // if (Ast < 0) {
        //   Ast = 0
        // }
      } else if (u < upivota) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        } while (!(Mui * KUNIT < integrale * BFL * fcd))


        // epsst = 0.9 * _EPSUK * 10
        // epso = fyd / Es
        // sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

        // Ast = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para)) / sigst - _NELU * KUNIT / sigst
        // if (Ast < 0) {
        //   Ast = 0
        // }


      } else if (u < ur) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = ECU2 / (dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        } while (!(Mui * KUNIT < integrale * BFL * fcd))


        // epsst = _ECU2 * (1 - dzeta) / dzeta
        // epso = fyd / Es
        // sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))

        // Ast = _BFL * fcd * (simpson2(_EC2 / para, _EC2, para, d, dzeta, _N) + (dzeta * d - _EC2 / para)) / sigst - _NELU * KUNIT / sigst
        // if (Ast < 0) {
        //   Ast = 0
        // }

      } else {

        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)

        epsc = (ECU2 / 1000 + fyd / Es) * (d - GCF) / d - fyd / Es
        // if (epsc < fyd / Es) {
        //   sigsc = Es * epsc
        // } else {
        //   sigsc = fyd
        // }

        epsst = ECU2 * (1 - dzeta) / dzeta
        epso = fyd / Es
        sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))

        Mc = ur * BFL * d * d * fcd
        Nc = BFL * fcd * (getIntegrale2(EC2, para, d, dzeta, N))
        Nsc = (Mui * KUNIT - Mc) / (d - GCF)
        Nst = Nc + Nsc - NELU * KUNIT
        //Asc = Nsc / sigsc
        Ast = Nst / sigst

        if (Ast < 0) {
          Ast = 0
          dzeta = 0
          do {
            dzeta = dzeta + 0.00001
            para = ECU2 / (dzeta * d)
            integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            integrale2 = (getIntegrale2(EC2, para, d, dzeta, N))

          } while (!(Mui * KUNIT > integrale * BFL * fcd + (d - GTF) * (NELU * KUNIT - integrale2 * BFL * fcd)))

          // epsc = _ECU2 / 1000 * (dzeta * d - _GCF) / (dzeta * d + 10 ** -19)
          // if (epsc < fyd / Es) {
          //   sigsc = Es * epsc
          // } else {
          //   sigsc = fyd
          // }
          // Nc = integrale2 * _BFL * fcd
          // Asc = (_NELU * KUNIT - Nc) / sigsc
          // if (Asc < 0) {
          //   Asc = 0
          // }
        }
      }

    }
    // Asmin = Math.max(0.26 * _FCTM / _FYK * _BFL * d, 0.0013 * _BFL * d)
    xu = dzeta * d

    // if (_HFL < 0.3) {
    //   kas = 1
    // } else if (_HFL > 0.8) {
    //   kas = 0.65
    // } else {
    //   kas = (0.8 - _HFL) * 0.35 / 0.5 + 0.65
    // }
    // hetoile = Math.min(_HFL, 1)
    // if (_NELSC > 0) {
    //   k1 = 1.5
    // } else {
    //   k1 = 2 / 3 * (hetoile / _HFL)
    // }

    // kc = Math.min(1, 0.4 * (1 - _NELSC * KUNIT / (k1 * (_HFL / hetoile) * _FCTM * 1000000 * _BFL * _HFL)))


    // act = Math.max((_HFL / 2 - _NELU / _MELU * _HFL * _HFL / 6) * _BFL, 0)

    // Asmin2 = kc * kas * _FCTM * act / _FYK
    // Asmin = Math.max(Asmin, Asmin2)
    // Ascmin = 0


  } else if ((((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) ||
    ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) &&
    CDF == EnumCDF.RSD) {
    // section partiellement comprimées rectangulaire simplifié

    u = (Mui) * KUNIT / (BFL * d * d * fcd)
    ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))

    if (u < ur) {
      //let nbr1: number, nbr2: number

      // z = 0.5 * d * (1 + Math.sqrt(1 - 2 * u))
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
      // epsst = _ECU2 * (1 - dzeta) / (dzeta + 10 ** -19)

      // if (_KCO == EnumKCO.H) {
      //   sigst = Math.min(epsst * Es / 1000, fyd)
      // } else {

      //   if (epsst > 0.9 * _EPSUK * 10) {
      //     epsst = 0.9 * _EPSUK * 10
      //   }

      //   epso = (fyd / Es) * 1000
      //   sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))
      // }

      // nbr1 = _NELU * KUNIT / sigst
      // nbr2 = Mui * KUNIT / (z * sigst)
      // Ast = nbr2 - nbr1
      // if (Ast < 0) {
      //   Ast = 0
      // }

    } else {
      u = ur
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
      // epsst = _ECU2 * (1 - dzeta) / (dzeta + 10 ** -19)

      // if (_KCO == EnumKCO.H) {
      //   sigst = Math.min(epsst * Es / 1000, fyd)
      // } else {

      //   if (epsst > 0.9 * _EPSUK * 10) {
      //     epsst = 0.9 * _EPSUK * 10
      //   }
      //   epso = fyd / Es
      //   sigst = fyd * (1 + (_K - 1) * (epsst - epso) / (_EPSUK * 10 - epso))
      // }
    }

    xu = dzeta * d
  } else if ((d - GCF) * NELU * KUNIT - Mui * KUNIT > (0.337 - 0.81 * GCF / HFL) * BFL * HFL ** 2 * fcd) {
    // section entierement comprimée

    xi = (0.5 - GCF / HFL - ((d - GCF) * NELU * KUNIT - Mui * KUNIT) / (BFL * HFL ** 2 * fcd)) / (6 / 7 - GCF / HFL)
    if (xi >= 0) {
      xu = (Math.sqrt(3.05 / xi) + 3) * HFL / 7
    } else {
      xu = HFL + 1000
    }
  }

  // Moment de redistribution
  let Mr = MELU

  if (STA === EnumSTA.BS_EN_1992_1_1_NA) {
    k1 = 0.4
    k3 = 0.4
    k2 = 0.6 + 0.0014 / ECU2
    k4 = 0.6 + 0.0014 / ECU2
    //k5 = 0.7
    //k6 = 0.8
  } else {
    k1 = 0.44
    k3 = 0.54
    k2 = 1.25 * (0.6 + 0.0014 / ECU2)
    k4 = 1.25 * (0.6 + 0.0014 / ECU2)
    //k5 = 0.7
    //k6 = 0.8
  }

  if (Mr > 0) {
    do {
      Mo = Mr + NELU * (HFL / 2 - GTF)
      // calcul ELU

      if (NELU == 0 && Mr == 0) {
        // throw "Certaines valeurs nulles rendent le calcul impossible"


      } else if (NELU == 0 && (CDF == EnumCDF.RSD)) {
        // flexion simple rectangulaire simplifié

        u = (Mr) * KUNIT / (BFL * d * d * fcd)

        ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))

        if (u < ur) {
          //z = 0.5 * d * (1 + Math.sqrt(1 - 2 * u))
          dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
        } else {
          u = ur
          dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
        }

        xu = dzeta * d

      } else if (NELU == 0 && (CDF == EnumCDF.PRD)) {
        // flexion simple parabole rectangle
        u = (Mr) * KUNIT / (BFL * d * d * fcd)

        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
        para = ECU2 / (dzeta * d)
        integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        ur = integrale / (d ** 2)

        if (KCO == EnumKCO.H) {

          if (u < ur) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = ECU2 / (dzeta * d)
              integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            } while (!(Mr * KUNIT < integrale * BFL * fcd))

          } else {
            dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
          }

        } else {
          dzeta = ECU2 / (0.9 * EPSUK * 10) / (1 + ECU2 / (0.9 * EPSUK * 10))
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
          upivota = integrale / (d ** 2)

          dzeta = EC2 / (0.9 * EPSUK * 10) / (1 + EC2 / (0.9 * EPSUK * 10))
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
          upara = integrale / (d ** 2)

          if (u < upara) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = (0.9 * EPSUK * 10) / (d - dzeta * d)
              integrale = (simpson1(dzeta * d, EC2, para, d, dzeta, N))
            } while (!(Mr * KUNIT < integrale * BFL * fcd))


          } else if (u < upivota) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = (0.9 * EPSUK * 10) / (d - dzeta * d)
              integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            } while (!(Mr * KUNIT < integrale * BFL * fcd))


          } else if (u < ur) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = ECU2 / (dzeta * d)
              integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            } while (!(Mr * KUNIT < integrale * BFL * fcd))

          } else {

            dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
          }

        }

        xu = dzeta * d

      } else if ((
        ((d - GCF) * NELU * KUNIT - Mo * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) ||
        ((d - GCF) * NELU * KUNIT - Mo * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) &&
        CDF == EnumCDF.PRD) {
        // section partiellement comprimées parabole rectangle

        u = (Mo) * KUNIT / (BFL * d * d * fcd)

        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
        para = ECU2 / (dzeta * d)
        integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        ur = integrale / (d ** 2)

        if (KCO == EnumKCO.H) {

          if (u < ur) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = ECU2 / (dzeta * d)
              integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            } while (!(Mo * KUNIT < integrale * BFL * fcd))

          } else {
            dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
          }

        } else {
          dzeta = ECU2 / (0.9 * EPSUK * 10) / (1 + ECU2 / (0.9 * EPSUK * 10))
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
          upivota = integrale / (d ** 2)

          dzeta = EC2 / (0.9 * EPSUK * 10) / (1 + EC2 / (0.9 * EPSUK * 10))
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
          upara = integrale / (d ** 2)

          if (u < upara) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = (0.9 * EPSUK * 10) / (d - dzeta * d)
              integrale = (simpson1(dzeta * d, EC2, para, d, dzeta, N))
            } while (!(Mo * KUNIT < integrale * BFL * fcd))

          } else if (u < upivota) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = (0.9 * EPSUK * 10) / (d - dzeta * d)
              integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            } while (!(Mo * KUNIT < integrale * BFL * fcd))

          } else if (u < ur) {
            dzeta = 0
            do {
              dzeta = dzeta + 0.01
              para = ECU2 / (dzeta * d)
              integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            } while (!(Mo * KUNIT < integrale * BFL * fcd))

          } else {
            dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
          }

        }
        xu = dzeta * d

      } else if (NELU < 0 && (Mr / NELU >= -(HFL / 2 - GCF) && Mr / NELU <= (HFL / 2 - GTF))) {
        // section entierement tendue
        xu = 0

      } else if (((
        ((d - GCF) * NELU * KUNIT - Mo * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) ||
        ((d - GCF) * NELU * KUNIT - Mo * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd))) &&
        CDF == EnumCDF.RSD) {
        // section partiellement comprimées rectangulaire simplifié

        u = (Mo) * KUNIT / (BFL * d * d * 1)
        ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))

        if (u < ur) {
          // z = 0.5 * d * (1 + Math.sqrt(1 - 2 * u))
          dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
        } else {
          u = ur
          dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
        }

        xu = dzeta * d

      } else if ((d - GCF) * NELU * KUNIT - Mo * KUNIT > (0.337 - 0.81 * GCF / HFL) * BFL * HFL ** 2 * fcd) {
        // section entierement comprimée
        xu = 0
      }

      if (FCK <= 50) {
        delta = k1 + k2 * xu / d
      } else {
        delta = k3 + k4 * xu / d
      }

      if (Mr <= 0) {
        break;
      }

      Mr = Mr - MELU / 1000
    } while (!(Mr / MELU < delta))
  }

  return delta;
}

/**
 * Moment résistant béton par rapport à axe armatures tendu
 * Flexion/Bendling tab
 * @param z1
 * @param ec2
 * @param para
 * @param d
 * @param dzeta
 * @param n
 * @returns
 */
function simpson1(
  z1: number,
  ec2: number,
  para: number,
  d: number,
  dzeta: number,
  n: number): number {

  // 'j = 0
  // 'simpson1 = 0
  // 'For i = 0.001 To z1 Step 0.0001
  // '    simpson1 = simpson1 + (i - j) / 6 * ((1 - (1 - j * para / ec2) ^ n) * (j + d - dzeta * d) + 4 * (1 - (1 - (i + j) / 2 * para / ec2) ^ n) * ((i + j) / 2 + d - dzeta * d) + (1 - (1 - i * para / ec2) ^ n) * (i + d - dzeta * d))
  // '    j = i
  // 'Next i

  // Moment résistant béton par rapport à axe armatures tendu

  return (z1 + ec2 / (para * (n + 1)) * (Math.abs(1 - z1 * para / ec2)) ** (n + 1)) * (z1 + d - dzeta * d) -
    ec2 / (para * (n + 1)) * (d - dzeta * d) -
    z1 ** 2 / 2 -
    ec2 ** 2 / (para ** 2 * (n + 1) * (n + 2)) * (Math.abs(1 - z1 * para / ec2)) ** (n + 2) -
    ec2 ** 2 / (para ** 2 * (n + 1) * (n + 2));
}