import { useEffect, useState } from 'hono/jsx';

import CalendarFrame from './calendar-frame.js';
import EditableYear from './editable-year.js';

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
      onPrevMonth={goPrevMonth}
      onNextMonth={goNextMonth}
      seirekiYear={viewYear}
      month={viewMonth}
      selectedDate={selectedDate}
      onDayClick={handleDayClick}
      disabledDays={disabledDays}
    />
  );
}
