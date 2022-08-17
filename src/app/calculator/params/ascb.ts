/**
 * ASCB, cm2; A_sc 
 * Excel: Flexion.F34
 * @param NASC1 
 * @param NASC2 
 * @param NASC3 
 * @param LASC1 
 * @param LASC2 
 * @param LASC3 
 * @returns A_sc, cm2
 */
export default async function ASCB(
  NASC1: number,
  NASC2: number,
  NASC3: number,
  LASC1: number,
  LASC2: number,
  LASC3: number,
): Promise<number> {

  //=B35*(PI()*(D35/10)^2/4)+B34*(PI()*(D34/10)^2/4)+B33*(PI()*(D33/10)^2/4)
  /*
  B33 - NASC1
  B34 - NASC2
  B35 - NASC3
  D33 - LASC1
  D34 - LASC2
  D35 - LASC3
   */
  return NASC3 * (Math.PI * (LASC3 / 10) ** 2 / 4) + NASC2 * (Math.PI * (LASC2 / 10) ** 2 / 4) + NASC1 * (Math.PI * (LASC1 / 10) ** 2 / 4)
}