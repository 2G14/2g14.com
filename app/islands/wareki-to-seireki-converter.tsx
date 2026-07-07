import { useEffect, useState } from 'hono/jsx';

import WarekiCalendar from '#app/components/wareki-calendar.js';
import { seirekiToWareki, warekiToSeireki } from '#src/domain/wareki/conversion.js';
import { ERAS } from '#src/domain/wareki/era.js';
import { createSeireki, type Seireki } from '#src/domain/wareki/seireki.js';
import { createWareki } from '#src/domain/wareki/wareki.js';

function tryConvert(
  era: string,
  yearStr: string,
  monthStr: string,
  dayStr: string,
): { seireki: Seireki } | { error: string } | null {
  if (!yearStr) return null;

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return { error: '年・月・日は整数で入力してください。' };
  }

  try {
    const wareki = createWareki({ era, year, month, day });
    const seireki = warekiToSeireki(wareki);
    return { seireki };
  } catch (e) {
    if (e instanceof Error) return { error: e.message };
    return { error: '変換中にエラーが発生しました。' };
  }
}

interface Props {
  initialEra?: string | undefined;
  initialYear?: string | undefined;
  initialMonth?: string | undefined;
  initialDay?: string | undefined;
}

function todayWareki() {
  const now = new Date();
  const seireki = createSeireki({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
  const wareki = seirekiToWareki(seireki);
  if (wareki) return wareki;
  return { era: ERAS[0]!.name, year: 1, month: 1, day: 1 };
}

export default function WarekiToSeirekiConverter({
  initialEra,
  initialYear,
  initialMonth,
  initialDay,
}: Props) {
  const today = todayWareki();
  const [era, setEra] = useState(initialEra ?? today.era);
  const [year, setYear] = useState(initialYear ?? String(today.year));
  const [month, setMonth] = useState(initialMonth ?? String(today.month));
  const [day, setDay] = useState(initialDay ?? String(today.day));
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (era) params.set('era', era);
    if (year) params.set('year', year);
    if (month && month !== '1') params.set('month', month);
    if (day && day !== '1') params.set('day', day);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    history.replaceState(null, '', url);
  }, [era, year, month, day]);

  const result = tryConvert(era, year, month, day);

  const reverseUrl = (() => {
    const base = '/contents/wareki/convert-from-seireki';
    if (!result || 'error' in result) return base;
    const params = new URLSearchParams();
    params.set('year', String(result.seireki.year));
    if (result.seireki.month !== 1) params.set('month', String(result.seireki.month));
    if (result.seireki.day !== 1) params.set('day', String(result.seireki.day));
    return `${base}?${params.toString()}`;
  })();

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">和暦</h2>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            <label class="form-control w-20">
              <div class="label">
                <span class="label-text">元号</span>
              </div>
              <select
                class="select-bordered select w-full"
                onInput={(e) => setEra((e.target as HTMLSelectElement).value)}
              >
                {ERAS.map((e) => (
                  <option value={e.name} selected={era === e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
            </label>
            <label class="form-control w-16">
              <div class="label">
                <span class="label-text">年</span>
              </div>
              <input
                type="number"
                value={year}
                min="1"
                max="999"
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
            <WarekiCalendar
              era={era}
              year={year}
              month={month}
              day={day}
              onDateSelect={(e, y, m, d) => {
                setEra(e);
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
          <h2 class="card-title">西暦</h2>
          {result ? (
            'error' in result ? (
              <div role="alert" class="mt-2 alert alert-error">
                <span>{result.error}</span>
              </div>
            ) : (
              <p class="mt-4 text-center text-2xl font-bold">
                {result.seireki.year}年{result.seireki.month}月{result.seireki.day}日
              </p>
            )
          ) : (
            <p class="mt-2 text-base-content/50">和暦の日付を入力すると自動で変換されます。</p>
          )}
        </div>
      </div>
    </div>
  );
}
