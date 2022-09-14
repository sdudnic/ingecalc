import { ErrorLevel } from '../enums';

export class CalculatorError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public value?: any,
    public level?: ErrorLevel,
    public messageParams?: Object
  ) {
    super(message);

    Object.setPrototypeOf(this, CalculatorError.prototype);
  }
}
