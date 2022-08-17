import { EnumSTA, PropertyCode } from '../common/enums';
import { checkStrut } from '../common/functions';

/**
 * L'angle d'inclinaison de la bielle - θ (°)
 * la valeur saisie, la fonction est pour les tests de verification
 * Value ex: 45
 * Excel: Torsion.E20
 */
export default async function STR_TO(
  STR_TO: number,
  STA: EnumSTA,
  KUNIT: number,
  NEDT: number,
  BFL: number,
  HFL: number,
  FCTM: number,
): Promise<number> {

  checkStrut(STR_TO, PropertyCode.STR_TO, STA, KUNIT, NEDT, BFL, HFL, FCTM);
  return STR_TO;
}