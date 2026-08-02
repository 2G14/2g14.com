export interface DateInput {
  year: number;
  month: number;
  day: number;
}

export function parseDateInput(
  yearStr: string,
  monthStr: string,
  dayStr: string,
): DateInput | { error: string } | null {
  if (!yearStr) return null;

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return { error: '年・月・日は整数で入力してください。' };
  }

  return { year, month, day };
}
