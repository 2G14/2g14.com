import { addDays, diffDays } from '#src/domain/date/day-count.js';
import type { Seireki } from '#src/domain/date/seireki.js';

import { type DateInputValues, parseSeirekiInput } from '../date-input.js';
import type { NoResult } from '../result.js';
import { MAX_YEAR, MIN_YEAR } from '../year-input.js';

export type DaysBetweenResult =
  | NoResult
  | {
      kind: 'ok';
      from: Seireki;
      to: Seireki;
      /** to が from より前なら負 */
      days: number;
    };

function parseDate(label: string, values: DateInputValues) {
  const parsed = parseSeirekiInput(values.year, values.month, values.day);
  return parsed.kind === 'error' ? { ...parsed, message: `${label}: ${parsed.message}` } : parsed;
}

export function calculateDaysBetween(
  from: DateInputValues,
  to: DateInputValues,
): DaysBetweenResult {
  const parsedFrom = parseDate('開始日', from);
  if (parsedFrom.kind !== 'ok') return parsedFrom;
  const parsedTo = parseDate('終了日', to);
  if (parsedTo.kind !== 'ok') return parsedTo;

  return {
    kind: 'ok',
    from: parsedFrom.seireki,
    to: parsedTo.seireki,
    days: diffDays(parsedFrom.seireki, parsedTo.seireki),
  };
}

export type DateAfterResult = NoResult | { kind: 'ok'; base: Seireki; days: number; date: Seireki };

export function calculateDateAfter(base: DateInputValues, days: number | null): DateAfterResult {
  const parsed = parseDate('基準日', base);
  if (parsed.kind !== 'ok') return parsed;
  if (days === null) return { kind: 'empty' };
  if (!Number.isInteger(days)) return { kind: 'error', message: '日数は整数で入力してください。' };

  const date = addDays(parsed.seireki, days);
  if (date.year < MIN_YEAR || date.year > MAX_YEAR) {
    return {
      kind: 'error',
      message: `計算結果が ${MIN_YEAR}〜${MAX_YEAR} 年の範囲を超えます。`,
    };
  }
  return { kind: 'ok', base: parsed.seireki, days, date };
}
