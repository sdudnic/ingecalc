import { Injectable } from '@angular/core';
import { Properties } from './properties';
import * as Engine from './calculator/params';
import {
  EnumCDF,
  EnumSTA,
  PropertyCode,
  EnumAGF,
  EnumCBAR,
  EnumCON,
  EnumUNIT,
  EnumECF,
  EnumENT,
  EnumKCO,
  EnumLFL,
  EnumSFS,
  EnumSREP,
  EnumSTD,
  EnumTYC,
  Enum_D,
} from './calculator/common/enums';

@Injectable()
export class CalculatorService {
  constructor() {}

  calculate(properties: Record<PropertyCode, any>) {
    const props = new Properties();

    Object.keys(props).forEach(async (key: PropertyCode) => {
      if (Properties.CalculatedKeys.indexOf(key) > -1) {
        const args = Properties.getDependentProperties(key, properties);
        properties[key] = await CalculatorService.callByName(key, Engine, ...args);
      }
    });
    return properties;
  }

  /**
   * Calls a function by name gived a context
   * @param functionName the function name, using namespaces also allowed 'my.namespace.myFunction'
   * @param context function context
   * @param args function arguments
   * @returns function return or undefined if functionName is empty
   */
  static callByName(functionName: string, context: any, ...args: any) {
    const namespaces = functionName.split('.');
    const func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }

    return func ? context[func].apply(context, args) : undefined;
  }
}
