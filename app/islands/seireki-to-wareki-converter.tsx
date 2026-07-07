import { useEffect, useState } from 'hono/jsx';

import SeirekiCalendar from '#app/components/seireki-calendar.js';
import { seirekiToWareki } from '#src/domain/wareki/conversion.js';
import { createSeireki } from '#src/domain/wareki/seireki.js';
import type { Wareki } from '#src/domain/wareki/wareki.js';

function tryConvert(
  yearStr: string,
  monthStr: string,
  dayStr: string,
): { wareki: Wareki } | { error: string } | null {
  if (!yearStr) return null;

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return { error: '年・月・日は整数で入力してください。' };
  }

  try {
    const seireki = createSeireki({ year, month, day });
    const wareki = seirekiToWareki(seireki);
    if (!wareki) {
      return { error: '明治以前の日付は変換できません。' };
    }
    return { wareki };
  } catch (e) {
    if (e instanceof Error) return { error: e.message };
    return { error: '変換中にエラーが発生しました。' };
  }
}

interface Props {
  initialYear?: string | undefined;
  initialMonth?: string | undefined;
  initialDay?: string | undefined;
}

export default function SeirekiToWarekiConverter({ initialYear, initialMonth, initialDay }: Props) {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? String(now.getFullYear()));
  const [month, setMonth] = useState(initialMonth ?? String(now.getMonth() + 1));
  const [day, setDay] = useState(initialDay ?? String(now.getDate()));
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

  const result = tryConvert(year, month, day);

  const reverseUrl = (() => {
    const base = '/contents/wareki/convert-to-seireki';
    if (!result || 'error' in result) return base;
    const params = new URLSearchParams();
    params.set('era', result.wareki.era);
    params.set('year', String(result.wareki.year));
    if (result.wareki.month !== 1) params.set('month', String(result.wareki.month));
    if (result.wareki.day !== 1) params.set('day', String(result.wareki.day));
    return `${base}?${params.toString()}`;
  })();

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">西暦</h2>
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
        </div>
      </div>

      <div class="flex justify-center self-center">
        <a
          href={reverseUrl}
          class="btn btn-circle rotate-90 btn-outline btn-sm md:rotate-0"
          title="逆変換"
        >
          ⇄
        </a>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">和暦</h2>
          {result ? (
            'error' in result ? (
              <div role="alert" class="mt-2 alert alert-error">
                <span>{result.error}</span>
              </div>
            ) : (
              <p class="mt-4 text-center text-2xl font-bold">
                {result.wareki.era}
                {result.wareki.year}年{result.wareki.month}月{result.wareki.day}日
              </p>
            )
          ) : (
            <p class="mt-2 text-base-content/50">西暦の日付を入力すると自動で変換されます。</p>
          )}
        </div>
      </div>
    </div>
  );
}
