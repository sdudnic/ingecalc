import { EnumENT, EnumSTA, EnumSTD } from '@engine/common/enums';
import * as Common from '@engine/common/functions';

/**
 * PDD Fleche!G52
 * @param AM0D 
 * @param ASTD 
 * @param ASCD 
 * @param BFL 
 * @param ENT 
 * @param GCF 
 * @param GTF 
 * @param HFL 
 * @param HNS 
 * @param LEFFD 
 * @param LND 
 * @param MCSF 
 * @param MPSF 
 * @param MRSF 
 * @param MQSF 
 * @param ARH 
 * @param SCEC 
 * @param STA 
 * @param STD 
 * @param TABMI 
 * @param TACFL 
 * @param LIFE 
 * @param FCK 
 * @param FCM 
 * @param ECM 
 * @param KUNIT 
 * @returns IF(O8="Non";D116;D125)
 */
export default async function PDD(
  AM0D: number,
  ASTD: number,
  ASCD: number,
  BFL: number,
  ENT: EnumENT,
  GCF: number,
  GTF: number,
  HFL: number,
  HNS: number,
  LEFFD: number,
  LND: number,
  MCSF: number,
  MPSF: number,
  MRSF: number,
  MQSF: number,
  ARH: number,
  SCEC: number,
  STA: EnumSTA,
  STD: EnumSTD,
  TABMI: number,
  TACFL: number,
  LIFE: boolean,
  FCK: number,
  FCM: number,
  ECM: number,
  KUNIT: number,
): Promise<number> {

  const moment_W20 = Common.getMoment(STD);
  const d_D79 = Common.getD(HFL, GTF);
  const y_D80 = Common.getY(BFL, HFL, SCEC, ASTD, d_D79, ASCD, GCF);
  const lh_D83 = Common.getLh(BFL, HFL, y_D80, SCEC, ASTD, d_D79, ASCD, GCF);
  const r_D93 = getR_D93(ASTD, BFL, d_D79);
  const fctw_D87 = getFctw_D87(FCK);
  const lv_D95 = getLv_D95(fctw_D87, r_D93);
  const mp_D71 = Common.getMp(ENT, MPSF, LEFFD, moment_W20, AM0D);
  const mc_D72 = Common.getMc(ENT, MCSF, LEFFD, moment_W20, AM0D);
  const mr_D73 = Common.getMr(ENT, MRSF, LEFFD, moment_W20, AM0D);
  const mg_G71 = getMg_G71(mp_D71, mc_D72, mr_D73);
  const x_D81 = Common.getX(SCEC, ASTD, ASCD, BFL, GCF, d_D79);
  const le_D84 = Common.getLe(BFL, x_D81, SCEC, d_D79, ASTD, GCF, ASCD);
  const sg_D89 = getSg_D89(mg_G71, d_D79, x_D81, le_D84, KUNIT, SCEC, LND, LEFFD);
  const mg_D98 = getMg_D98(fctw_D87, sg_D89, r_D93);
  const bctt0_D123 = Common.getBasicBCTT0(STA, TABMI, TACFL, FCM, ARH, HNS);
  const ei_D76 = Common.getEi(ECM);
  const ev_D77 = Common.getEv(ei_D76);
  const flecheGuide_W21 = getFlecheGuide_W21(STD);
  const lfgv_D102 = getLfgv_D102(lh_D83, lv_D95, mg_D98);
  const fgv_D109 = getFgv_D109(mg_G71, LEFFD, flecheGuide_W21, ev_D77, lfgv_D102, KUNIT, LND);
  const li_D96 = getLi_D96(fctw_D87, r_D93);
  const mj_G72 = getMj_G72(mp_D71);
  const sj_D90 = getSj_D90(mj_G72, d_D79, x_D81, le_D84, KUNIT, SCEC, LND, LEFFD);
  const mj_D99 = getMj_D99(fctw_D87, sj_D90, r_D93);
  const lfji_D103 = getLfji_D103(lh_D83, li_D96, mj_D99);
  const fji_D110 = getFji_D110(mj_G72, LEFFD, flecheGuide_W21, ei_D76, lfji_D103, KUNIT, LND);
  const mq_D74 = Common.getMq(ENT, MQSF, LEFFD, moment_W20, AM0D);
  const mp_G73 = getMp_G73(mp_D71, mc_D72, mr_D73, mq_D74);
  const sp_D91 = getSp_D91(mp_G73, d_D79, x_D81, le_D84, KUNIT, SCEC, LND, LEFFD);
  const mp_D100 = getMp_D100(fctw_D87, sp_D91, r_D93);
  const lfpi_D104 = getLfpi_D104(lh_D83, li_D96, mp_D100);
  const fpi_D111 = getFpi_D111(mp_G73, LEFFD, flecheGuide_W21, ei_D76, lfpi_D104, KUNIT, LND);
  const lfgi_D105 = getLfgi_D105(lh_D83, li_D96, mg_D98);
  const fgi_D112 = getFgi_D112(mg_G71, LEFFD, flecheGuide_W21, ei_D76, lfgi_D105, KUNIT, LND);

  if (!LIFE) {
    const dft_D116 = getDft_D116(fgv_D109, fji_D110, fpi_D111, fgi_D112);
    return dft_D116;
  } else {
    const lfjv_D106 = getLfjv_D106(lh_D83, lv_D95, mj_D99);
    const fjv_D113 = getFjv_D113(mj_G72, LEFFD, flecheGuide_W21, ev_D77, lfjv_D106, KUNIT, LND);
    const dft_D125 = getDft_D125(fgv_D109, fji_D110, fpi_D111, fgi_D112, bctt0_D123, fjv_D113);
    return dft_D125;
  }
}

/**
 * D87 fctw
 * @param FCK D86
 * @returns IF(D86<=60;0,6+0,06*D86;0,275*D86^(2/3))
 */
function getFctw_D87(FCK: number): number {
  return FCK <= 60 ? 0.6 + 0.06 * FCK : 0.275 * FCK ** (2 / 3);
}

/**
 * D89 sg
 * @param mgG71 G71
 * @param d D79
 * @param x D81
 * @param le D84
 * @param KUNIT
 * @param SCEC
 * @param LND
 * @param LEFFD
 * @returns G71*($D$79-$D$81)/$D$84*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)/1000000*D36*D20^2/D21^2
 */
function getSg_D89(mgG71: number, d: number, x: number, le: number, KUNIT: number, SCEC: number, LND: number, LEFFD: number): number {
  return mgG71 * (d - x) / le * KUNIT / 1000000 * SCEC * LND ** 2 / LEFFD ** 2;
}

/**
 * D90 sj
 * @param mjG72 G72
 * @param d D79
 * @param x D81
 * @param le D84
 * @param KUNIT
 * @param SCEC
 * @param LND
 * @param LEFFD
 * @returns G72*($D$79-$D$81)/$D$84*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)/1000000*D36*D20^2/D21^2
 */
function getSj_D90(mjG72: number, d: number, x: number, le: number, KUNIT: number, SCEC: number, LND: number, LEFFD: number): number {
  return mjG72 * (d - x) / le * KUNIT / 1000000 * SCEC * LND ** 2 / LEFFD ** 2;
}

/**
 * D91 sp
 * @param mpG73 G73
 * @param d D79
 * @param x D81
 * @param le D84
 * @param KUNIT
 * @param SCEC
 * @param LND
 * @param LEFFD
 * @returns G73*($D$79-$D$81)/$D$84*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)/1000000*D36*D20^2/D21^2
 */
function getSp_D91(mpG73: number, d: number, x: number, le: number, KUNIT: number, SCEC: number, LND: number, LEFFD: number): number {
  return mpG73 * (d - x) / le * KUNIT / 1000000 * SCEC * LND ** 2 / LEFFD ** 2;
}

/**
 * D93 r
 * @param ASTD
 * @param BFL
 * @param d D79
 * @returns D26*0,0001/(D22*D79)
 */
function getR_D93(ASTD: number, BFL: number, d: number): number {
  return ASTD * 0.0001 / (BFL * d);
}

/**
 * D95 lv
 * @param fctw D87
 * @param r D93
 * @returns  0,02*D87/(5*D93)
 */
function getLv_D95(fctw: number, r: number): number {
  return 0.02 * fctw / (5 * r);
}

/**
 * D96 li
 * @param fctw D87
 * @param r D83
 * @returns 0,05*D87/(5*D93)
 */
function getLi_D96(fctw: number, r: number): number {
  return 0.05 * fctw / (5 * r);
}

/**
 * D98 mg
 * @param fctw D87
 * @param sg D89
 * @param r D93
 * @returns MAX(1-1,75*$D$87/(4*D89*$D$93+$D$87);0)
 */
function getMg_D98(fctw: number, sg: number, r: number): number {
  return Math.max(1 - 1.75 * fctw / (4 * sg * r + fctw), 0);
}

/**
 * D99 mj
 * @param fctw D87
 * @param sj D90
 * @param r D93
 * @returns MAX(1-1,75*$D$87/(4*D90*$D$93+$D$87);0)
 */
function getMj_D99(fctw: number, sj: number, r: number): number {
  return Math.max(1 - 1.75 * fctw / (4 * sj * r + fctw), 0);
}

/**
 * D100 mp
 * @param fctw D87
 * @param sp D91
 * @param r D93
 * @returns MAX(1-1,75*$D$87/(4*D91*$D$93+$D$87);0)
 */
function getMp_D100(fctw: number, sp: number, r: number): number {
  return Math.max(1 - 1.75 * fctw / (4 * sp * r + fctw), 0);
}

/**
 * D102 lfgv
 * @param lh D83
 * @param lv D95
 * @param mgD98 D98
 * @returns 1,1*$D$83/(1+D95*D98)
 */
function getLfgv_D102(lh: number, lv: number, mgD98: number): number {
  return 1.1 * lh / (1 + lv * mgD98);
}

/**
 * D103 lfji
 * @param lh D83
 * @param li D96
 * @param mjD99 D99
 * @returns 1,1*$D$83/(1+D96*D99)
 */
function getLfji_D103(lh: number, li: number, mjD99: number): number {
  return 1.1 * lh / (1 + li * mjD99);
}

/**
 * D104 lfpi
 * @param lh D83
 * @param li D96
 * @param mp D100
 * @returns 1,1*$D$83/(1+D96*D100)
 */
function getLfpi_D104(lh: number, li: number, mp: number): number {
  return 1.1 * lh / (1 + li * mp);
}

/**
 * D105 lfgi
 * @param lh D83
 * @param li D96
 * @param mgD98 D98
 * @returns 1,1*$D$83/(1+D96*D98)
 */
function getLfgi_D105(lh: number, li: number, mgD98: number): number {
  return 1.1 * lh / (1 + li * mgD98);
}

/**
 * D106 lfjv
 * @param lh D83
 * @param lv D95
 * @param mjD99 D99
 * @returns 1,1*$D$83/(1+D95*D99)
 */
function getLfjv_D106(lh: number, lv: number, mjD99: number): number {
  return 1.1 * lh / (1 + lv * mjD99);
}

/**
 * fgv - D109
 * @param mgG71 G71
 * @param LEFFD
 * @param w21 W21
 * @param ev D77
 * @param lfgv D102
 * @param KUNIT
 * @param LND
 * @returns G71*$D$21^2/($W$21*$D$77*1000000*D102)*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)*$D$20^4/$D$21^4*100
 */
function getFgv_D109(mgG71: number, LEFFD: number, w21: number, ev: number, lfgv: number, KUNIT: number, LND: number): number {
  return mgG71 * LEFFD ** 2 / (w21 * ev * 1000000 * lfgv) * KUNIT * LND ** 4 / LEFFD ** 4 * 100;
}

/**
 * D110 fji
 * @param mj G72
 * @param LEFFD
 * @param w21 W21
 * @param ei D76
 * @param lfji D103
 * @param KUNIT
 * @param LND
 * @returns G72*$D$21^2/($W$21*$D$76*1000000*D103)*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)*$D$20^4/$D$21^4*100
 */
function getFji_D110(mj: number, LEFFD: number, w21: number, ei: number, lfji: number, KUNIT: number, LND: number): number {
  return mj * LEFFD ** 2 / (w21 * ei * 1000000 * lfji) * KUNIT * LND ** 4 / LEFFD ** 4 * 100;
}

/**
 * D111 fpi
 * @param mpG73 G73
 * @param LEFFD
 * @param w21 W21
 * @param ei D76
 * @param lfpi D104
 * @param KUNIT
 * @param LND
 * @returns G73*$D$21^2/($W$21*$D$76*1000000*D104)*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)*$D$20^4/$D$21^4*100
 */
function getFpi_D111(mpG73: number, LEFFD: number, w21: number, ei: number, lfpi: number, KUNIT: number, LND: number): number {
  return mpG73 * LEFFD ** 2 / (w21 * ei * 1000000 * lfpi) * KUNIT * LND ** 4 / LEFFD ** 4 * 100;
}

/**
 * D112 fgi
 * @param mgG71 G71
 * @param LEFFD
 * @param w21 W21
 * @param ei D76
 * @param lfgi D105
 * @param KUNIT
 * @param LND
 * @returns G71*$D$21^2/($W$21*$D$76*1000000*D105)*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)*$D$20^4/$D$21^4*100
 */
function getFgi_D112(mgG71: number, LEFFD: number, w21: number, ei: number, lfgi: number, KUNIT: number, LND: number): number {
  return mgG71 * LEFFD ** 2 / (w21 * ei * 1000000 * lfgi) * KUNIT * LND ** 4 / LEFFD ** 4 * 100;
}

/**
 * D113 fjv
 * @param mjG72 G72
 * @param LEFFD
 * @param w21 W21
 * @param ev D77
 * @param lfjv D106
 * @param KUNIT
 * @param LND
 * @returns G72*$D$21^2/($W$21*$D$77*1000000*D106)*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)*$D$20^4/$D$21^4*100
 */
function getFjv_D113(mjG72: number, LEFFD: number, w21: number, ev: number, lfjv: number, KUNIT: number, LND: number): number {
  return mjG72 * LEFFD ** 2 / (w21 * ev * 1000000 * lfjv) * KUNIT * LND ** 4 / LEFFD ** 4 * 100;
}

/**
 * D116 dft
 * @param fgv D109
 * @param fji D110
 * @param fpi D111
 * @param fgi D112
 * @returns D109-D110+D111-D112
 */
function getDft_D116(fgv: number, fji: number, fpi: number, fgi: number): number {
  return fgv - fji + fpi - fgi;
}

/**
 * D125 Dft
 * @param dftD109 D109
 * @param fji D110
 * @param fpi D111
 * @param fgi D112
 * @param BCTT0 D123
 * @param fjv D113
 * @returns D109-D110+D111-D112-D123*(D113-D110)
 */
function getDft_D125(dftD109: number, fji: number, fpi: number, fgi: number, BCTT0: number, fjv: number): number {
  return dftD109 - fji + fpi - fgi - BCTT0 * (fjv - fji);
}

/**
 * G71 mg
 * @param mpD71 D71
 * @param mc D72
 * @param mr D73
 * @returns D71+D72+D73
 */
function getMg_G71(mpD71: number, mc: number, mr: number): number {
  return mpD71 + mc + mr;
}

/**
 * G72 mj
 * @param mpD71 D71
 * @returns D71
 */
function getMj_G72(mpD71: number): number {
  return mpD71;
}

/**
 * Gets Mp (t.m) - cell G73
 * Formula: D71+D72+D73+D74
 * @param mpD71 D71
 * @param mc D72
 * @param mr D73
 * @param mq D74
 * @returns Mp (t.m)
 */
function getMp_G73(mpD71: number, mc: number, mr: number, mq: number): number {
  return mpD71 + mc + mr + mq;
}

/**
 * Fléche guide - cell W21
 * @param W15
 * @returns 10 for CBEAM, 4 for CANTILEVER
 */
function getFlecheGuide_W21(STD: EnumSTD): number {
  switch (STD) {
    case EnumSTD.CBEAM: return 10;
    case EnumSTD.CANTILEVER: return 4;
  }
}
