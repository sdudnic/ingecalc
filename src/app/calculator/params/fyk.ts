import { EnumKCO, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * f_yk (MPa)
 * Value ex: 500
 * Onglet: PARAM
 * @param KCO Classe
 * @returns f_yk (MPa); ex: 500
 */
export default async function FYK(KCO: EnumKCO): Promise<number> {
  return await getSettingValue(KCO, SettingProperty.FYK);
}