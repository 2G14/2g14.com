import type { NoResult } from './result.js';

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
