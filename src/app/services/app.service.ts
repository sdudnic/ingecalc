import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private static injector: Injector;
  public static getInjector(): Injector {
    return this.injector;
  }
  public static _setInjector(injector: Injector): void {
    this.injector = injector;
  }

  constructor() { }
}
