import { dayOfWeek } from '#src/domain/date/day-count.js';
import { WEEKDAY_LABELS } from '#src/domain/date/format.js';
import { createSeireki, daysInMonth } from '#src/domain/date/seireki.js';
import { toKyurekiDays } from '#src/domain/koyomi/kyureki.js';
import { rokuyoOf } from '#src/domain/koyomi/rokuyo.js';
import { sekkiOfYear } from '#src/domain/koyomi/sekki.js';

interface RokuyoCalendarProps {
  year: number;
  month: number;
  today: { year: number; month: number; day: number };
}

const WEEKDAY_COLORS = ['text-error', '', '', '', '', '', 'text-info'] as const;

export default function RokuyoCalendar({ year, month, today }: RokuyoCalendarProps) {
  const first = createSeireki({ year, month, day: 1 });
  const kyurekiDays = toKyurekiDays(first, daysInMonth(year, month));
  const sekkiByDay = new Map(
    sekkiOfYear(year)
      .filter((s) => s.date.month === month)
      .map((s) => [s.date.day, s.sekki.name]),
  );
  const leading = dayOfWeek(first);

  return (
    <div class="grid grid-cols-7 gap-1 text-center">
      {WEEKDAY_LABELS.map((label, i) => (
        <div class={`py-1 text-sm font-semibold ${WEEKDAY_COLORS[i]}`}>{label}</div>
      ))}
      {Array.from({ length: leading }, () => (
        <div />
      ))}
      {kyurekiDays.map((kyureki, i) => {
        const day = i + 1;
        const rokuyo = rokuyoOf(kyureki);
        const isToday = year === today.year && month === today.month && day === today.day;
        const sekki = sekkiByDay.get(day);
        return (
          <div
            class={`flex min-h-20 flex-col items-center rounded-box border p-1 ${
              isToday ? 'border-primary bg-primary/10' : 'border-base-300'
            } ${rokuyo.name === '大安' ? 'bg-success/10' : ''}`}
          >
            <span class={`font-semibold ${WEEKDAY_COLORS[(leading + i) % 7]}`}>{day}</span>
            <span class="text-sm">{rokuyo.name}</span>
            <span class="text-xs text-base-content/60">
              {kyureki.leap && '閏'}
              {kyureki.month}/{kyureki.day}
            </span>
            {sekki && <span class="mt-auto badge badge-ghost badge-xs">{sekki}</span>}
          </div>
        );
      })}
    </div>
  );
}
