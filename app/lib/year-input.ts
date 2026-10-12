import type { NoResult } from './result.js';

// 年の入力欄(DateField)の範囲。西暦 0 年や紀元前はグレゴリオ暦の年番号として扱わない
export const MIN_YEAR = 1;
export const MAX_YEAR = 9999;

export type ParsedYearInput = NoResult | { kind: 'ok'; year: number };

export function parseYearInput(year: number | null): ParsedYearInput {
  if (year === null) return { kind: 'empty' };
  if (!Number.isInteger(year)) return { kind: 'error', message: '年は整数で入力してください。' };
  if (year < MIN_YEAR || year > MAX_YEAR) {
    return { kind: 'error', message: `年は ${MIN_YEAR}〜${MAX_YEAR} の範囲で入力してください。` };
  }
  return { kind: 'ok', year };
}
