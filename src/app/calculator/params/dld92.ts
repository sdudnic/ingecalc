/**
 * DLD92 Fleche!G62
 * @param properties
 * @returns D21/250*100
 */
export default async function DLD92(
  LEFFD: number
): Promise<number> {
  return LEFFD / 250 * 100;
}
