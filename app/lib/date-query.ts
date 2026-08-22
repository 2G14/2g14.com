export interface DateQueryValues {
  era?: string;
  year: string;
  month: string;
  day: string;
}

export function dateQueryString(values: DateQueryValues): string {
  const params = new URLSearchParams();
  if (values.era) params.set('era', values.era);
  if (values.year) params.set('year', values.year);
  if (values.month && values.month !== '1') params.set('month', values.month);
  if (values.day && values.day !== '1') params.set('day', values.day);
  return params.toString();
}

export function dateToolUrl(base: string, values: DateQueryValues | null): string {
  if (!values) return base;
  const qs = dateQueryString(values);
  return qs ? `${base}?${qs}` : base;
}
