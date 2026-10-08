import { useEffect, useState } from 'hono/jsx';

import CalendarToggleButton from '#app/components/calendar-toggle-button.js';
import DateField from '#app/components/date-field.js';
import SeirekiCalendar from '#app/components/seireki-calendar.js';
import { calculateAgeResult } from '#app/lib/age/age-result.js';
import { isInteger } from '#app/lib/date-input.js';
import { dateQueryString, dateToolUrl, parseQueryNumber } from '#app/lib/date-query.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import { formatSeireki } from '#src/domain/date/format.js';
import { createSeireki, GREGORIAN_START_IN_JAPAN } from '#src/domain/date/seireki.js';
import { formatWareki } from '#src/domain/wareki/format.js';
import { todayInJST } from '#src/lib/date.js';

interface Props {
  initialYear?: string | undefined;
  initialMonth?: string | undefined;
  initialDay?: string | undefined;
}

export default function AgeCalculator({ initialYear, initialMonth, initialDay }: Props) {
  const initialYearValue = parseQueryNumber(initialYear);
  // 年だけクエリで渡された場合（干支検索からの遷移など）は 1/1 を初期値にする
  const fallback = initialYearValue === null ? null : 1;
  const [year, setYear] = useState<number | null>(initialYearValue);
  const [month, setMonth] = useState<number | null>(parseQueryNumber(initialMonth) ?? fallback);
  const [day, setDay] = useState<number | null>(parseQueryNumber(initialDay) ?? fallback);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!isInteger(year) || !isInteger(month) || !isInteger(day)) return;
    replaceUrlQuery(dateQueryString({ year, month, day }));
  }, [year, month, day]);

  const result = calculateAgeResult(year, month, day, createSeireki(todayInJST()));

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">生年月日（西暦）</h2>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            <DateField label="年" value={year} max={9999} widthClass="w-20" onInput={setYear} />
            <DateField label="月" value={month} max={12} widthClass="w-14" onInput={setMonth} />
            <DateField label="日" value={day} max={31} widthClass="w-14" onInput={setDay} />
            <CalendarToggleButton onClick={() => setCalendarOpen(!calendarOpen)} />
          </div>
          {calendarOpen && (
            <SeirekiCalendar
              year={year}
              month={month}
              day={day}
              min={GREGORIAN_START_IN_JAPAN}
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
            干支は1月1日で切り替えています（立春で切り替える暦もあります）。
          </p>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">計算結果</h2>
          {result.kind === 'empty' ? (
            <p class="mt-2 text-base-content/50">生年月日を入力すると自動で計算されます。</p>
          ) : result.kind === 'error' ? (
            <div role="alert" class="mt-2 alert alert-error">
              <span>{result.message}</span>
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
                    : `${formatSeireki(result.next.date)}` +
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
                      href={dateToolUrl('/contents/wareki/convert-from-seireki', result.birth)}
                      class="link"
                    >
                      {formatWareki(result.wareki)}
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
          )}
        </div>
      </div>
    </div>
  );
}
