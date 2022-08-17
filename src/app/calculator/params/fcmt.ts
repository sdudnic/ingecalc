/**
 * Param: FCMT; f_cm (t) - MPa
 * Onglet: Cara béton
 * Champ: F6
 * @returns f_cm (t) - MPa
 */
export default async function FCMT(
  FCM: number,
  BCC: number,
): Promise<number> {

  //=F5*B10
  /*
  F5  - FCM
  B10 - BCC
   */
  return FCM * BCC
}