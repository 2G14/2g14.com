import { fromDayNumber, toDayNumber } from '../date/day-count.js';
import type { Seireki } from '../date/seireki.js';

// 天文計算は Jean Meeus『Astronomical Algorithms』（第 2 版）の式による。
// 時刻はユリウス日で扱い、JD は世界時（UT）、JDE は力学時（TT）を表す。

const UNIX_EPOCH_JD = 2440587.5;
const JST_OFFSET_DAYS = 9 / 24;
export const RAD = Math.PI / 180;

export function sinDeg(degrees: number): number {
  return Math.sin(degrees * RAD);
}

export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/**
 * 地球の自転の遅れ ΔT = TT − UT（秒）。Espenak & Meeus の多項式近似で、1900〜2150 年に対応する。
 */
function deltaTSeconds(year: number): number {
  if (year < 1920) {
    const t = year - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4;
  }
  if (year < 1941) {
    const t = year - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3;
  }
  if (year < 1961) {
    const t = year - 1950;
    return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547;
  }
  if (year < 1986) {
    const t = year - 1975;
    return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718;
  }
  if (year < 2005) {
    const t = year - 2000;
    return (
      63.86 +
      0.3345 * t -
      0.060374 * t ** 2 +
      0.0017275 * t ** 3 +
      0.000651814 * t ** 4 +
      0.00002373599 * t ** 5
    );
  }
  if (year < 2050) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t ** 2;
  }
  return -20 + 32 * ((year - 1820) / 100) ** 2 - 0.5628 * (2150 - year);
}

function jdeToJd(jde: number): number {
  const year = 2000 + (jde - 2451545) / 365.25;
  return jde - deltaTSeconds(year) / 86400;
}

/** 力学時のユリウス日を、その瞬間の日本時間の日付（通算日番号）にする */
export function jdeToJstDayNumber(jde: number): number {
  return Math.floor(jdeToJd(jde) - UNIX_EPOCH_JD + JST_OFFSET_DAYS);
}

export function jdeToJstDate(jde: number): Seireki {
  return fromDayNumber(jdeToJstDayNumber(jde));
}

/** 日本時間のその日の正午（力学時のユリウス日）。探索の初期値に使う */
export function jstNoonJde(date: Seireki): number {
  return toDayNumber(date) + UNIX_EPOCH_JD + 0.5 - JST_OFFSET_DAYS;
}
