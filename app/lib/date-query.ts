export interface DateQueryValues {
  era?: string;
  year: number;
  month: number;
  day: number;
}

export function parseQueryNumber(raw?: string): number | null {
  if (!raw) return null;
  const value = Number(raw);
  return Number.isInteger(value) ? value : null;
}

/**
 * 年の入力値を URL クエリにする。空欄なら空文字（クエリを消す）、
 * 整数でなければ null（URL を変えない）を返す。
 */
export function yearQueryString(year: number | null): string | null {
  if (year === null) return '';
  if (!Number.isInteger(year)) return null;
  return new URLSearchParams({ year: String(year) }).toString();
}

export function dateQueryString(values: DateQueryValues): string {
  const params = new URLSearchParams();
  if (values.era) params.set('era', values.era);
  params.set('year', String(values.year));
  params.set('month', String(values.month));
  params.set('day', String(values.day));
  return params.toString();
}

export function dateToolUrl(base: string, values: DateQueryValues | null): string {
  if (!values) return base;
  const qs = dateQueryString(values);
  return qs ? `${base}?${qs}` : base;
}
