export interface DateInput {
  year: number;
  month: number;
  day: number;
}

export function isInteger(value: number | null): value is number {
  return value !== null && Number.isInteger(value);
}

export function parseDateInput(
  year: number | null,
  month: number | null,
  day: number | null,
): DateInput | { error: string } | null {
  if (year === null) return null;

  if (!isInteger(year) || !isInteger(month) || !isInteger(day)) {
    return { error: '年・月・日は整数で入力してください。' };
  }

  return { year, month, day };
}
