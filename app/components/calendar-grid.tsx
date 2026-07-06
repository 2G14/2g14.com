const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const;

interface CalendarGridProps {
  seirekiYear: number;
  month: number;
  selectedDate: { year: number; month: number; day: number } | null;
  onDayClick: (day: number) => void;
  disabledDays?: Set<number>;
}

export default function CalendarGrid({
  seirekiYear,
  month,
  selectedDate,
  onDayClick,
  disabledDays,
}: CalendarGridProps) {
  const firstDayOfWeek = new Date(seirekiYear, month - 1, 1).getDay();
  const daysInMonth = new Date(seirekiYear, month, 0).getDate();

  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div class="grid grid-cols-7 gap-1 text-center text-sm">
      {WEEKDAY_LABELS.map((label, i) => (
        <div
          class={`flex h-9 w-9 items-center justify-center font-semibold ${
            i === 0 ? 'text-error' : i === 6 ? 'text-info' : ''
          }`}
        >
          {label}
        </div>
      ))}

      {cells.map((day) => {
        if (day === null) return <div class="h-9 w-9" />;

        const dayOfWeek = new Date(seirekiYear, month - 1, day).getDay();
        const isDisabled = disabledDays?.has(day) ?? false;
        const isSelected =
          selectedDate !== null &&
          selectedDate.year === seirekiYear &&
          selectedDate.month === month &&
          selectedDate.day === day;
        const isToday = seirekiYear === todayYear && month === todayMonth && day === todayDay;

        let cls = 'btn btn-ghost btn-sm h-9 w-9 min-h-0 p-0';
        if (isSelected) {
          cls = 'btn btn-primary btn-sm h-9 w-9 min-h-0 p-0';
        } else if (isToday) {
          cls = 'btn btn-ghost btn-sm h-9 w-9 min-h-0 p-0 ring-1 ring-primary';
        }

        if (isDisabled) {
          cls += ' btn-disabled opacity-40';
        } else if (!isSelected) {
          if (dayOfWeek === 0) cls += ' text-error';
          else if (dayOfWeek === 6) cls += ' text-info';
        }

        return (
          <button
            type="button"
            class={cls}
            disabled={isDisabled}
            aria-selected={isSelected}
            onClick={() => {
              if (!isDisabled) onDayClick(day);
            }}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}
