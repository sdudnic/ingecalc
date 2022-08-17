import { EnumCDF, EnumKCO } from '../common/enums';
import { getIntegrale2, simpson1, simpson2 } from '../common/functions';

/**
 * x_ELU (m)
 * Excel: Flexion.M21
 * Value ex: 0.032
 * @param BFL
 * @param HFL
 * @param GCF
 * @param GTF
 * @param MELU
 * @param NELU
 * @param CDF
 * @param KUNIT
 * @param ECU2
 * @param FYK
 * @param FCK
 * @param GACF
 * @param GSF
 * @param ACC
 * @returns x_ELU (m): ex: 0.032
 */
export default async function XELU(
  KCO: EnumKCO,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  MELU: number,
  NELU: number,
  CDF: EnumCDF,
  KUNIT: number,
  ECU2: number,
  FYK: number,
  FCK: number,
  GACF: number,
  GSF: number,
  ACC: number,
  EC2: number,
  N: number,
  K: number,
  EPSUK: number,

): Promise<number> {

  let xu: number

  let
    dzeta: number,
    u: number,
    ur: number,
    para: number,
    integrale: number,
    integrale2: number,
    upivota: number,
    upara: number,
    Ast: number

  let lambda = NaN
  let nu = 1
  if (FCK <= 50) {
    lambda = 0.8
    nu = 1
  }
  else if (CDF == EnumCDF.RSD) {
    lambda = 0.8 - (FCK - 50) / 400
    nu = 1 - (FCK - 50) / 200
  }

  let Es = 200000000000
  let d = HFL - GTF
  let fcd = nu * ACC * FCK * 1000000 / GACF
  let fyd = FYK * 1000000 / GSF
  let Mui = (MELU + NELU * (HFL / 2 - GTF))


  if (NELU == 0 && CDF == EnumCDF.RSD) {
    // flexion simple rectangulaire simplifié
    u = (MELU) * KUNIT / (BFL * d * d * fcd)
    ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))
    if (!(u < ur)) {
      u = ur
    }

    dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
    xu = dzeta * d
  }
  else if (NELU == 0 && CDF == EnumCDF.PRD) {
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
      } else {
        //dzeta = ECU2 / (ECU2 + 1000 * fyd / Es) - meme chose que déjà calculé
      }
    }
    else {
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
      }
      else if (u < upivota) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        }
        while (!(MELU * KUNIT < integrale * BFL * fcd))
      }
      else if (u < ur) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = ECU2 / (dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        }
        while (!(MELU * KUNIT < integrale * BFL * fcd))
      }
      else {
        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)
      }
    }
    xu = dzeta * d
  }
  else if (NELU < 0 && (MELU / NELU >= -(HFL / 2 - GCF) && MELU / NELU <= (HFL / 2 - GTF))) {
    // section entierement tendue
    xu = 0
  }
  else if ((
    ((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) ||
    ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) &&
    CDF == EnumCDF.PRD) {
    // section partiellement comprimées parabole rectangle

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
      } else {
        //dzeta = ECU2 / (ECU2 + 1000 * fyd / Es) same thing like above
        let Mc = ur * BFL * d * d * fcd
        let Nc = BFL * fcd * (getIntegrale2(EC2, para, d, dzeta, N))
        let Nsc = (Mui * KUNIT - Mc) / (d - GCF)
        let Nst = Nc + Nsc - NELU * KUNIT
        Ast = Nst / fyd
        if (Ast < 0) {
          Ast = 0
          dzeta = 0
          do {
            dzeta = dzeta + 0.00001
            para = ECU2 / (dzeta * d)
            integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            integrale2 = (getIntegrale2(EC2, para, d, dzeta, N))
          }
          while (!(Mui * KUNIT > integrale * BFL * fcd + (d - GTF) * (NELU * KUNIT - integrale2 * BFL * fcd)))
        }
      }
    }
    else {
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
        }
        while (!(Mui * KUNIT < integrale * BFL * fcd))

      }
      else if (u < upivota) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = (0.9 * EPSUK * 10) / (d - dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        }
        while (!(Mui * KUNIT < integrale * BFL * fcd))
      }
      else if (u < ur) {
        dzeta = 0
        do {
          dzeta = dzeta + 0.00001
          para = ECU2 / (dzeta * d)
          integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
        }
        while (!(Mui * KUNIT < integrale * BFL * fcd))
      }

      else {
        dzeta = ECU2 / (ECU2 + 1000 * fyd / Es)

        let epsst = ECU2 * (1 - dzeta) / dzeta
        let epso = fyd / Es
        let sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))

        let Mc = ur * BFL * d * d * fcd
        let Nc = BFL * fcd * (getIntegrale2(EC2, para, d, dzeta, N))
        let Nsc = (Mui * KUNIT - Mc) / (d - GCF)
        let Nst = Nc + Nsc - NELU * KUNIT

        Ast = Nst / sigst

        if (Ast < 0) {
          Ast = 0
          dzeta = 0
          do {
            dzeta = dzeta + 0.00001
            para = ECU2 / (dzeta * d)
            integrale = (simpson1(EC2 / para, EC2, para, d, dzeta, N) + (dzeta * d - EC2 / para) * (d - (dzeta * d - EC2 / para) / 2))
            integrale2 = (getIntegrale2(EC2, para, d, dzeta, N))
          }
          while (!(Mui * KUNIT > integrale * BFL * fcd + (d - GTF) * (NELU * KUNIT - integrale2 * BFL * fcd)))
        }
      }
    }

    xu = dzeta * d
  }
  else if ((
    ((d - GCF) * NELU * KUNIT - Mui * KUNIT < (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fcd) ||
    ((d - GCF) * NELU * KUNIT - Mui * KUNIT == (0.337 - 0.81 * GCF / HFL) * BFL * HFL * HFL * fyd)) &&
    CDF == EnumCDF.RSD) {
    // section partiellement comprimées rectangulaire simplifié

    u = (Mui) * KUNIT / (BFL * d * d * fcd)
    ur = lambda * (ECU2 / (ECU2 + 1000 * fyd / Es)) * (1 - (lambda / 2) * (ECU2 / (ECU2 + 1000 * fyd / Es)))
    if (u < ur) {
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))
    }
    else {
      u = ur
      dzeta = (1 / lambda) * (1 - Math.sqrt(1 - 2 * u))

      let epsst = ECU2 * (1 - dzeta) / (dzeta + 10 ** -19)
      let sigst: number

      if (KCO == EnumKCO.H)
        sigst = Math.min(epsst * Es / 1000, fyd)
      else {
        if (epsst > 0.9 * EPSUK * 10) {
          epsst = 0.9 * EPSUK * 10
        }
        let epso = fyd / Es
        sigst = fyd * (1 + (K - 1) * (epsst - epso) / (EPSUK * 10 - epso))
      }


      let Mc = u * BFL * d * d * fcd
      let Nc = lambda * dzeta * BFL * d * fcd

      let Nsc = (Mui * KUNIT - Mc) / (d - GCF)
      let Nst = Nc + Nsc - NELU * KUNIT
      Ast = Nst / sigst
      if (Ast < 0) {
        Ast = 0
        dzeta = (GCF + Math.sqrt(GCF ** 2 + 2 * ((d - GCF) * NELU * KUNIT - Mui * KUNIT) / (BFL * fcd))) / (lambda * d)
      }
    }

    xu = dzeta * d
  }
  else if ((d - GCF) * NELU * KUNIT - Mui * KUNIT > (0.337 - 0.81 * GCF / HFL) * BFL * HFL ** 2 * fcd) {
    // section entierement comprimée

    let xi = (0.5 - GCF / HFL - ((d - GCF) * NELU * KUNIT - Mui * KUNIT) / (BFL * HFL ** 2 * fcd)) / (6 / 7 - GCF / HFL)

    xu = (Math.sqrt(3.05 / xi) + 3) * HFL / 7
  }
  else {
    xu = HFL + 1000
  }

  return xu;

}
