import type { Seireki } from './seireki.js';

/**
 * グレゴリオ暦の日付を通算日番号に変換する（Howard Hinnant の days-from-civil）。
 * 1970-01-01 を 0 とし、タイムゾーンに依存しない純粋計算で日数差を扱えるようにする。
 */
export function toDayNumber(date: Seireki): number {
  const y = date.month <= 2 ? date.year - 1 : date.year;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (date.month + (date.month > 2 ? -3 : 9)) + 2) / 5) + date.day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function diffDays(from: Seireki, to: Seireki): number {
  return toDayNumber(to) - toDayNumber(from);
}
