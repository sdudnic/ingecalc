export default async function ECEFF(ECM: number, FTT0: number): Promise<number> {
  return ECM / (1 + FTT0);
}