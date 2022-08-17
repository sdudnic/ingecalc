import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * f_ctk, 0,05 (MPa) 
 * Value ex: 2
 * Onglet: PARAM
 * @param CON concrete type
 * @returns f_ctk, 0,05 (MPa); ex: 2
 */
export default async function FCTK005(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.FCTK005);
}