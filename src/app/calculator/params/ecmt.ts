/**
 * ECMT (MPa); E_cm (t)
 * Onglet: Cara Béton
 * Champ: F13
 * @param FCMT 
 * @param FCM 
 * @param ECM 
 * @returns ECMT (MPa)
 */
export default async function ECMT(
  FCMT: number,
  FCM: number,
  ECM: number,
): Promise<number> {

  //=(F6/F5)^0.3*F12
  /*
   F6  - FCMT
   F5  - FCM
   F12 - ECM
   */
  return (FCMT / FCM) ** 0.3 * ECM
}