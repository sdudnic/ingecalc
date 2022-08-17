import { SettingProperty, EnumUNIT } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * Coéfficient de multiplication, correspondant à l'unité (UNIT), choisie
 * Value ex: 1000
 * Onglet: PARAM
 * @param UNIT Unité de mesure
 * @returns KUNIT; ex: 1000
 */
export default async function KUNIT(UNIT: EnumUNIT): Promise<number> {
  return await getSettingValue(UNIT, SettingProperty.KUNIT);
}
