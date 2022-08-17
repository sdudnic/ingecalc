/**
 * α =	1.00
 * Excel: CaraBeton.B11
 * @param ACO 
 * @returns α ; ex: 1.00
 */
export default async function ALC(ACO: number): Promise<number> {
  return (ACO < 28) ? 1 : (2 / 3);
}