/**
 * FCTMT (MPa); f_ctm(t)
 * Onglet: Cara béton
 * Champ: F10 
 * @returns FCTMT (MPa)
 */
export default async function FCTMT(
  FCTM: number,
  BCC: number,
  ALC: number,
): Promise<number> {

  //=F9*B10^(B11)
  /*
  F9  - FCTM
  B10 - BCC
  B11 - ALC
   */
  return FCTM * BCC ** ALC
}