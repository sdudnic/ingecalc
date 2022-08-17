import * as Common from '../common/functions';
import { EnumENT, EnumSTD } from '../common/enums';

/**
 * TDD
 * Excel: Fleche!G60
 * @param LEFFD
 * @param QPCC
 * @param STD
 * @param ENT
 * @param MPSF
 * @param AM0D
 * @param MCSF
 * @param MRSF
 * @param MQSF
 * @param BFL
 * @param SCEC
 * @param HFL
 * @param GTF
 * @param ASTD
 * @param ASCD
 * @param GCF
 * @param FCTM
 * @param KUNIT
 * @param ECM
 * @returns
 */
export default async function TDD(
  LEFFD: number,
  QPCC: number,
  STD: EnumSTD,
  ENT: EnumENT,
  MPSF: number,
  AM0D: number,
  MCSF: number,
  MRSF: number,
  MQSF: number,
  BFL: number,
  SCEC: number,
  HFL: number,
  GTF: number,
  ASTD: number,
  ASCD: number,
  GCF: number,
  FCTM: number,
  KUNIT: number,
  ECM: number,
): Promise<number> {

  // D130 fctm
  const moment = Common.getMoment(STD); // W20
  const flecheTotal: number = Common.getFlecheTotal(STD); // W22

  const mpD71: number = Common.getMp(ENT, MPSF, LEFFD, moment, AM0D);
  const mc: number = Common.getMc(ENT, MCSF, LEFFD, moment, AM0D);
  const mr: number = Common.getMr(ENT, MRSF, LEFFD, moment, AM0D);
  const mq: number = Common.getMq(ENT, MQSF, LEFFD, moment, AM0D);
  const ei: number = Common.getEi(ECM);
  const ev: number = Common.getEv(ei);
  const d: number = Common.getD(HFL, GTF);
  const x: number = Common.getX(SCEC, ASTD, ASCD, BFL, GCF, d);
  const le: number = Common.getLe(BFL, x, SCEC, d, ASTD, GCF, ASCD);
  const wet: number = D137(LEFFD, flecheTotal, mpD71, mc, mr, mq, QPCC, ev, le, KUNIT);
  const fctmfl: number = D131(HFL, FCTM);
  const y: number = Common.getY(BFL, HFL, SCEC, ASTD, d, ASCD, GCF);
  const lh = Common.getLh(BFL, HFL, y, SCEC, ASTD, d, ASCD, GCF);
  const mcr: number = D133(fctmfl, lh, HFL, y, KUNIT);
  const zt: number = D135(mcr, mpD71, mc, mr, mq, QPCC);
  const wht: number = D138(LEFFD, flecheTotal, mpD71, mc, mr, mq, QPCC, ev, lh, KUNIT);

  const result: number = D139(wet, zt, wht);
  return result;
}

/**
 * Fleche!D131 fctmfl
 * @param HFL
 * @param FCTM Fleche!D130
 * @returns MAX((1,6-D23)*$D$130;$D$130)
 */
function D131(HFL: number, FCTM: number): number {
  return Math.max((1.6 - HFL) * FCTM, FCTM);
}

/**
 * Fleche!D133 mcr
 * @param fctml D131
 * @param lh D83
 * @param HFL
 * @param y D80
 * @param KUNIT
 * @returns D131*1000000*D83/(D23-D80)/VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)
 */
function D133(fctmfl: number, lh: number, HFL: number, y: number, KUNIT: number): number {
  return fctmfl * 1000000 * lh / (HFL - y) / KUNIT;
}

/**
 * Fleche!D135 zt
 * @param mcr D133
 * @param mpD71 D71
 * @param mc D72
 * @param mr D73
 * @param mq D74
 * @returns MAX(0;1-0,5*POWER(D133/(D71+D72+D73+D74*D11);2))
 */
function D135(mcr: number, mpD71: number, mc: number, mr: number, mq: number, QPCC: number): number {
  return Math.max(0, 1 - 0.5 * Math.pow(mcr / (mpD71 + mc + mr + mq * QPCC), 2));
}

/**
 * Fleche!D137 wet
 * @param LEFFD
 * @param W22 W22
 * @param mpD71 D71
 * @param mc D72
 * @param mr D73
 * @param mq D74
 * @param QPCC
 * @param ev D77
 * @param le D84
 * @param KUNIT
 * @returns ($D$21*$D$21/$W$22)*(($D$71+$D$72+$D$73+$D$74*$D$11*1)/($D$77*1000000*$D$84))*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)*100
 */
function D137(LEFFD: number, w22: number, mpD71: number, mc: number, mr: number, mq: number, QPCC: number, ev: number, le: number, KUNIT: number): number {
  return (LEFFD * LEFFD / w22) * ((mpD71 + mc + mr + mq * QPCC * 1) / (ev * 1000000 * le)) * KUNIT * 100;
}

/**
 * Fleche!D138 wht
 * @param LEFFD
 * @param W22 W22
 * @param mpD71 D71
 * @param mc D72
 * @param mr D73
 * @param mq D74
 * @param QPCC
 * @param ev D77
 * @param lh D83
 * @param KUNIT
 * @returns ($D$21*$D$21/$W$22)*(($D$71+$D$72+$D$73+$D$74*$D$11*1)/($D$77*1000000*$D$83))*VLOOKUP($O$7;$Q$9:$R$11;2;FALSE)*100
 */
function D138(LEFFD: number, W22: number, mpD71: number, mc: number, mr: number, mq: number, QPCC: number, ev: number, lh: number, KUNIT: number): number {
  return (LEFFD * LEFFD / W22) * ((mpD71 + mc + mr + mq * QPCC * 1) / (ev * 1000000 * lh)) * KUNIT * 100;
}

/**
 * Fleche!D139 wt
 * @param wet D137
 * @param zt D135
 * @param wht D138
 * @returns D137*D135+D138*(1-D135)
 */
function D139(wet: number, zt: number, wht: number): number {
  //=D137*D135+D138*(1-D135)
  return wet * zt + wht * (1 - zt);
}
