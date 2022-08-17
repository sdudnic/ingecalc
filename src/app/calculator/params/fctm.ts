import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * Param: FCTM; f_ctm (MPa)
 * Value ex: 2.9 (for CON = C30/37)
 * Onglet: Cara béton
 * Champ: F10
 * @param CON concrete type
 * @returns f_ctm (MPa); ex: 2.9
 */
export default async function FCTM(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.FCTM);
}