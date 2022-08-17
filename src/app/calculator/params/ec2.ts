import { EnumCON, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * e_c2 (‰)
 * Value ex: 2
 * Onglet: PARAM
 * @param CON concrete type / type de béton
 * @returns e_c2 (‰); ex: 2
 */
export default async function EC2(CON: EnumCON): Promise<number> {
  return await getSettingValue(CON, SettingProperty.EC2);
}