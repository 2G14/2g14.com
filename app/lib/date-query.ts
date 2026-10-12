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

/**
 * 年月日の入力値を URL クエリにする。3 つとも整数ならそのクエリ、
 * 整数でない値があれば null（URL を変えない）、欠けた欄があれば空文字（クエリを消す）を返す。
 */
export function dateInputQueryString(values: {
  year: number | null;
  month: number | null;
  day: number | null;
}): string | null {
  const fields = [values.year, values.month, values.day];
  if (fields.some((v) => v !== null && !Number.isInteger(v))) return null;
  const { year, month, day } = values;
  // 欠けた欄を残して書くと、再読み込みで欠けた分が初期値で埋まり、入力と違う日付になる
  if (year === null || month === null || day === null) return '';
  return dateQueryString({ year, month, day });
}

export function dateToolUrl(base: string, values: DateQueryValues | null): string {
  if (!values) return base;
  const qs = dateQueryString(values);
  return qs ? `${base}?${qs}` : base;
}

function pad(n: number, width: number): string {
  // 負の値に 0 を詰めると「00-1」のように読み戻せない文字列になる
  return n < 0 ? String(n) : String(n).padStart(width, '0');
}

/**
 * 日付を 2 つ以上クエリに載せるページは year/month/day の組を使えないため、
 * 1 つの値にまとめる。正しい日付なら YYYY-MM-DD になる。
 * 範囲外の年や存在しない月日も、再読み込みで同じエラーを出せるようそのまま載せる。
 */
export function dateParamString(values: { year: number; month: number; day: number }): string {
  return `${pad(values.year, 4)}-${pad(values.month, 2)}-${pad(values.day, 2)}`;
}

export function parseDateParam(raw?: string): { year: number; month: number; day: number } | null {
  const match = raw?.match(/^(-?\d+)-(-?\d+)-(-?\d+)$/u);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}
