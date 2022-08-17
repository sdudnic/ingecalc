import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * f_ctk, 0,95 (MPa) 
 * Value ex: 3.8
 * Onglet: PARAM
 * @param CON concrete type
 * @returns f_ctk, 0,95 (MPa); ex: 3.8
 */
export default async function FCTK095(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.FCTK095);
}