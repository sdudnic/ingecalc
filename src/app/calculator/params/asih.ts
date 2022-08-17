/**
 * A_s,ink,h (cm²)
 * Excel: Console.E31
 * @param ACCO 
 * @param HCC 
 * @param ASMAIN 
 * @param K1PJ3 
 * @returns A_s,ink,h (cm²); ex: 0.00	
 */
export default async function ASIH(
  ACCO: number,
  HCC: number,
  ASMAIN: number,
  K1PJ3: number): Promise<number> {

  let asih = 0; // par défault

  if (ACCO < 0.5 * HCC || ACCO == 0.5 * HCC) {
    asih = Math.max(K1PJ3 * ASMAIN, 0);
  }

  return asih;
}