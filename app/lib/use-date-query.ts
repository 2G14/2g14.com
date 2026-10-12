import { useEffect, useState } from 'hono/jsx';

import { dateInputQueryString } from './date-query.js';
import { replaceUrlQuery } from './url.js';

interface DateValues {
  year: number | null;
  month: number | null;
  day: number | null;
}

/**
 * 年月日の入力値を `?year=&month=&day=` クエリと同期させる。
 */
export function useDateQuery(initial: DateValues): DateValues & {
  setYear: (year: number | null) => void;
  setMonth: (month: number | null) => void;
  setDay: (day: number | null) => void;
} {
  const [year, setYear] = useState<number | null>(initial.year);
  const [month, setMonth] = useState<number | null>(initial.month);
  const [day, setDay] = useState<number | null>(initial.day);

  useEffect(() => {
    const query = dateInputQueryString({ year, month, day });
    if (query !== null) replaceUrlQuery(query);
  }, [year, month, day]);

  return { year, month, day, setYear, setMonth, setDay };
}
