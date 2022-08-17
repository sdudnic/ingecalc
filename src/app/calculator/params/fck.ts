import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * Param: FCK; f_ck (MPa)
 * Value ex: 55 (for CON = C55/67)
 * Onglet: PARAM
 * @param CON 
 * @returns f_ck (MPa)
 */
export default async function FCK(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.FCK);
}