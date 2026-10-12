import { useEffect, useState } from 'hono/jsx';

import DateFields from '#app/components/date-fields.js';
import { type DateInputValues, isInteger } from '#app/lib/date-input.js';
import { isoDateString, parseIsoDate } from '#app/lib/date-query.js';
import { calculateDaysBetween } from '#app/lib/days/days-result.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import { formatSeirekiWithWeekday } from '#src/domain/date/format.js';
import { todayInJST } from '#src/lib/date.js';

const EMPTY: DateInputValues = { year: null, month: null, day: null };

function isComplete(
  values: DateInputValues,
): values is { year: number; month: number; day: number } {
  return isInteger(values.year) && isInteger(values.month) && isInteger(values.day);
}

interface Props {
  initialFrom?: string | undefined;
  initialTo?: string | undefined;
}

export default function DaysBetween({ initialFrom, initialTo }: Props) {
  const [from, setFrom] = useState<DateInputValues>(parseIsoDate(initialFrom) ?? todayInJST());
  const [to, setTo] = useState<DateInputValues>(parseIsoDate(initialTo) ?? EMPTY);

  useEffect(() => {
    if (!isComplete(from) || !isComplete(to)) return;
    replaceUrlQuery(
      new URLSearchParams({ from: isoDateString(from), to: isoDateString(to) }).toString(),
    );
  }, [from, to]);

  const result = calculateDaysBetween(from, to);

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body gap-4">
          <section>
            <h2 class="card-title">開始日</h2>
            <DateFields value={from} onChange={setFrom} />
          </section>
          <section>
            <h2 class="card-title">終了日</h2>
            <DateFields value={to} onChange={setTo} />
          </section>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">日数</h2>
          {result.kind === 'empty' ? (
            <p class="mt-2 text-base-content/50">2 つの日付を入力すると日数を計算します。</p>
          ) : result.kind === 'error' ? (
            <div role="alert" class="mt-2 alert alert-error">
              <span>{result.message}</span>
            </div>
          ) : (
            <div class="mt-2 flex flex-col gap-3">
              <p class="text-center text-sm text-base-content/60">
                {formatSeirekiWithWeekday(result.from)} から
                <br />
                {formatSeirekiWithWeekday(result.to)} まで
              </p>
              <p class="text-center text-4xl font-bold">
                {result.days === 0
                  ? '同じ日です'
                  : `${Math.abs(result.days).toLocaleString()} 日${result.days > 0 ? '後' : '前'}`}
              </p>
              {result.days !== 0 && (
                <ul class="list-inside list-disc text-sm">
                  <li>
                    {Math.floor(Math.abs(result.days) / 7).toLocaleString()} 週と{' '}
                    {Math.abs(result.days) % 7} 日
                  </li>
                  <li>
                    両端の日を含めて数えると {(Math.abs(result.days) + 1).toLocaleString()} 日
                    {result.days > 0 && '（開始日を 1 日目とすると、終了日は '}
                    {result.days > 0 && `${(result.days + 1).toLocaleString()} 日目）`}
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
