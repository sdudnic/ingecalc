import { EnumTYC, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * e_ds1
 * Value ex: 4
 * Onglet: PARAM
 * @param TYC Type de ciment
 * @returns e_ds1; ex: 4
 */
export default async function EDS1(TYC: EnumTYC): Promise<number> {
  return await getSettingValue(TYC, SettingProperty.EDS1);
}