import { Injectable } from '@angular/core';
import { EnumCDF, EnumSTA } from './calculator/common/enums';
import { C } from './calculator/params/c';
import { D } from './calculator/params/d';
import { E } from './calculator/params/e';

@Injectable()
export class CalculatorService {
  constructor() {}

  calculate(properties: Record<string, number>) {
    const a = properties['a'];
    const b = properties['b'];
    const STA = <EnumSTA>properties[PropertyCode.STA];
    const CDF = <EnumCDF>properties[PropertyCode.CDF];
    const CON = <EnumCON>properties[PropertyCode.CON];
    const KCO = <EnumKCO>properties[PropertyCode.KCO];
    const UNIT = <EnumUNIT>properties[PropertyCode.UNIT];
    const NAST1 = <number>properties[PropertyCode.NAST1];
    const NAST2 = <number>properties[PropertyCode.NAST2];
    const NAST3 = <number>properties[PropertyCode.NAST3];
    const LAST1 = <number>properties[PropertyCode.LAST1];
    const LAST2 = <number>properties[PropertyCode.LAST2];
    const LAST3 = <number>properties[PropertyCode.LAST3];
    const NASC1 = <number>properties[PropertyCode.NASC1];
    const NASC2 = <number>properties[PropertyCode.NASC2];
    const NASC3 = <number>properties[PropertyCode.NASC3];
    const LASC1 = <number>properties[PropertyCode.LASC1];
    const LASC2 = <number>properties[PropertyCode.LASC2];
    const LASC3 = <number>properties[PropertyCode.LASC3];
    const MELU = <number>properties[PropertyCode.MELU];
    const BFL = <number>properties[PropertyCode.BFL];
    const HFL = <number>properties[PropertyCode.HFL];
    const GCF = <number>properties[PropertyCode.GCF];
    const GTF = <number>properties[PropertyCode.GTF];
    const GSF = <number>properties[PropertyCode.GSF];
    const GACF = <number>properties[PropertyCode.GACF];
    const NELU = <number>properties[PropertyCode.NELU];
    const FYK = <number>properties[PropertyCode.FYK];
    const AEF = <number>properties[PropertyCode.AEF];
    const WMAX = <number>properties[PropertyCode.WMAX];
    const MELSQ = <number>properties[PropertyCode.MELSQ];
    const NELSQ = <number>properties[PropertyCode.NELSQ];
    const MELSC = <number>properties[PropertyCode.MELSC];
    const NELSC = <number>properties[PropertyCode.NELSC];
    const MELSF = <number>properties[PropertyCode.MELSF];
    const NELSF = <number>properties[PropertyCode.NELSF];
    const CFL = <number>properties[PropertyCode.CFL];
    const LFL = <EnumLFL>properties[PropertyCode.LFL];
    const AGF = <EnumAGF>properties[PropertyCode.AGF];
    const CBAR = <EnumCBAR>properties[PropertyCode.CBAR];
    const SPBT = <number>properties[PropertyCode.SPBT];
    const SPBC = <number>properties[PropertyCode.SPBC];
    const ECF = <EnumECF>properties[PropertyCode.ECF];
    const BAUTO = <boolean>properties[PropertyCode.BAUTO];

    const c = C(a, b);
    const d = D(a, b);
    const e = E(a, b);

    properties['c'] = c;
    properties['d'] = d;
    properties['e'] = e;
    return properties;
  }
}
