import { useEffect, useState } from 'hono/jsx';

import { isInteger } from './date-input.js';
import { parseQueryNumber } from './date-query.js';
import { replaceUrlQuery } from './url.js';

/**
 * 年の入力値を `?year=` クエリと同期させる。クエリに無ければ fallback を初期値にする。
 */
export function useYearQuery(
  initialYear: string | undefined,
  fallback: number | null = null,
): [number | null, (year: number | null) => void] {
  const [year, setYear] = useState<number | null>(parseQueryNumber(initialYear) ?? fallback);

  useEffect(() => {
    if (!isInteger(year)) return;
    replaceUrlQuery(new URLSearchParams({ year: String(year) }).toString());
  }, [year]);

  return [year, setYear];
}
