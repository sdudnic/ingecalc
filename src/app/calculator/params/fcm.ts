import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * f_cm (MPa)
 * Value ex: 38 (for CON = C30/37)
 * Onglet: PARAM
 * @param CON concrete type
 * @returns f_cm (MPa); ex: 38
 */
export default async function FCM(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.FCM);
}