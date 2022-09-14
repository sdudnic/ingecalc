export interface Setting {
  parentCode: string;
  listCode: string;
  propertyCode: string;
  propertyValue: string;
}
export interface SettingsDictionary {
  key: string;
  value: PropertiesDictionary;
}
export interface PropertiesDictionary {
  key: string;
  value: Setting;
}
export interface LooseObject {
  [key: string]: any;
}
