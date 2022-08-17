/**
 * E_cm (MPa)
 * Value ex: 32836.5680313308
 * @param FCM f_cm (MPa)
 * @returns E_cm (MPa); ex: 32836.5680313308
 */
export default async function ECM(FCM: number): Promise<number> {
  return 22 * Math.pow(FCM / 10, 0.3) * 1000; // GPa => Mpa
}
