export interface DateQueryValues {
  era?: string;
  year: number | null;
  month: number | null;
  day: number | null;
}

export function parseQueryNumber(raw?: string): number | null {
  if (!raw) return null;
  const value = Number(raw);
  return Number.isInteger(value) ? value : null;
}

export function dateQueryString(values: DateQueryValues): string {
  const params = new URLSearchParams();
  if (values.era) params.set('era', values.era);
  if (values.year !== null) params.set('year', String(values.year));
  if (values.month !== null && values.month !== 1) params.set('month', String(values.month));
  if (values.day !== null && values.day !== 1) params.set('day', String(values.day));
  return params.toString();
}

export function dateToolUrl(base: string, values: DateQueryValues | null): string {
  if (!values) return base;
  const qs = dateQueryString(values);
  return qs ? `${base}?${qs}` : base;
}
