import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * n
 * Value ex: 2
 * Onglet: PARAM
 * @param CON concrete type / type de béton
 * @returns n; ex: 2
 */
export default async function N(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.N);
}