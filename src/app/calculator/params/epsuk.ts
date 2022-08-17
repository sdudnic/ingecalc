import { EnumKCO, SettingProperty } from '../common/enums';
import { getSettingValue } from '../common/functions';

/**
 * EpsUK
 * Value ex: 1.08
 * Onglet: PARAM
 * @param KCO Classe
 * @returns EpsUK; ex: 1.08; or 0, if KCO is H
 */
export default async function EPSUK(KCO: EnumKCO): Promise<number | null> {
  if (KCO == EnumKCO.H)
    return null;
  else
    return await getSettingValue(KCO, SettingProperty.EPSUK);
}
