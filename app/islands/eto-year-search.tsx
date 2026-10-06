import { useEffect, useState } from 'hono/jsx';

import DateField from '#app/components/date-field.js';
import { isInteger } from '#app/lib/date-input.js';
import { lookupEto } from '#app/lib/eto/eto-result.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import { parseQueryNumber } from '#app/lib/wareki/date-query.js';
import { warekiYearLabel } from '#src/domain/wareki/year-label.js';
import { todayInJST } from '#src/lib/date.js';

interface Props {
  initialYear?: string | undefined;
}

export default function EtoYearSearch({ initialYear }: Props) {
  const [year, setYear] = useState<number | null>(
    parseQueryNumber(initialYear) ?? todayInJST().year,
  );

  useEffect(() => {
    if (!isInteger(year)) return;
    replaceUrlQuery(new URLSearchParams({ year: String(year) }).toString());
  }, [year]);

  const result = lookupEto(year);

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">西暦年</h2>
          <div class="mt-4 flex items-end gap-3">
            <DateField label="年" value={year} max={9999} widthClass="w-24" onInput={setYear} />
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">干支</h2>
          {result.kind === 'empty' ? (
            <p class="mt-2 text-base-content/50">西暦年を入力すると干支を表示します。</p>
          ) : result.kind === 'error' ? (
            <div role="alert" class="mt-2 alert alert-error">
              <span>{result.message}</span>
            </div>
          ) : (
            <div class="mt-2 flex flex-col items-center gap-3">
              <p class="text-4xl font-bold">
                {result.eto.junishi.kanji}
                <span class="ml-1 text-2xl">（{result.eto.junishi.kana}）</span>
              </p>
              <p class="text-xl">
                {result.eto.junishi.animal} {result.eto.junishi.emoji}
              </p>
              <div class="text-center text-sm text-base-content/60">
                <p>
                  十干十二支: {result.eto.kanji}（{result.eto.reading}）・六十干支の{' '}
                  {result.eto.kanshiNumber} 番目
                </p>
                {warekiYearLabel(result.year) && <p>{warekiYearLabel(result.year)}</p>}
              </div>
              <div class="flex flex-wrap justify-center gap-1">
                {result.sameJunishiYears.map((y) => (
                  <a
                    href={`/contents/eto/search-by-year?year=${y}`}
                    class={`btn btn-xs ${y === result.year ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setYear(y);
                    }}
                  >
                    {y}年
                  </a>
                ))}
              </div>
              <a href={`/contents/age/calculate?year=${result.year}`} class="link text-sm">
                この年生まれの年齢を計算する →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
