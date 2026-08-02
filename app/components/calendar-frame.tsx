import type { Child } from 'hono/jsx';

import CalendarGrid from './calendar-grid.js';

interface CalendarFrameProps {
  heading: Child;
  canGoPrevMonth: boolean;
  canGoNextMonth?: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  seirekiYear: number;
  month: number;
  selectedDate: { year: number; month: number; day: number } | null;
  onDayClick: (day: number) => void;
  disabledDays: Set<number>;
  children?: Child;
}

export default function CalendarFrame({
  heading,
  canGoPrevMonth,
  canGoNextMonth = true,
  onPrevMonth,
  onNextMonth,
  seirekiYear,
  month,
  selectedDate,
  onDayClick,
  disabledDays,
  children,
}: CalendarFrameProps) {
  return (
    <div class="mt-3 rounded-lg border border-base-300 p-3">
      {children}

      <div class="mb-2 flex items-center justify-between">
        <span class="text-base font-bold">{heading}</span>

        <div class="flex gap-0.5">
          <button
            type="button"
            class="btn btn-circle btn-ghost btn-sm"
            disabled={!canGoPrevMonth}
            aria-label="前月"
            onClick={onPrevMonth}
          >
            ◀
          </button>
          <button
            type="button"
            class="btn btn-circle btn-ghost btn-sm"
            disabled={!canGoNextMonth}
            aria-label="次月"
            onClick={onNextMonth}
          >
            ▶
          </button>
        </div>
      </div>

      <CalendarGrid
        seirekiYear={seirekiYear}
        month={month}
        selectedDate={selectedDate}
        onDayClick={onDayClick}
        disabledDays={disabledDays}
      />
    </div>
  );
}
