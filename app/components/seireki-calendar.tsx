import { useEffect, useState } from 'hono/jsx';

import CalendarFrame from '#app/components/calendar-frame.js';
import CalendarGrid from '#app/components/calendar-grid.js';
import EditableYear from '#app/components/editable-year.js';
import { isInteger } from '#app/lib/date-input.js';
import type { SeirekiInput } from '#src/domain/date/seireki.js';
import { todayInJST } from '#src/lib/date.js';

interface SeirekiCalendarProps {
  year: number | null;
  month: number | null;
  day: number | null;
  /** 選べる最も古い日付 */
  min: SeirekiInput;
  onDateSelect: (year: number, month: number, day: number) => void;
}

export default function SeirekiCalendar({
  year,
  month,
  day,
  min,
  onDateSelect,
}: SeirekiCalendarProps) {
  const today = todayInJST();

  const [viewYear, setViewYear] = useState(() =>
    isInteger(year) && year >= min.year ? year : today.year,
  );
  const [viewMonth, setViewMonth] = useState(() =>
    isInteger(month) && month >= 1 && month <= 12 ? month : today.month,
  );

  useEffect(() => {
    if (isInteger(year) && year >= min.year && isInteger(month) && month >= 1 && month <= 12) {
      setViewYear(year);
      setViewMonth(month);
    }
  }, [year, month]);

  const canGoPrevMonth = viewYear > min.year || (viewYear === min.year && viewMonth > min.month);
  // 和暦カレンダーと違い元号の終わりに縛られないため、次月に上限は設けていない
  const canGoNextMonth: boolean = true;

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
    if (!canGoNextMonth) return;
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const disabledDays = new Set<number>();
  if (viewYear === min.year && viewMonth === min.month) {
    for (let d = 1; d < min.day; d++) disabledDays.add(d);
  }

  const selectedDate =
    isInteger(year) && isInteger(month) && isInteger(day) ? { year, month, day } : null;

  const handleDayClick = (d: number) => {
    onDateSelect(viewYear, viewMonth, d);
  };

  return (
    <CalendarFrame
      heading={
        <>
          <EditableYear
            value={viewYear}
            min={min.year}
            widthClass="w-20"
            onYearInput={setViewYear}
          />
          {viewMonth}月
        </>
      }
      canGoPrevMonth={canGoPrevMonth}
      canGoNextMonth={canGoNextMonth}
      onPrevMonth={goPrevMonth}
      onNextMonth={goNextMonth}
    >
      <CalendarGrid
        seirekiYear={viewYear}
        month={viewMonth}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
        disabledDays={disabledDays}
      />
    </CalendarFrame>
  );
}
