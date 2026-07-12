interface JSTDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export function todayInJST(): JSTDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)!.value);

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
  };
}
