import { KOYOMI_MAX_YEAR, KOYOMI_MIN_YEAR } from '#src/domain/koyomi/range.js';

import { parseQueryNumber } from '../date-query.js';

/** クエリの年を暦の対応範囲で読む。範囲外や読めない値なら fallback を返す */
export function parseKoyomiYear(raw: string | undefined, fallback: number): number {
  const year = parseQueryNumber(raw);
  return year !== null && year >= KOYOMI_MIN_YEAR && year <= KOYOMI_MAX_YEAR ? year : fallback;
}

/** クエリの月を 1〜12 で読む。範囲外や読めない値なら fallback を返す */
export function parseMonth(raw: string | undefined, fallback: number): number {
  const month = parseQueryNumber(raw);
  return month !== null && month >= 1 && month <= 12 ? month : fallback;
}

interface YearMonth {
  year: number;
  month: number;
}

/** 前後の月。暦の対応範囲を出る場合は null */
export function shiftMonth({ year, month }: YearMonth, delta: -1 | 1): YearMonth | null {
  const index = year * 12 + (month - 1) + delta;
  const shifted = { year: Math.floor(index / 12), month: (index % 12) + 1 };
  return shifted.year >= KOYOMI_MIN_YEAR && shifted.year <= KOYOMI_MAX_YEAR ? shifted : null;
}

/** 前後の年。暦の対応範囲を出る場合は null */
export function shiftYear(year: number, delta: -1 | 1): number | null {
  const shifted = year + delta;
  return shifted >= KOYOMI_MIN_YEAR && shifted <= KOYOMI_MAX_YEAR ? shifted : null;
}
