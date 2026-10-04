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
