export default async function BCC(SCO: number, ACO: number): Promise<number> {
  return Math.exp(SCO * (1 - (28 / ACO) ** (1 / 2)))
}