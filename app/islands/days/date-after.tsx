import { useEffect, useState } from 'hono/jsx';

import DateFields from '#app/components/date-fields.js';
import Field from '#app/components/field.js';
import { type DateInputValues, isInteger } from '#app/lib/date-input.js';
import { isoDateString, parseIsoDate, parseQueryNumber } from '#app/lib/date-query.js';
import { calculateDateAfter } from '#app/lib/days/days-result.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import { formatSeirekiWithWeekday } from '#src/domain/date/format.js';
import { seirekiToWareki } from '#src/domain/wareki/conversion.js';
import { formatWareki } from '#src/domain/wareki/format.js';
import { todayInJST } from '#src/lib/date.js';

const PRESET_DAYS = [7, 30, 100, 365, 1000] as const;

interface Props {
  initialBase?: string | undefined;
  initialDays?: string | undefined;
}

export default function DateAfter({ initialBase, initialDays }: Props) {
  const [base, setBase] = useState<DateInputValues>(parseIsoDate(initialBase) ?? todayInJST());
  const [days, setDays] = useState<number | null>(parseQueryNumber(initialDays) ?? 100);

  useEffect(() => {
    const { year, month, day } = base;
    if (!isInteger(year) || !isInteger(month) || !isInteger(day) || !isInteger(days)) return;
    replaceUrlQuery(
      new URLSearchParams({
        base: isoDateString({ year, month, day }),
        days: String(days),
      }).toString(),
    );
  }, [base, days]);

  const result = calculateDateAfter(base, days);
  const wareki = result.kind === 'ok' ? seirekiToWareki(result.date) : null;

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body gap-4">
          <section>
            <h2 class="card-title">基準日</h2>
            <DateFields value={base} onChange={setBase} />
          </section>
          <section>
            <h2 class="card-title">日数</h2>
            <div class="flex flex-wrap items-end gap-3">
              <Field label="日後（前はマイナス）" widthClass="w-40">
                <input
                  type="number"
                  value={days === null ? '' : days}
                  class="input-bordered input w-full"
                  onInput={(e) => {
                    const raw = (e.target as HTMLInputElement).value;
                    const parsed = Number(raw);
                    setDays(raw === '' || Number.isNaN(parsed) ? null : parsed);
                  }}
                />
              </Field>
            </div>
            <div class="mt-2 flex flex-wrap gap-1">
              {PRESET_DAYS.map((preset) => (
                <button
                  type="button"
                  class={`btn btn-xs ${days === preset ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setDays(preset)}
                >
                  {preset.toLocaleString()} 日後
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">日付</h2>
          {result.kind === 'empty' ? (
            <p class="mt-2 text-base-content/50">基準日と日数を入力すると日付を計算します。</p>
          ) : result.kind === 'error' ? (
            <div role="alert" class="mt-2 alert alert-error">
              <span>{result.message}</span>
            </div>
          ) : (
            <div class="mt-2 flex flex-col items-center gap-2">
              <p class="text-sm text-base-content/60">
                {formatSeirekiWithWeekday(result.base)} の {Math.abs(result.days).toLocaleString()}{' '}
                日{result.days >= 0 ? '後' : '前'}は
              </p>
              <p class="text-3xl font-bold">{formatSeirekiWithWeekday(result.date)}</p>
              {wareki && <p class="text-sm text-base-content/60">{formatWareki(wareki)}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
