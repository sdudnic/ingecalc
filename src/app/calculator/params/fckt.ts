/**
 * Param: FCMT; f_ck (t) - MPa
 * Onglet: Cara béton
 * Champ: F7
 * @returns f_ck (t) - MPa
 */
export default async function FCKT(
  ACO: number,
  FCM: number,
  FCMT: number,
): Promise<number> {

  //=IF(B6>28;F5-8;F6-8)
  /*
  B6 - ACO
  F5 - FCM
  F6 - FCMT
   */
  return (ACO > 28) ? (FCM - 8) : (FCMT - 8);
}