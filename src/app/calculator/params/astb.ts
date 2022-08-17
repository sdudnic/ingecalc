/**
 * ASTB, cm2; A_st
 * Onglet: Flexion
 * Champ: F30
 * @returns ASTB, cm2
 */
export  default async function ASTB(
  NAST1: number,
  NAST2: number,
  NAST3: number,
  LAST1: number,
  LAST2: number,
  LAST3: number,
): Promise<number> {
  //=B31*(PI()*(D31/10)^2/4)+B30*(PI()*(D30/10)^2/4)+B29*(PI()*(D29/10)^2/4)
  /*
  B29 - NAST1
  B30 - NAST2
  B31 - NAST3
  D29 - LAST1
  D30 - LAST2
  D31 - LAST3
   */
  return NAST3 * (Math.PI * (LAST3 / 10) ** 2 / 4) + NAST2 * (Math.PI * (LAST2 / 10) ** 2 / 4) + NAST1 * (Math.PI * (LAST1 / 10) ** 2 / 4)
}