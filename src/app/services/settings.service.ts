import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ListItem } from '../models/list-item';
import { Setting, SettingsDictionary } from '../models/setting';

/**
 * Settings service.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  public currentUnit = 'U';
  private settings: Setting[] = [];
  private propSettings: SettingsDictionary[] = [];
  private baseUrl = '/api/settings/';
  constructor(private http: HttpClient) {}

  /**
   * Get setting values
   * @param fromHttp Force from http query.
   * @returns
   */
  public async getSettings(fromHttp = false): Promise<Setting[]> {
    if (fromHttp || !this.settings || this.settings.length == 0)
      this.settings = await lastValueFrom(
        this.http.get<Setting[]>(this.baseUrl + 'values')
      );
    return this.settings;
  }
  public async getPropertySettings(
    fromHttp = false
  ): Promise<SettingsDictionary[]> {
    if (fromHttp || !this.settings || this.settings.length == 0)
      this.propSettings = await lastValueFrom(
        this.http.get<SettingsDictionary[]>(this.baseUrl + 'propertySettings')
      );
    return this.propSettings;
  }
  public getLists(): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(this.baseUrl + 'lists');
  }

  public getList(code: string): Observable<string[]> {
    return this.http
      .get<ListItem[]>(`${this.baseUrl}list/${code}`)
      .pipe(map((l) => l.map((li) => li.value)));
  }

  public getSettingValue(
    settingCode: string,
    propertyCode: string
  ): Observable<string> {
    return this.http.get<string>(
      `${this.baseUrl}prop/${settingCode}/${propertyCode}`
    );
  }
/*
  public async getAppVersion(): Promise<string> {
    if (!this.version)
      this.version = await lastValueFrom(
        this.http.get('/api/version', { responseType: 'text' })
      );

    return this.version;
  }
  public updateMatrix(properties: DynamicProperties[]): Observable<void> {
    return this.http.put<void>(this.baseUrl, properties);
  }*/
}
