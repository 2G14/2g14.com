import type { Child } from 'hono/jsx';

interface CalendarFrameProps {
  heading: Child;
  headerExtra?: Child;
  canGoPrevMonth: boolean;
  canGoNextMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  children: Child;
}

export default function CalendarFrame({
  heading,
  headerExtra,
  canGoPrevMonth,
  canGoNextMonth,
  onPrevMonth,
  onNextMonth,
  children,
}: CalendarFrameProps) {
  return (
    <div class="mt-3 rounded-lg border border-base-300 p-3">
      {headerExtra}

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

      {children}
    </div>
  );
}
