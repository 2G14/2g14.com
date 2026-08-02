import { useEffect, useState } from 'hono/jsx';

import { etoFromYear, JUNISHI, type Kanshi, yearsForJunishi } from '#src/domain/eto/eto.js';
import { warekiYearLabel } from '#src/domain/wareki/year-label.js';

function tryLookup(yearStr: string): { year: number; eto: Kanshi } | { error: string } | null {
  if (!yearStr) return null;

  const year = Number(yearStr);
  if (!Number.isInteger(year)) {
    return { error: '年は整数で入力してください。' };
  }

  try {
    return { year, eto: etoFromYear(year) };
  } catch (e) {
    if (e instanceof Error) return { error: e.message };
    return { error: '検索中にエラーが発生しました。' };
  }
}

interface Props {
  initialYear?: string | undefined;
}

export default function EtoYearSearch({ initialYear }: Props) {
  const [year, setYear] = useState(initialYear ?? String(new Date().getFullYear()));

  useEffect(() => {
    const params = new URLSearchParams();
    if (year) params.set('year', year);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    history.replaceState(null, '', url);
  }, [year]);

  const result = tryLookup(year);

  const sameJunishiYears = (() => {
    if (!result || 'error' in result) return [];
    const junishiIndex = JUNISHI.findIndex((j) => j.kanji === result.eto.junishi.kanji);
    return yearsForJunishi(junishiIndex, result.year - 24, result.year + 24);
  })();

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">西暦年</h2>
          <div class="mt-4 flex items-end gap-3">
            <label class="form-control w-24">
              <div class="label">
                <span class="label-text">年</span>
              </div>
              <input
                type="number"
                value={year}
                min="1"
                max="9999"
                class="input-bordered input w-full"
                onInput={(e) => setYear((e.target as HTMLInputElement).value)}
              />
            </label>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">干支</h2>
          {result ? (
            'error' in result ? (
              <div role="alert" class="mt-2 alert alert-error">
                <span>{result.error}</span>
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
                  {sameJunishiYears.map((y) => (
                    <a
                      href={`/contents/eto/search-by-year?year=${y}`}
                      class={`btn btn-xs ${y === result.year ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setYear(String(y));
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
            )
          ) : (
            <p class="mt-2 text-base-content/50">西暦年を入力すると干支を表示します。</p>
          )}
        </div>
      </div>
    </div>
  );
}
