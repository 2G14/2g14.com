import { useEffect, useState } from 'hono/jsx';

import SeirekiCalendar from '#app/components/seireki-calendar.js';
import {
  calculateFullAge,
  calculateKazoedoshi,
  daysSinceBirth,
  monthsSinceBirth,
  type NextBirthday,
  nextBirthday,
  weeksSinceBirth,
} from '#src/domain/age/age.js';
import { createSeireki, type Seireki } from '#src/domain/date/seireki.js';
import { etoFromYear, type Kanshi } from '#src/domain/eto/eto.js';
import { seirekiToWareki } from '#src/domain/wareki/conversion.js';
import type { Wareki } from '#src/domain/wareki/wareki.js';

interface AgeResult {
  birth: Seireki;
  fullAge: number;
  kazoedoshi: number;
  next: NextBirthday;
  days: number;
  weeks: number;
  months: number;
  wareki: Wareki | null;
  eto: Kanshi;
}

function tryCalculate(
  yearStr: string,
  monthStr: string,
  dayStr: string,
): AgeResult | { error: string } | null {
  if (!yearStr) return null;

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return { error: '年・月・日は整数で入力してください。' };
  }

  try {
    const now = new Date();
    const today = createSeireki({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    });
    const birth = createSeireki({ year, month, day });

    return {
      birth,
      fullAge: calculateFullAge(birth, today),
      kazoedoshi: calculateKazoedoshi(birth, today),
      next: nextBirthday(birth, today),
      days: daysSinceBirth(birth, today),
      weeks: weeksSinceBirth(birth, today),
      months: monthsSinceBirth(birth, today),
      wareki: seirekiToWareki(birth),
      eto: etoFromYear(birth.year),
    };
  } catch (e) {
    if (e instanceof Error) return { error: e.message };
    return { error: '計算中にエラーが発生しました。' };
  }
}

interface Props {
  initialYear?: string | undefined;
  initialMonth?: string | undefined;
  initialDay?: string | undefined;
}

export default function AgeCalculator({ initialYear, initialMonth, initialDay }: Props) {
  // 年だけクエリで渡された場合（干支検索からの遷移など）は 1/1 を初期値にする
  const [year, setYear] = useState(initialYear ?? '');
  const [month, setMonth] = useState(initialMonth ?? (initialYear ? '1' : ''));
  const [day, setDay] = useState(initialDay ?? (initialYear ? '1' : ''));
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (year) params.set('year', year);
    if (month && month !== '1') params.set('month', month);
    if (day && day !== '1') params.set('day', day);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    history.replaceState(null, '', url);
  }, [year, month, day]);

  const result = tryCalculate(year, month, day);

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">生年月日（西暦）</h2>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            <label class="form-control w-20">
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
            <label class="form-control w-14">
              <div class="label">
                <span class="label-text">月</span>
              </div>
              <input
                type="number"
                value={month}
                min="1"
                max="12"
                class="input-bordered input w-full"
                onInput={(e) => setMonth((e.target as HTMLInputElement).value)}
              />
            </label>
            <label class="form-control w-14">
              <div class="label">
                <span class="label-text">日</span>
              </div>
              <input
                type="number"
                value={day}
                min="1"
                max="31"
                class="input-bordered input w-full"
                onInput={(e) => setDay((e.target as HTMLInputElement).value)}
              />
            </label>
            <button
              type="button"
              class="btn btn-square btn-ghost btn-sm"
              onClick={() => setCalendarOpen(!calendarOpen)}
              title="カレンダーで選択"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="h-5 w-5"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          </div>
          {calendarOpen && (
            <SeirekiCalendar
              year={year}
              month={month}
              day={day}
              onDateSelect={(y, m, d) => {
                setYear(y);
                setMonth(m);
                setDay(d);
              }}
            />
          )}
          <p class="mt-4 text-xs text-base-content/50">
            ※ 満年齢は誕生日当日に加齢する一般的な数え方です（法律上は誕生日の前日に加齢）。
            2月29日生まれは平年では3月1日に加齢するものとして扱います。
          </p>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">計算結果</h2>
          {result ? (
            'error' in result ? (
              <div role="alert" class="mt-2 alert alert-error">
                <span>{result.error}</span>
              </div>
            ) : (
              <div class="mt-2 flex flex-col gap-4">
                <p class="text-center text-4xl font-bold">
                  満 {result.fullAge} 歳
                  <span class="ml-3 text-xl font-normal text-base-content/60">
                    （数え {result.kazoedoshi} 歳）
                  </span>
                </p>

                <div class="text-sm">
                  <p>
                    次の誕生日:{' '}
                    {result.next.daysUntil === 0
                      ? `本日が誕生日です 🎉（${result.next.turningAge} 歳）`
                      : `${result.next.date.year}年${result.next.date.month}月${result.next.date.day}日` +
                        `（あと ${result.next.daysUntil} 日で ${result.next.turningAge} 歳）`}
                  </p>
                  <p>
                    生後 {result.days.toLocaleString()} 日・{result.weeks.toLocaleString()} 週・
                    {result.months.toLocaleString()} ヶ月
                  </p>
                </div>

                <div class="divider my-0" />

                <div class="text-sm text-base-content/70">
                  <p>
                    生まれた日の和暦:{' '}
                    {result.wareki ? (
                      <a
                        href={`/contents/wareki/convert-from-seireki?year=${result.birth.year}&month=${result.birth.month}&day=${result.birth.day}`}
                        class="link"
                      >
                        {result.wareki.era}
                        {result.wareki.year}年{result.wareki.month}月{result.wareki.day}日
                      </a>
                    ) : (
                      '明治以前'
                    )}
                  </p>
                  <p>
                    生まれ年の干支:{' '}
                    <a href={`/contents/eto/search-by-year?year=${result.birth.year}`} class="link">
                      {result.eto.junishi.kanji}（{result.eto.junishi.animal}{' '}
                      {result.eto.junishi.emoji}）・{result.eto.kanji}（{result.eto.reading}）
                    </a>
                  </p>
                </div>
              </div>
            )
          ) : (
            <p class="mt-2 text-base-content/50">生年月日を入力すると自動で計算されます。</p>
          )}
        </div>
      </div>
    </div>
  );
}
