import { EnumCON,  SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * Param: f_ck,cube (MPa)
 * Value ex: 37 (for CON = C30/37)
 * Onglet: PARAM
 * @param CON concrete type
 * @returns f_ck,cube (MPa); ex: 37
 */
export default async function FCKCUBE(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.FCKCUBE);
}