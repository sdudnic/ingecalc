/**
 * returns Max(TSC, T0C)
 * @param TSC
 * @param T0C
 * @returns Max(TSC, T0C)
 */
export default async function MAXTC(TSC: number, T0C: number): Promise<number> {
  return Math.max(T0C, TSC);
}
