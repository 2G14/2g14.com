import { createSeireki, type Seireki } from '#src/domain/date/seireki.js';

import type { NoResult } from './result.js';
import { MIN_YEAR } from './year-input.js';

interface DateInput {
  year: number;
  month: number;
  day: number;
}

export type ParsedDateInput = NoResult | { kind: 'ok'; date: DateInput };

export function isInteger(value: number | null): value is number {
  return value !== null && Number.isInteger(value);
}

export function parseDateInput(
  year: number | null,
  month: number | null,
  day: number | null,
): ParsedDateInput {
  if (year === null) return { kind: 'empty' };

  if (!isInteger(year) || !isInteger(month) || !isInteger(day)) {
    return { kind: 'error', message: '年・月・日は整数で入力してください。' };
  }

  return { kind: 'ok', date: { year, month, day } };
}

export type ParsedSeirekiInput = NoResult | { kind: 'ok'; seireki: Seireki };

/**
 * 年月日の入力を、入力欄の下限（1 年）以降の実在する日付として読む。
 */
export function parseSeirekiInput(
  year: number | null,
  month: number | null,
  day: number | null,
): ParsedSeirekiInput {
  const parsed = parseDateInput(year, month, day);
  if (parsed.kind !== 'ok') return parsed;
  if (parsed.date.year < MIN_YEAR) {
    return { kind: 'error', message: `年は${MIN_YEAR}以上で入力してください。` };
  }

  try {
    return { kind: 'ok', seireki: createSeireki(parsed.date) };
  } catch (e) {
    if (e instanceof Error) return { kind: 'error', message: e.message };
    return { kind: 'error', message: '日付を読み取れませんでした。' };
  }
}
