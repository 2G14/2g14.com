import { useEffect, useState } from 'hono/jsx';

import { parseQueryNumber, yearQueryString } from './date-query.js';
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
    // 空欄にしたのに year が残ると、再読み込みで消したはずの結果が戻ってしまう
    const query = yearQueryString(year);
    if (query !== null) replaceUrlQuery(query);
  }, [year]);

  return [year, setYear];
}
