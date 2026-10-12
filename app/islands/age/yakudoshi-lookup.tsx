import { useEffect, useState } from 'hono/jsx';

import YakudoshiTable from '#app/components/age/yakudoshi-table.js';
import DateField from '#app/components/date-field.js';
import { lookupYakudoshi } from '#app/lib/age/yakudoshi-result.js';
import { parseQueryNumber, yearQueryString } from '#app/lib/date-query.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import { todayInJST } from '#src/lib/date.js';

interface Props {
  initialYear?: string | undefined;
}

export default function YakudoshiLookup({ initialYear }: Props) {
  const [year, setYear] = useState<number | null>(parseQueryNumber(initialYear));

  useEffect(() => {
    // 空欄にしたのに year が残ると、再読み込みで消したはずの結果が戻ってしまう
    const query = yearQueryString(year);
    if (query !== null) replaceUrlQuery(query);
  }, [year]);

  const result = lookupYakudoshi(year);
  const currentYear = todayInJST().year;

  return (
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title">生まれ年から厄年を調べる</h2>
        <div class="mt-2 flex items-end gap-3">
          <DateField
            label="生まれ年（西暦）"
            value={year}
            max={9999}
            widthClass="w-32"
            onInput={setYear}
          />
        </div>
        {result.kind === 'empty' ? (
          <p class="mt-2 text-base-content/50">生まれ年を入力すると厄年の年を表示します。</p>
        ) : result.kind === 'error' ? (
          <div role="alert" class="mt-2 alert alert-error">
            <span>{result.message}</span>
          </div>
        ) : (
          <div class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section>
              <h3 class="font-semibold">男性</h3>
              <YakudoshiTable
                caption={`${result.birthYear}年生まれの男性の厄年`}
                periods={result.male}
                show="year"
                highlightYear={currentYear}
              />
            </section>
            <section>
              <h3 class="font-semibold">女性</h3>
              <YakudoshiTable
                caption={`${result.birthYear}年生まれの女性の厄年`}
                periods={result.female}
                show="year"
                highlightYear={currentYear}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
