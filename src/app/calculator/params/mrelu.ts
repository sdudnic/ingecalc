/**
 * MR-ELU (t.m) kN...
 * Excel: Flexion.C49
 * Value ex: 3.0144
 * @param MELU
 * @param DFL
 * @returns MR-ELU (t.m) kN...
 */
export default async function MRELU(
  MELU: number,
  DFL: number,

): Promise<number> {


  let Mr = MELU,
    Mr1 = NaN;

  if (Mr > 0) {
    do {

      Mr1 = Mr
      if (Mr <= 0) {
        break;
      }

      Mr = Mr - MELU / 1000
    } while (!(Mr / MELU < DFL))
  }

  Mr = Mr1

  return Mr;
}
