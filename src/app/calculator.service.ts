import { Injectable } from '@angular/core';
import { C } from './calculator/c';
import { D } from './calculator/d';
import { E } from './calculator/e';

@Injectable()
export class CalculatorService {
  constructor() {}

  calculate(properties: Record<string, number>) {
    const a = properties['a'];
    const b = properties['b'];

    const c = C(a, b);
    const d = D(a, b);
    const e = E(a, b);

    properties['c'] = c;
    properties['d'] = d;
    properties['e'] = e;
    return properties;
  }
}
