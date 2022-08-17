export default async function H0C(
  CCSA: number,
  UCO: number,
): Promise<number> {

  return 2 * CCSA / UCO * 1000;
}