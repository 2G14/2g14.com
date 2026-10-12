import { diffDays, fromDayNumber, toDayNumber } from '#src/domain/date/day-count.js';
import { createSeireki } from '#src/domain/date/seireki.js';
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
  // 年から順に入力している途中でエラーを出さないよう、欠けた欄があるうちは未入力として扱う
  if (values.year === null || values.month === null || values.day === null) {
    return { kind: 'empty' } as const;
  }
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

const FIRST_DAY = toDayNumber(createSeireki({ year: MIN_YEAR, month: 1, day: 1 }));
const LAST_DAY = toDayNumber(createSeireki({ year: MAX_YEAR, month: 12, day: 31 }));

export type DateAfterResult = NoResult | { kind: 'ok'; base: Seireki; days: number; date: Seireki };

export function calculateDateAfter(base: DateInputValues, days: number | null): DateAfterResult {
  const parsed = parseDate('基準日', base);
  if (parsed.kind !== 'ok') return parsed;
  if (days === null) return { kind: 'empty' };
  if (!Number.isInteger(days)) return { kind: 'error', message: '日数は整数で入力してください。' };

  // 先に範囲を確かめる。巨大な日数を日付に戻すと丸め誤差で存在しない月日になり、例外になる
  const target = toDayNumber(parsed.seireki) + days;
  if (target < FIRST_DAY || target > LAST_DAY) {
    return {
      kind: 'error',
      message: `計算結果が ${MIN_YEAR}〜${MAX_YEAR} 年の範囲を超えます。`,
    };
  }
  return { kind: 'ok', base: parsed.seireki, days, date: fromDayNumber(target) };
}
