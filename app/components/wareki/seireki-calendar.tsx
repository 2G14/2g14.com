import { useEffect, useState } from 'hono/jsx';

import CalendarFrame from '#app/components/calendar-frame.js';
import CalendarGrid from '#app/components/calendar-grid.js';
import EditableYear from '#app/components/editable-year.js';
import { isInteger } from '#app/lib/date-input.js';

const MIN_YEAR = 1868;
const MIN_MONTH = 9;
const MIN_DAY = 8;

interface SeirekiCalendarProps {
  year: number | null;
  month: number | null;
  day: number | null;
  onDateSelect: (year: number, month: number, day: number) => void;
}

export default function SeirekiCalendar({ year, month, day, onDateSelect }: SeirekiCalendarProps) {
  const now = new Date();
  const defaultYear = now.getFullYear();
  const defaultMonth = now.getMonth() + 1;

  const [viewYear, setViewYear] = useState(() =>
    isInteger(year) && year >= MIN_YEAR ? year : defaultYear,
  );
  const [viewMonth, setViewMonth] = useState(() =>
    isInteger(month) && month >= 1 && month <= 12 ? month : defaultMonth,
  );

  useEffect(() => {
    if (isInteger(year) && year >= MIN_YEAR && isInteger(month) && month >= 1 && month <= 12) {
      setViewYear(year);
      setViewMonth(month);
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
            min={MIN_YEAR}
            widthClass="w-20"
            onYearInput={setViewYear}
          />
          {viewMonth}月
        </>
      }
      canGoPrevMonth={canGoPrevMonth}
      canGoNextMonth
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
