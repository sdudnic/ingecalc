import { EnumSTA, EnumUNIT, TextColor } from '../common/enums';
import { contraintesELS, ElsParams, getSmallKUnit, toFixedTrimmed } from '../common/functions';

/**
 * Flexion/Bending tab
 * Excel: Flexion.G53
 * @param STA 
 * @param BFL 
 * @param AEF 
 * @param HFL 
 * @param GCF 
 * @param GTF 
 * @param WMAX 
 * @param FYK 
 * @param UNIT 
 * @param MELSQ 
 * @param NELSQ 
 * @param MELSF 
 * @param NELSF 
 * @param MELSC 
 * @param NELSC 
 * @param FCK 
 * @returns 
 */
export default async function SIGSF_INFO(
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
  MELSF: number,
  NELSF: number,
  MELSC: number,
  NELSC: number,
  FCK: number,
): Promise<string> {

  let sigsf_info = ""

  let els: ElsParams | null = null;
  let Ast_f = NaN
  let Asc_f = NaN
  let sigslim: number

  let kunit = getSmallKUnit(UNIT);
  let Msquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? MELSF : MELSQ) / kunit
  let Mscara = MELSC / kunit
  let Nsquasi = ((STA === EnumSTA.NF_EN_1992_2_NA) ? NELSF : NELSQ) / kunit
  let Nscara = NELSC / kunit

  let d = HFL - GTF

  // Limitation rapport M/N pour éviter erreur arrondi
  if ((Nsquasi !== 0) && (Math.abs(Msquasi / Nsquasi) > 100)) {
    Nsquasi = 0
  }
  if ((Nscara !== 0) && (Math.abs(Mscara / Nscara) > 100)) {
    Nscara = 0
  }

  if (STA === EnumSTA.NF_EN_1992_2_NA) {
    let Text: string
    if (Nsquasi == 0) {
      // flexion simple
      sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
      sigsf_info = `< 1000 w<sub>max</sub> = ${toFixedTrimmed(sigslim, 2)} MPa --> {{{OK}}}${TextColor.GREEN}`

      Asc_f = 0.0000001
      Ast_f = 0.0000001

      els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)

      if (Math.abs(els.sigs) >= sigslim) {
        do {
          Asc_f = Asc_f * 1.0005
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
        } while (Math.abs(els.sigs) < sigslim)
      }

      els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

      if (els.sigc < 0.6 * FCK) {
        sigslim = 0.6 * FCK
        Text = "< 0.6f<sub>ck</sub> = "
      } else {
        do {
          Asc_f = Asc_f * 1.0005
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
        } while (els.sigc < 0.6 * FCK)
        els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
        if (Math.abs(els.sigs) >= sigslim) {
          do {
            Ast_f = Ast_f * 1.0005
            els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
          } while (Math.abs(els.sigs) < sigslim)

        }
        sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
        Text = "< 1000 w<sub>max</sub> = "
      }
      sigsf_info = `${Text} ${toFixedTrimmed(sigslim, 2)} MPa --> {{{OK}}}${TextColor.GREEN}`
    }
    else if (Nsquasi < 0 && (Msquasi / Nsquasi >= -(HFL / 2 - GCF) && Msquasi / Nsquasi <= (HFL / 2 - GTF))) {
      // entiérement tendu
      sigslim = Math.min(600 * WMAX, 0.8 * FYK)
      sigsf_info = `< 600 w<sub>max</sub> = ${toFixedTrimmed(sigslim, 2)} MPa --> {{{OK}}}${TextColor.GREEN}`
    }
    else if (Nsquasi > 0 && Msquasi / Nsquasi <= HFL / 6 && Msquasi / Nsquasi >= -HFL / 6) {
      // entiérement comprimée
      Asc_f = 0.0000001
      Ast_f = 0.0000001

      els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
      if (Math.abs(els.sigc) < 0.6 * FCK) {
        //sigc = els.sigc
      } else {
        do {
          Asc_f = Asc_f * 1.0005
          Ast_f = Asc_f * (Nscara / (BFL * HFL) - 6 * Mscara / (BFL * HFL ** 2)) / (Nscara / (BFL * HFL) + 6 * Mscara / (BFL * HFL ** 2)) // OK
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
        } while (!(els.sigc < 0.6 * FCK && Math.abs(els.sigs2) < 0.8 * FYK))
        //sigc = els.sigc
      }

      if (els.sigc < 0) {
        do {
          Ast_f = Ast_f * 1.0005
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
        } while (!(els.sigc > 0 && els.sigc < 0.6 * FCK))
        //sigc = els.sigc
      }

      els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

      if (els.sigs < 0) {
        sigslim = 0.8 * FYK
        Text = "< 0.8f<sub>yk</sub> = "
      } else {
        sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
        Text = "< 1000 w<sub>max</sub> = "
      }
      if (!(Math.abs(els.sigs) < sigslim)) {
        do {
          Ast_f = Ast_f * 1.0005
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
          if (els.sigs < 0) {
            sigslim = 0.8 * FYK
            Text = "< 0.8f<sub>yk</sub> = "
          } else {
            sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
            Text = "< 1000 w<sub>max</sub> = "
          }
        } while (!(Math.abs(els.sigs) < sigslim))
      }

      sigsf_info = `${Text} ${toFixedTrimmed(sigslim, 2)} MPa --> {{{OK}}}${TextColor.GREEN}`
    }
    else {
      // partiellement comprimée
      Asc_f = 0.00000001
      Ast_f = 0.00000001

      els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

      if (els.sigs < 0) {
        sigslim = 0.8 * FYK
        Text = "< 0.8f<sub>yk</sub> = "
      } else {
        sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
        Text = "< 1000 w<sub>max</sub> = "
      }

      if (!(Math.abs(els.sigs) < sigslim)) {
        do {
          Ast_f = Ast_f * 1.0005 // OK
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)
          if (els.sigs < 0) {
            sigslim = 0.8 * FYK
            Text = "< 0.8f<sub>yk</sub> = "
          } else {
            sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
            Text = "< 1000 w<sub>max</sub> = "
          }
        } while (!(Math.abs(els.sigs) < sigslim))
      }

      els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)

      if (els.sigc < 0.6 * FCK) {
        //sigc = els.sigc
      } else {
        do {
          Ast_f = Ast_f * 1.0005
          els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
        } while (!(els.sigc < 0.6 * FCK))
        //sigc = els.sigc

        els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nsquasi, Msquasi)

        if (els.sigs < 0) {
          sigslim = 0.8 * FYK
          Text = "< 0.8f<sub>yk</sub> = "
        } else {
          sigslim = Math.min(1000 * WMAX, 0.8 * FYK)
          Text = "< 1000 w<sub>max</sub> = "
        }

        if (!(Math.abs(els.sigs) < sigslim)) {
          do {
            Ast_f = Ast_f * 1.0005
            els = contraintesELS(BFL, Asc_f, Ast_f, AEF, d, HFL, GCF, GTF, Nscara, Mscara)
          } while (!(Math.abs(els.sigs) < sigslim))
        }
      }
    }

    if (Math.abs(Ast_f) > 0.04 * BFL * HFL) {
      sigsf_info = "Ast > 0.04Ac --> {{{NOK!}}}" + TextColor.RED
    }

  }

  return sigsf_info
}