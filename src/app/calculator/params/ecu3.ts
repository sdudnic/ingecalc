import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * e_cu3 (‰)
 * Value ex: 3.5
 * Onglet: PARAM
 * @param CON concrete type / type de béton
 * @returns e_cu3 (‰); ex: 3.5
 */
export default async function ECU3(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.ECU3);
}