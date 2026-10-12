import { sinDeg } from './time.js';

// 天文計算は Jean Meeus『Astronomical Algorithms』（第 2 版）の式による。JDE は力学時のユリウス日。

const SYNODIC_MONTH_DAYS = 29.530588861;
const NEW_MOON_EPOCH_JDE = 2451550.09766;

const NEW_MOON_TERMS: readonly (readonly [number, (a: MoonArguments) => number])[] = [
  [-0.4072, (a) => sinDeg(a.mp)],
  [0.17241, (a) => a.e * sinDeg(a.m)],
  [0.01608, (a) => sinDeg(2 * a.mp)],
  [0.01039, (a) => sinDeg(2 * a.f)],
  [0.00739, (a) => a.e * sinDeg(a.mp - a.m)],
  [-0.00514, (a) => a.e * sinDeg(a.mp + a.m)],
  [0.00208, (a) => a.e ** 2 * sinDeg(2 * a.m)],
  [-0.00111, (a) => sinDeg(a.mp - 2 * a.f)],
  [-0.00057, (a) => sinDeg(a.mp + 2 * a.f)],
  [0.00056, (a) => a.e * sinDeg(2 * a.mp + a.m)],
  [-0.00042, (a) => sinDeg(3 * a.mp)],
  [0.00042, (a) => a.e * sinDeg(a.m + 2 * a.f)],
  [0.00038, (a) => a.e * sinDeg(a.m - 2 * a.f)],
  [-0.00024, (a) => a.e * sinDeg(2 * a.mp - a.m)],
  [-0.00017, (a) => sinDeg(a.omega)],
  [-0.00007, (a) => sinDeg(a.mp + 2 * a.m)],
  [0.00004, (a) => sinDeg(2 * a.mp - 2 * a.f)],
  [0.00004, (a) => sinDeg(3 * a.m)],
  [0.00003, (a) => sinDeg(a.mp + a.m - 2 * a.f)],
  [0.00003, (a) => sinDeg(2 * a.mp + 2 * a.f)],
  [-0.00003, (a) => sinDeg(a.mp + a.m + 2 * a.f)],
  [0.00003, (a) => sinDeg(a.mp - a.m + 2 * a.f)],
  [-0.00002, (a) => sinDeg(a.mp - a.m - 2 * a.f)],
  [-0.00002, (a) => sinDeg(3 * a.mp + a.m)],
  [0.00002, (a) => sinDeg(4 * a.mp)],
];

/** 惑星による摂動の補正項 [係数, 定数, k の係数] */
const PLANETARY_TERMS: readonly (readonly [number, number, number])[] = [
  [0.000165, 251.88, 0.016321],
  [0.000164, 251.83, 26.651886],
  [0.000126, 349.42, 36.412478],
  [0.00011, 84.66, 18.206239],
  [0.000062, 141.74, 53.303771],
  [0.00006, 207.14, 2.453732],
  [0.000056, 154.84, 7.30686],
  [0.000047, 34.52, 27.261239],
  [0.000042, 207.19, 0.121824],
  [0.00004, 291.34, 1.844379],
  [0.000037, 161.72, 24.198154],
  [0.000035, 239.56, 25.513099],
  [0.000023, 331.55, 3.592518],
];

interface MoonArguments {
  e: number;
  m: number;
  mp: number;
  f: number;
  omega: number;
}

/**
 * k 番目の朔（新月）の時刻（力学時のユリウス日）。k = 0 は 2000 年 1 月 6 日の朔。
 * Meeus 第 49 章の式で、誤差は数十秒以内。
 */
export function newMoonJde(k: number): number {
  const t = k / 1236.85;
  const jde =
    NEW_MOON_EPOCH_JDE +
    SYNODIC_MONTH_DAYS * k +
    0.00015437 * t ** 2 -
    0.00000015 * t ** 3 +
    0.00000000073 * t ** 4;
  const args: MoonArguments = {
    e: 1 - 0.002516 * t - 0.0000074 * t ** 2,
    m: 2.5534 + 29.1053567 * k - 0.0000014 * t ** 2 - 0.00000011 * t ** 3,
    mp:
      201.5643 + 385.81693528 * k + 0.0107582 * t ** 2 + 0.00001238 * t ** 3 - 0.000000058 * t ** 4,
    f:
      160.7108 + 390.67050284 * k - 0.0016118 * t ** 2 - 0.00000227 * t ** 3 + 0.000000011 * t ** 4,
    omega: 124.7746 - 1.56375588 * k + 0.0020672 * t ** 2 + 0.00000215 * t ** 3,
  };

  const lunar = NEW_MOON_TERMS.reduce(
    (sum, [coefficient, term]) => sum + coefficient * term(args),
    0,
  );
  const planetary =
    0.000325 * sinDeg(299.77 + 0.107408 * k - 0.009173 * t ** 2) +
    PLANETARY_TERMS.reduce((sum, [coefficient, a, b]) => sum + coefficient * sinDeg(a + b * k), 0);

  return jde + lunar + planetary;
}

/** jde 以前で最も近い朔の番号 */
export function newMoonIndexOnOrBefore(jde: number): number {
  let k = Math.floor((jde - NEW_MOON_EPOCH_JDE) / SYNODIC_MONTH_DAYS);
  while (newMoonJde(k + 1) <= jde) k++;
  while (newMoonJde(k) > jde) k--;
  return k;
}
