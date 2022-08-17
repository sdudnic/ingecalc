import { EnumTYC, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * s
 * Value ex: 0.25
 * Onglet: PARAM
 * @param TYC Type de ciment
 * @returns s; ex: 0.25
 */
export default async function SCO(TYC: EnumTYC): Promise<number> {
  return await getSettingValue(TYC, SettingProperty.SCO);
}