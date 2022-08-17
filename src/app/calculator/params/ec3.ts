import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * e_c3 (‰)
 * Value ex: 1.75
 * Onglet: PARAM
 * @param CON concrete type / type de béton
 * @returns e_c3 (‰); ex: 1.75
 */
export default async function EC3(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.EC3);
}