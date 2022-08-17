import { EnumSTA, EnumUNIT } from '../common/enums';
import { checkInvalidElsFlexionValues, contraintesELS, ElsParams, getSmallKUnit } from '../common/functions';

/**
 * A_st	(cm²)
 * Excel: Flexion.B53
 * Value ex: 0.61
 * @param STA
 * @param UNIT
 * @param MELU
 * @param BFL
 * @param HFL
 * @param GCF
 * @param GTF
 * @param GSF
 * @param GACF
 * @param FYK
 * @param FCK
 * @param AEF
 * @param WMAX
 * @param MELSQ
 * @param NELSQ
 * @param AST1
 * @param ASTB
 * @param ASCB
 * @param ASC1
 * @param MELSC
 * @param NELSC
 * @param MELSF
 * @param NELSF
 * @returns
 */
export default async function ASTF(
  STA: EnumSTA,
  UNIT: EnumUNIT,
  BFL: number,
  HFL: number,
  GCF: number,
  GTF: number,
  GSF: number,
  GACF: number,
  FYK: number,
  FCK: number,
  AEF: number,
  WMAX: number,
  MELSQ: number,
  NELSQ: number,
  ASTB: number,
  MELSC: number,
  NELSC: number,
  MELSF: number,
  NELSF: number,

): Promise<number> {

  let astf = getAstf(STA, BFL, AEF, HFL, GCF, GTF, WMAX, FYK, UNIT, MELSQ, NELSQ, ASTB, MELSC, NELSC, MELSF, NELSF, GSF, GACF, FCK)
  astf = astf * 10000;
  return astf;
}

function getAstf(
  STA: EnumSTA,
  BFL: number,
  AEF: number,
  HFL: number,
  GCF: number,
  GTF: number,
  WMAX: number,
  FYK: number,
  UNIT: EnumUNIT,
  MELSQ: number,
  NELSQ: number,
  ASTB: number,
  MELSC: number,
  NELSC: number,
  MELSF: number,
  NELSF: number,
  GSF: number,
  GACF: number,
  FCK: number,
): number {

  let Ast_f = NaN
  let kunit = getSmallKUnit(UNIT);
  let Msquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? MELSF : MELSQ) / kunit
  let Mscara = MELSC / kunit

  checkInvalidElsFlexionValues(Mscara, Msquasi, ASTB, GTF, HFL, GCF, MELSC, NELSC, MELSQ, NELSQ, MELSF, NELSF, STA, BFL, GSF, GACF);

  let Asc_f = NaN

  let sigslim: number
  let Nsquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? NELSF : NELSQ) / kunit
  let Nscara = NELSC / kunit
  let d = HFL - GTF
  let els: ElsParams;

  // Limitation rapport M/N pour éviter erreur arrondi
  if ((Nsquasi !== 0) && (Math.abs(Msquasi / Nsquasi) > 100)) {
    Nsquasi = 0
  }
  if ((Nscara !== 0) && (Math.abs(Mscara / Nscara) > 100)) {
    Nscara = 0
  }

  switch (STA) {
    case EnumSTA.NF_EN_1992_2_NA:
      {
        if (Nsquasi == 0) {
          // flexion simple

          Asc_f = 0.0000001
          sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
          Ast_f = 0.0000001 // OK

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

          if (Math.abs(els.sigs) < sigslim) {
            // nothing for Ast_f
          } else {
            do {
              Ast_f *= 1.0005 // OK
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
            } while (!(Math.abs(els.sigs) < sigslim))
          }
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)

          if (!(els.sigc < 0.6 * FCK)) {
            do {
              Asc_f *= 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc < 0.6 * FCK))

            els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

            if (!(Math.abs(els.sigs) < sigslim)) {
              do {
                Ast_f *= 1.0005
                els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
              } while (!(Math.abs(els.sigs) < sigslim))
            }
          }

        }
        else if (Nsquasi < 0 && (Msquasi / Nsquasi >= -(HFL / 2 - GCF) && Msquasi / Nsquasi <= (HFL / 2 - GTF))) {
          // entiérement tendu
          sigslim = Math.min(600 * WMAX, 0.8 * FYK)
          Ast_f = -Nsquasi * (HFL / 2 - GCF - Msquasi / Nsquasi) / (HFL - GTF - GCF) / (0.9999 * sigslim) // OK
          Asc_f = -Nsquasi * (HFL / 2 - GTF + Msquasi / Nsquasi) / (HFL - GTF - GCF) / (0.9999 * sigslim)

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

          if (!(Math.abs(els.sigs) < sigslim)) {
            do {
              Ast_f *= 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
            } while (!(Math.abs(els.sigs) < sigslim))
          }

        }
        else if (Nsquasi > 0 && Msquasi / Nsquasi <= HFL / 6 && Msquasi / Nsquasi >= -HFL / 6) {
          // entiérement comprimée
          Asc_f = 0.0000001
          Ast_f = 0.0000001

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
          if (!(Math.abs(els.sigc) < 0.6 * FCK)) {
            do {
              Asc_f = Asc_f * 1.0005
              Ast_f = Asc_f * (Nscara / (BFL * HFL) - 6 * Mscara / (BFL * HFL ** 2)) / (Nscara / (BFL * HFL) + 6 * Mscara / (BFL * HFL ** 2)) // OK
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc < 0.6 * FCK && Math.abs(els.sigs2) < 0.8 * FYK))
          }

          if (els.sigc < 0) {
            do {
              Ast_f = Ast_f * 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc > 0 && els.sigc < 0.6 * FCK))
          }

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

          if (els.sigs < 0) {
            sigslim = 0.8 * FYK
            //Text = "< 0.8fyk = "
          } else {
            sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
            //Text = "< 1000 wmax = "
          }

          if (!(Math.abs(els.sigs) < sigslim)) {
            do {
              Ast_f = Ast_f * 1.0005 // OK
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
              if (els.sigs < 0) {
                sigslim = 0.8 * FYK
                //Text = "< 0.8fyk = "
              } else {
                sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
                //Text = "< 1000 wmax = "
              }
            } while (!(Math.abs(els.sigs) < sigslim))
          }

        }
        else {
          // partiellement comprimée
          Asc_f = 0.00000001
          Ast_f = 0.00000001

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

          if (els.sigs < 0) {
            sigslim = 0.8 * FYK
            //Text = "< 0.8fyk = "
          } else {
            sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
            //Text = "< 1000 wmax = "
          }

          if (!(Math.abs(els.sigs) < sigslim)) {
            do {
              Ast_f = Ast_f * 1.0005 // OK
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
              if (els.sigs < 0) {
                sigslim = 0.8 * FYK
                // Text = "< 0.8fyk = "
              } else {
                sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
                // Text = "< 1000 wmax = "
              }
            } while (!(Math.abs(els.sigs) < sigslim))
          }

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)

          if (!(els.sigc < 0.6 * FCK)) {
            do {
              Ast_f = Ast_f * 1.0005 // OK
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc < 0.6 * FCK))
          }

        }
      }
  }
  return Ast_f
}
