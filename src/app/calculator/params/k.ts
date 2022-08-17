import { EnumKCO, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * k
 * Value ex: 1.08
 * Onglet: PARAM
 * @param KCO Classe
 * @returns k; ex: 1.08; or 0, if KCO is H
 */
export default async function K(KCO: EnumKCO): Promise<number | null> {
  if (KCO == EnumKCO.H)
    return null;
  else
    return await getSettingValue(KCO, SettingProperty.K);
}
