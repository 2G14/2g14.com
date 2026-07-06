import { useEffect, useState } from 'hono/jsx';

import CalendarGrid from './calendar-grid.js';

const MIN_YEAR = 1868;
const MIN_MONTH = 9;
const MIN_DAY = 8;

interface SeirekiCalendarProps {
  year: string;
  month: string;
  day: string;
  onDateSelect: (year: string, month: string, day: string) => void;
}

export default function SeirekiCalendar({ year, month, day, onDateSelect }: SeirekiCalendarProps) {
  const now = new Date();
  const defaultYear = now.getFullYear();
  const defaultMonth = now.getMonth() + 1;

  const [viewYear, setViewYear] = useState(() => {
    const y = Number(year);
    return Number.isInteger(y) && y >= MIN_YEAR ? y : defaultYear;
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const m = Number(month);
    return Number.isInteger(m) && m >= 1 && m <= 12 ? m : defaultMonth;
  });
  const [editingYear, setEditingYear] = useState(false);

  useEffect(() => {
    const y = Number(year);
    const m = Number(month);
    if (Number.isInteger(y) && y >= MIN_YEAR && Number.isInteger(m) && m >= 1 && m <= 12) {
      setViewYear(y);
      setViewMonth(m);
    }
  }, [year, month]);

  const canGoPrevMonth = viewYear > MIN_YEAR || (viewYear === MIN_YEAR && viewMonth > MIN_MONTH);
  const goPrevMonth = () => {
    if (!canGoPrevMonth) return;
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const disabledDays = new Set<number>();
  if (viewYear === MIN_YEAR && viewMonth === MIN_MONTH) {
    for (let d = 1; d < MIN_DAY; d++) disabledDays.add(d);
  }

  const selectedDate = (() => {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (Number.isInteger(y) && Number.isInteger(m) && Number.isInteger(d)) {
      return { year: y, month: m, day: d };
    }
    return null;
  })();

  const handleDayClick = (d: number) => {
    onDateSelect(String(viewYear), String(viewMonth), String(d));
  };

  return (
    <div class="mt-3 rounded-lg border border-base-300 p-3">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-base font-bold">
          {editingYear ? (
            <input
              type="number"
              class="input-bordered input w-20 text-center input-sm"
              value={viewYear}
              min={MIN_YEAR}
              onInput={(e) => {
                const v = Number((e.target as HTMLInputElement).value);
                if (Number.isInteger(v) && v >= MIN_YEAR) setViewYear(v);
              }}
              onBlur={() => setEditingYear(false)}
              onKeyDown={(e) => {
                if ((e as KeyboardEvent).key === 'Enter') setEditingYear(false);
              }}
              autoFocus
            />
          ) : (
            <button
              type="button"
              class="btn btn-ghost btn-sm text-base"
              onClick={() => setEditingYear(true)}
              title="年を直接入力"
            >
              {viewYear}年
            </button>
          )}
          {viewMonth}月
        </span>

        <div class="flex gap-0.5">
          <button
            type="button"
            class="btn btn-circle btn-ghost btn-sm"
            disabled={!canGoPrevMonth}
            aria-label="前月"
            onClick={goPrevMonth}
          >
            ◀
          </button>
          <button
            type="button"
            class="btn btn-circle btn-ghost btn-sm"
            aria-label="次月"
            onClick={goNextMonth}
          >
            ▶
          </button>
        </div>
      </div>

      <CalendarGrid
        seirekiYear={viewYear}
        month={viewMonth}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
        disabledDays={disabledDays}
      />
    </div>
  );
}
