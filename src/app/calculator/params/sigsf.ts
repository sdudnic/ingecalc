import { EnumSTA, EnumUNIT } from '../common/enums';
import { checkInvalidElsFlexionValues, contraintesELS, ElsParams, getSmallKUnit } from '../common/functions';

/**
 * sigma_s,freq (MPa)
 * Bending/Flexion.E53
 */
export default async function SIGSF(
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

  let sigc = getSigs(STA, BFL, AEF, HFL, GCF, GTF, WMAX, FYK, UNIT, MELSQ, NELSQ, ASTB, MELSC, NELSC, MELSF, NELSF, GSF, GACF, FCK)

  return sigc;
}


function getSigs(
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

  let sigs = NaN;

  let els: ElsParams | null = null;
  let Ast_f = NaN
  let Asc_f = NaN
  let sigslim: number

  let kunit = getSmallKUnit(UNIT);
  let Msquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? MELSF : MELSQ) / kunit
  let Nsquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? NELSF : NELSQ) / kunit
  let Mscara = MELSC / kunit
  let Nscara = NELSC / kunit

  checkInvalidElsFlexionValues(Mscara, Msquasi, ASTB, GTF, HFL, GCF, MELSC, NELSC, MELSQ, NELSQ, MELSF, NELSF, STA, BFL, GSF, GACF);

  let d = HFL - GTF

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
          Ast_f = 0.0000001

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

          if (Math.abs(els.sigs) < sigslim) {
            sigs = els.sigs // OK
          } else {
            do {
              Ast_f *= 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
            } while (!(Math.abs(els.sigs) < sigslim))
            sigs = els.sigs // OK
          }

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)

          if (els.sigc < 0.6 * FCK) {
            // Cells(54, 7).Value = "< 0.6fck = " & 0.6 * _FCK & " MPa --> OK"
            // Range(Cells(54, 7), Cells(54, 7)).Characters(7, 2).Font.Subscript = True
            // sigc = r.sigc
            // _ASCF = Asc_f * 10000
          }
          else {
            do {
              Asc_f *= 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc < 0.6 * FCK))
            //sigc = r.sigc

            els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

            if (Math.abs(els.sigs) < sigslim) {
              sigs = els.sigs // OK
            } else {
              do {
                Ast_f *= 1.0005
                els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
              } while (!(Math.abs(els.sigs) < sigslim))
              sigs = els.sigs // OK
              //r = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            }
          }

        }
        else if (Nsquasi < 0 && (Msquasi / Nsquasi >= -(HFL / 2 - GCF) && Msquasi / Nsquasi <= (HFL / 2 - GTF))) {
          // entiérement tendu
          sigslim = Math.min(600 * WMAX, 0.8 * FYK)
          Ast_f = -Nsquasi * (HFL / 2 - GCF - Msquasi / Nsquasi) / (HFL - GTF - GCF) / (0.9999 * sigslim) // OK
          Asc_f = -Nsquasi * (HFL / 2 - GTF + Msquasi / Nsquasi) / (HFL - GTF - GCF) / (0.9999 * sigslim)

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

          if (Math.abs(els.sigs) < sigslim) {
            sigs = els.sigs // OK
          } else {
            do {
              Ast_f *= 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
            } while (!(Math.abs(els.sigs) < sigslim))
            sigs = els.sigs // OK
          }

          //r = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
          //sigc = r.sigc // OK
        }
        else if (Nsquasi > 0 && Msquasi / Nsquasi <= HFL / 6 && Msquasi / Nsquasi >= -HFL / 6) {
          // entiérement comprimée
          Asc_f = 0.0000001
          Ast_f = 0.0000001

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)

          if (Math.abs(els.sigc) < 0.6 * FCK) {
            //sigc = r.sigc
          } else {
            do {
              Asc_f = Asc_f * 1.0005
              Ast_f = Asc_f * (Nscara / (BFL * HFL) - 6 * Mscara / (BFL * HFL ** 2)) / (Nscara / (BFL * HFL) + 6 * Mscara / (BFL * HFL ** 2)) // OK
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc < 0.6 * FCK && Math.abs(els.sigs2) < 0.8 * FYK))
            //sigc = r.sigc
          }

          if (els.sigc < 0) {
            do {
              Ast_f = Ast_f * 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc > 0 && els.sigc < 0.6 * FCK))
            // sigc = r.sigc
          }

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

          if (els.sigs < 0) {
            sigslim = 0.8 * FYK
            //Text = "< 0.8fyk = "
          } else {
            sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
            //Text = "< 1000 wmax = "
          }

          if (Math.abs(els.sigs) < sigslim) {
            sigs = Math.max(Math.abs(els.sigs), Math.abs(els.sigs2))
          } else {
            do {
              Ast_f = Ast_f * 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
              if (els.sigs < 0) {
                sigslim = 0.8 * FYK
                //Text = "< 0.8fyk = "
              } else {
                sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
                //Text = "< 1000 wmax = "
              }
            } while (!(Math.abs(els.sigs) < sigslim))
            sigs = Math.max(Math.abs(els.sigs), Math.abs(els.sigs2))
            //r = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            //sigc = r.sigc // OK
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

          if (Math.abs(els.sigs) < sigslim) {
            sigs = els.sigs // OK
          } else {
            do {
              Ast_f = Ast_f * 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
              if (els.sigs < 0) {
                sigslim = 0.8 * FYK
                // Text = "< 0.8fyk = "
              } else {
                sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
                // Text = "< 1000 wmax = "
              }
            } while (!(Math.abs(els.sigs) < sigslim))
            sigs = els.sigs // OK
          }

          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)

          if (els.sigc < 0.6 * FCK) {
            //sigc = r.sigc
          } else {
            do {
              Ast_f = Ast_f * 1.0005
              els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
            } while (!(els.sigc < 0.6 * FCK))
            //sigc = r.sigc

            els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)


            if (els.sigs < 0) {
              sigslim = 0.8 * FYK
              //Text = "< 0.8fyk = "
            } else {
              sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
              //Text = "< 1000 wmax = "
            }

            if (Math.abs(els.sigs) < sigslim) {
              sigs = els.sigs // OK
            } else {
              do {
                Ast_f = Ast_f * 1.0005
                els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
              } while (!(Math.abs(els.sigs) < sigslim))
              sigs = els.sigs // OK
              //Cells(53, 7).Value = Text & Format(sigslim, "0.00") & " MPa --> OK"
              //r = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
              //Cells(54, 7).Value = "< 0.6fck = " & 0.6 * _FCK & " MPa --> OK"
              //sigc = r.sigc // OK
            }
          }
        }
      }
  }

  return sigs ?? NaN
}

