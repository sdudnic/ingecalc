export enum EnumSTA {
  /** (1) EN 1992-1-1 Norme de base */ EN1992_1_1_BS = 'EN1992_1_1_BS',
  /** (2) EN 1992-2 Norme de base */ EN1992_2_BS = 'EN1992_2_BS',
  /** (3) NF EN 1992-1-1/NA - DEFAULT */ NF_EN_1992_1_1_NA = 'NF_EN_1992_1_1_NA',
  /** (4) NF EN 1992-2/NA */ NF_EN_1992_2_NA = 'NF_EN_1992_2_NA',
  /** (5) BS EN 1992-1-1/NA */ BS_EN_1992_1_1_NA = 'BS_EN_1992_1_1_NA',
  /** (6) RCC-CW 2018 */ RCC_CW_2018 = 'RCC_CW_2018',
  /** (7) EN 1992-3 Norme de base */ EN_1992_3_BS = 'EN_1992_3_BS',
  /** (8) NF EN 1992-3/NA */ NF_EN_1992_3_NA = 'NF_EN_1992_3_NA',
  /** (9) BS EN 1992-3/NA */ BS_EN_1992_3_NA = 'BS_EN_1992_3_NA',
}
//export type EnumSTA = keyof typeof EnumSTA;

export enum EnumCON {
  /**  (1) C12/15 */ C1215 = 'C1215',
  /**  (2) C16/20 */ C1620 = 'C1620',
  /**  (3) C20/25 */ C2025 = 'C2025',
  /**  (4) C25/30 */ C2530 = 'C2530',
  /**  (5) C28/35 */ C2835 = 'C2835',
  /**  (6) C30/37 - DEFAULT */ C3037 = 'C3037',
  /**  (7) C35/45 */ C3545 = 'C3545',
  /**  (8) C40/50 */ C4050 = 'C4050',
  /**  (9) C45/55 */ C4555 = 'C4555',
  /** (10) C50/60 */ C5060 = 'C5060',
  /** (11) C55/67 */ C5567 = 'C5567',
  /** (12) C60/75 */ C6075 = 'C6075',
  /** (13) C70/85 */ C7085 = 'C7085',
  /** (14) C80/95 */ C8095 = 'C8095',
  /** (15) C90/105 */ C9010 = 'C9010',
}
//export type EnumCON = keyof typeof EnumCON;

export enum EnumTYC {
  /** (1) N - DEFAULT */ N = 'N',
  /** (2) R */ R = 'R',
  /** (3) S */ S = 'S',
}
//export type EnumTYC = keyof typeof EnumTYC;

export enum EnumKCO {
  /** (1) Classe A */ A = 'A',
  /** (2) Classe B */ B = 'B',
  /** (3) Classe C */ C = 'C',
  /** (4) Branche supérieure horizontale - DEFAULT */ H = 'H',
}
//export type EnumKCO = keyof typeof EnumKCO;

export enum EnumUNIT {
  /** (1) t - DEFAULT */ T = 'T',
  /** (2) kN */ KN = 'KN',
  /** (3) MN */ MN = 'MN',
}
//export type EnumUNIT = keyof typeof EnumUNIT;

export enum EnumLFL {
  /** (1) Chargement de longue durée - DEFAULT */ LTL = 'LTL',
  /** (2) Chargement de courte durée */ STL = 'STL',
}
//export type EnumLFL = keyof typeof EnumLFL;

export enum EnumCDF {
  /** (1) Diagramme rectangulaire simplifié - DEFAULT */ RSD = 'RSD',
  /** (2) Diagramme parabole rectangle */ PRD = 'PRD',
}
//export type EnumCDF = keyof typeof EnumCDF;

export enum EnumAGF {
  /** (1) Quartzite */ QUARTZITE = 'QUARTZITE',
  /** (2) Calcaires - DEFAULT */ LIMESTONE = 'LIMESTONE',
  /** (3) Grès */ SANDSTONE = 'SANDSTONE',
  /** (4) Basalte */ BASALT = 'BASALT',
}
//export type EnumAGF = keyof typeof EnumAGF;

export enum EnumECF {
  /** (1) XC -  DEAFAULT */ XC = 'XC',
  /** (2) XD ˅ XS ˅ XF ˅ XA  */ XD = 'XD',
}
//export type EnumECF = keyof typeof EnumECF;

export enum EnumCBAR {
  /** (1) HA - DEFAULT */ HY = 'HY',
  /** (2) Dx */ MILD = 'MILD',
}
//export type EnumCBAR = keyof typeof EnumCBAR;

export enum Enum_D {
  /** (1) Combinaison caractéristique - DEFAULT */ CCO = 'CCO',
  /** (2) Combinaison quasi permanente */ QPC = 'QPC',
  /** (3) Combinaison fréquente */ FCO = 'FCO',
}
//export type _EnumD = keyof typeof Enum_D;

export enum EnumSFS {
  /** (1) Dalle bénéficiant d'un effet de redistribution transversale */ TRSLAB = 'TRSLAB',
  /** (2) Dalle autre */ OTSLAB = 'OTSLAB',
  /** (3) Poutre - DEFAULT */ BEAM = 'BEAM',
  /** (4) Voile */ WALLA = 'WALLA',
}
//export type EnumSFS = keyof typeof EnumSFS;

export enum EnumSREP {
  /** (1) Très lisse - DEFAULT */ VSMOOTH = 'VSMOOTH',
  /** (2) Lisse */ SMOOTH = 'SMOOTH',
  /** (3) Rugueuse */ ROUGH = 'ROUGH',
  /** (4) Avec indentation */ INDENTED = 'INDENTED',
}

export enum EnumENT {
  /** (1) Moments - DEFAULT */ MOMENTS = 'MOMENTS',
  /** (2) Charges réparties */ LOADS = 'LOADS',
}

export enum EnumSTD {
  /** (1) Poutre continu ou sur appui simple - DEFAULT */ CBEAM = 'CBEAM',
  /** (2) Console */ CANTILEVER = 'CANTILEVER',
}

export enum TextColor {
  GREEN = ' _GREEN_',
  RED = ' _RED_',
}

export enum SettingList {
  STA = 'STA',
  CON = 'CON',
  TYC = 'TYC',
  KCO = 'KCO',
  UNIT = 'UNIT',
  LFL = 'LFL',
  CDF = 'CDF',
  AGF = 'AGF',
  ECF = 'ECF',
  CBAR = 'CBAR',
  SFS = 'SFS',
  SREP = 'SREP',
  ENT = 'ENT',
}

export enum SettingProperty {
  FCK = 'FCK',
  FCKCUBE = 'FCKCUBE',
  FCM = 'FCM',
  FCTM = 'FCTM',
  FCTK005 = 'FCTK005',
  FCTK095 = 'FCTK095',
  ECM = 'ECM',
  EC1 = 'EC1',
  ECU1 = 'ECU1',
  EC2 = 'EC2',
  ECU2 = 'ECU2',
  N = 'N',
  EC3 = 'EC3',
  ECU3 = 'ECU3',
  SCO = 'SCO',
  EDS1 = 'EDS1',
  EDS2 = 'EDS2',
  FYK = 'FYK',
  K = 'K',
  EPSUK = 'EPSUK',
  KUNIT = 'KUNIT',
  BAUTO = 'BAUTO',
}

export enum ErrorLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
  CRITICAL,
}

export enum PropertyCode {
  ABCO = 'ABCO',
  ACC = 'ACC',
  ACCB = 'ACCB',
  ACCO = 'ACCO',
  ACO = 'ACO',
  ACT = 'ACT',
  ACW = 'ACW',
  ACWT = 'ACWT',
  AEC = 'AEC',
  AECO = 'AECO',
  AEF = 'AEF',
  AGF = 'AGF',
  AISF = 'AISF',
  ALC = 'ALC',
  ALSF = 'ALSF',
  ALT = 'ALT',
  AM0D = 'AM0D',
  ARH = 'ARH',
  ASC1 = 'ASC1',
  ASC1_INFO = 'ASC1_INFO',
  ASCB = 'ASCB',
  ASCB_INFO = 'ASCB_INFO',
  ASCD = 'ASCD',
  ASCF = 'ASCF',
  ASCM = 'ASCM',
  ASF = 'ASF',
  ASIH = 'ASIH',
  ASIN = 'ASIN',
  ASLSF = 'ASLSF',
  ASMAIN = 'ASMAIN',
  ASSMY = 'ASSMY',
  ASSMZ = 'ASSMZ',
  ASST = 'ASST',
  ASSY = 'ASSY',
  ASSYT = 'ASSYT',
  ASSZ = 'ASSZ',
  ASSZT = 'ASSZT',
  AST1 = 'AST1',
  AST1_INFO = 'AST1_INFO',
  ASTB = 'ASTB',
  ASTB_INFO = 'ASTB_INFO',
  ASTD = 'ASTD',
  ASTF = 'ASTF',
  ASTM = 'ASTM',
  ASWS = 'ASWS',
  ASWSM = 'ASWSM',
  ATO = 'ATO',
  BAUTO = 'BAUTO',
  BCC = 'BCC',
  BCO = 'BCO',
  BCTT0 = 'BCTT0',
  BESF = 'BESF',
  BFL = 'BFL',
  BFLI = 'BFLI',
  CBAR = 'CBAR',
  CCC = 'CCC',
  CCC_INFO = 'CCC_INFO',
  CCC_INFO2 = 'CCC_INFO2',
  CCS = 'CCS',
  CCS_INFO = 'CCS_INFO',
  CCS_INFO2 = 'CCS_INFO2',
  CCSA = 'CCSA',
  CDF = 'CDF',
  CDY = 'CDY',
  CDY_INFO = 'CDY_INFO',
  CFL = 'CFL',
  CNOM = 'CNOM',
  CON = 'CON',
  CRDC622 = 'CRDC622',
  DFL = 'DFL',
  DLD17 = 'DLD17',
  DLD92 = 'DLD92',
  EC1 = 'EC1',
  EC2 = 'EC2',
  EC3 = 'EC3',
  ECAT = 'ECAT',
  ECDT = 'ECDT',
  ECEFF = 'ECEFF',
  ECF = 'ECF',
  ECM = 'ECM',
  ECMT = 'ECMT',
  ECS = 'ECS',
  ECU1 = 'ECU1',
  ECU2 = 'ECU2',
  ECU3 = 'ECU3',
  EDS1 = 'EDS1',
  EDS2 = 'EDS2',
  ENT = 'ENT',
  EPSUK = 'EPSUK',
  F0C = 'F0C',
  FBTT0 = 'FBTT0',
  FCK = 'FCK',
  FCKCUBE = 'FCKCUBE',
  FCKT = 'FCKT',
  FCM = 'FCM',
  FCMT = 'FCMT',
  FCTK005 = 'FCTK005',
  FCTK095 = 'FCTK095',
  FCTM = 'FCTM',
  FCTMT = 'FCTMT',
  FDTT0 = 'FDTT0',
  FED = 'FED',
  FNOK = 'FNOK',
  FTOK = 'FTOK',
  FTT0 = 'FTT0',
  FYK = 'FYK',
  GACF = 'GACF',
  GCF = 'GCF',
  GSF = 'GSF',
  GTC = 'GTC',
  GTF = 'GTF',
  H0C = 'H0C',
  HCC = 'HCC',
  HCOC = 'HCOC',
  HED = 'HED',
  HFL = 'HFL',
  HHFL = 'HHFL',
  HNS = 'HNS',
  K = 'K',
  K1622 = 'K1622',
  K1PJ3 = 'K1PJ3',
  K1S654 = 'K1S654',
  K2PJ3 = 'K2PJ3',
  K3F = 'K3F',
  K4F = 'K4F',
  KCO = 'KCO',
  KUNIT = 'KUNIT',
  LASC1 = 'LASC1',
  LASC2 = 'LASC2',
  LASC3 = 'LASC3',
  LAST1 = 'LAST1',
  LAST2 = 'LAST2',
  LAST3 = 'LAST3',
  LEFFD = 'LEFFD',
  LFL = 'LFL',
  LIFE = 'LIFE',
  LND = 'LND',
  MAXTC = 'MAXTC',
  MCNOM = 'MCNOM',
  MCSF = 'MCSF',
  MED = 'MED',
  MELSC = 'MELSC',
  MELSF = 'MELSF',
  MELSQ = 'MELSQ',
  MELU = 'MELU',
  MPSF = 'MPSF',
  MQSF = 'MQSF',
  MRELU = 'MRELU',
  MRSF = 'MRSF',
  N = 'N',
  N1TO = 'N1TO',
  N622 = 'N622',
  N622X06 = 'N622X06',
  NASC1 = 'NASC1',
  NASC2 = 'NASC2',
  NASC3 = 'NASC3',
  NAST1 = 'NAST1',
  NAST2 = 'NAST2',
  NAST3 = 'NAST3',
  NEDPI = 'NEDPI',
  NEDSF = 'NEDSF',
  NEDT = 'NEDT',
  NELSC = 'NELSC',
  NELSF = 'NELSF',
  NELSQ = 'NELSQ',
  NELU = 'NELU',
  PDD = 'PDD',
  QCC = 'QCC',
  QCC_INFO = 'QCC_INFO',
  QCC_INFO2 = 'QCC_INFO2',
  QCF = 'QCF',
  QCF_INFO = 'QCF_INFO',
  QCF_INFO2 = 'QCF_INFO2',
  QPCC = 'QPCC',
  RH = 'RH',
  S1EDCB = 'S1EDCB',
  S1EDCB_INFO = 'S1EDCB_INFO',
  S1EDCB_OK = 'S1EDCB_OK',
  S2EDCA = 'S2EDCA',
  S2EDCA_INFO = 'S2EDCA_INFO',
  S2EDCA_OK = 'S2EDCA_OK',
  SCEC = 'SCEC',
  SCO = 'SCO',
  SFC = 'SFC',
  SFS = 'SFS',
  SIGCC = 'SIGCC',
  SIGCC_INFO = 'SIGCC_INFO',
  SIGRMAX = 'SIGRMAX',
  SIGSF = 'SIGSF',
  SIGSF_INFO = 'SIGSF_INFO',
  SLM = 'SLM',
  SLMY = 'SLMY',
  SLMZ = 'SLMZ',
  SPBC = 'SPBC',
  SPBC_INFO = 'SPBC_INFO',
  SPBT = 'SPBT',
  SPBT_INFO = 'SPBT_INFO',
  SRDM = 'SRDM',
  SREP = 'SREP',
  SRSF = 'SRSF',
  SSAS = 'SSAS',
  STA = 'STA',
  STD = 'STD',
  STMY = 'STMY',
  STMZ = 'STMZ',
  STR_MAX_SF = 'STR_MAX_SF',
  STR_MIN_SF = 'STR_MIN_SF',
  STR_MAX_TO = 'STR_MAX_TO',
  STR_MIN_TO = 'STR_MIN_TO',
  STR_SF = 'STR_SF',
  STR_TO = 'STR_TO',
  T0C = 'T0C',
  TABMI = 'TABMI',
  TACFL = 'TACFL',
  TCO = 'TCO',
  TCOR = 'TCOR',
  TDD = 'TDD',
  TED = 'TED',
  TEF = 'TEF',
  TEF_INFO = 'TEF_INFO',
  TPSF = 'TPSF',
  TRDC = 'TRDC',
  TRDM = 'TRDM',
  TSC = 'TSC',
  TSE = 'TSE',
  TTVV = 'TTVV',
  TTVV_INFO = 'TTVV_INFO',
  TYC = 'TYC',
  UCO = 'UCO',
  UDR = 'UDR',
  UNIT = 'UNIT',
  VED = 'VED',
  VEDI = 'VEDI',
  VEDI_INFO = 'VEDI_INFO',
  VEDR = 'VEDR',
  VEDY = 'VEDY',
  VEDYR = 'VEDYR',
  VEDZ = 'VEDZ',
  VEDZR = 'VEDZR',
  VMC = 'VMC',
  VMY = 'VMY',
  VMZ = 'VMZ',
  VRDC = 'VRDC',
  VRDC_INFO = 'VRDC_INFO',
  VRDCY = 'VRDCY',
  VRDCZ = 'VRDCZ',
  VRDI = 'VRDI',
  VRDM = 'VRDM',
  VRDM_INFO = 'VRDM_INFO',
  VRDMY = 'VRDMY',
  VRDMZ = 'VRDMZ',
  WKF = 'WKF',
  WKF_INFO = 'WKF_INFO',
  WKF_INFO2 = 'WKF_INFO2',
  WMAX = 'WMAX',
  XELU = 'XELU',
  XQC = 'XQC',
  XQC_INFO = 'XQC_INFO',
  XQC_INFO2 = 'XQC_INFO2',
  Z0CO = 'Z0CO',
  Z0CO_INFO = 'Z0CO_INFO',
}