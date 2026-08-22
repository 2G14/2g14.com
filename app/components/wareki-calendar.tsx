import { useEffect, useState } from 'hono/jsx';

import { isInteger } from '#app/lib/date-input.js';
import { ERAS, type Era } from '#src/domain/wareki/era.js';

import CalendarFrame from './calendar-frame.js';
import CalendarGrid from './calendar-grid.js';
import EditableYear from './editable-year.js';

const ERAS_DISPLAY = ERAS.toReversed();

function findEra(name: string): Era | undefined {
  return ERAS.find((e) => e.name === name);
}

function warekiToSeirekiYear(era: Era, warekiYear: number): number {
  return era.start.year - 1 + warekiYear;
}

function getLastMonth(era: Era): { seirekiYear: number; month: number } {
  if (!era.end) {
    const now = new Date();
    return { seirekiYear: now.getFullYear() + 10, month: 12 };
  }
  if (era.end.day === 1) {
    const m = era.end.month - 1;
    if (m >= 1) return { seirekiYear: era.end.year, month: m };
    return { seirekiYear: era.end.year - 1, month: 12 };
  }
  return { seirekiYear: era.end.year, month: era.end.month };
}

function getDisabledDays(seirekiYear: number, month: number, era: Era): Set<number> {
  const disabled = new Set<number>();
  const start = era.start;
  if (seirekiYear === start.year && month === start.month) {
    for (let d = 1; d < start.day; d++) disabled.add(d);
  }
  const end = era.end;
  if (end && seirekiYear === end.year && month === end.month) {
    const daysInMonth = new Date(seirekiYear, month, 0).getDate();
    for (let d = end.day; d <= daysInMonth; d++) disabled.add(d);
  }
  return disabled;
}

interface WarekiCalendarProps {
  era: string;
  year: number | null;
  month: number | null;
  day: number | null;
  onDateSelect: (era: string, year: number, month: number, day: number) => void;
}

export default function WarekiCalendar({
  era,
  year,
  month,
  day,
  onDateSelect,
}: WarekiCalendarProps) {
  const defaultEra = ERAS[0]!;

  const [viewEra, setViewEra] = useState(() => findEra(era) ?? defaultEra);
  const [viewWarekiYear, setViewWarekiYear] = useState(() =>
    isInteger(year) && year >= 1 ? year : 1,
  );
  const [viewMonth, setViewMonth] = useState(() =>
    isInteger(month) && month >= 1 && month <= 12 ? month : viewEra.start.month,
  );

  useEffect(() => {
    const eraEntry = findEra(era);
    if (eraEntry && isInteger(year) && year >= 1 && isInteger(month) && month >= 1 && month <= 12) {
      setViewEra(eraEntry);
      setViewWarekiYear(year);
      setViewMonth(month);
    }
  }, [era, year, month]);

  const viewSeirekiYear = warekiToSeirekiYear(viewEra, viewWarekiYear);
  const lastMonth = getLastMonth(viewEra);

  const canGoPrevMonth =
    viewSeirekiYear > viewEra.start.year ||
    (viewSeirekiYear === viewEra.start.year && viewMonth > viewEra.start.month);

  const canGoNextMonth =
    viewSeirekiYear < lastMonth.seirekiYear ||
    (viewSeirekiYear === lastMonth.seirekiYear && viewMonth < lastMonth.month);

  const goPrevMonth = () => {
    if (!canGoPrevMonth) return;
    if (viewMonth === 1) {
      setViewWarekiYear(viewWarekiYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (!canGoNextMonth) return;
    if (viewMonth === 12) {
      setViewWarekiYear(viewWarekiYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleEraChange = (eraName: string) => {
    const eraEntry = findEra(eraName);
    if (!eraEntry) return;
    setViewEra(eraEntry);
    setViewWarekiYear(1);
    setViewMonth(eraEntry.start.month);
  };

  const handleYearInput = (v: number) => {
    const seireki = warekiToSeirekiYear(viewEra, v);
    if (seireki > lastMonth.seirekiYear) return;
    setViewWarekiYear(v);
    if (v === 1 && viewMonth < viewEra.start.month) {
      setViewMonth(viewEra.start.month);
    }
    if (seireki === lastMonth.seirekiYear && viewMonth > lastMonth.month) {
      setViewMonth(lastMonth.month);
    }
  };

  const disabledDays = getDisabledDays(viewSeirekiYear, viewMonth, viewEra);

  const selectedDate = (() => {
    const eraEntry = findEra(era);
    if (eraEntry && isInteger(year) && year >= 1 && isInteger(month) && isInteger(day)) {
      return {
        year: warekiToSeirekiYear(eraEntry, year),
        month,
        day,
      };
    }
    return null;
  })();

  const handleDayClick = (d: number) => {
    onDateSelect(viewEra.name, viewWarekiYear, viewMonth, d);
  };

  const yearLabel = viewWarekiYear === 1 ? '元' : String(viewWarekiYear);

  return (
    <CalendarFrame
      heading={
        <>
          {viewEra.name}
          <EditableYear
            value={viewWarekiYear}
            min={1}
            widthClass="w-16"
            displayLabel={yearLabel}
            onYearInput={handleYearInput}
          />
          {viewMonth}月
        </>
      }
      headerExtra={
        <div role="tablist" class="tabs-boxed mb-3 tabs">
          {ERAS_DISPLAY.map((e) => (
            <button
              type="button"
              role="tab"
              class={`tab-sm tab flex-1 ${e.name === viewEra.name ? 'tab-active bg-primary font-bold text-primary-content' : ''}`}
              aria-selected={e.name === viewEra.name}
              onClick={() => handleEraChange(e.name)}
            >
              {e.name}
            </button>
          ))}
        </div>
      }
      canGoPrevMonth={canGoPrevMonth}
      canGoNextMonth={canGoNextMonth}
      onPrevMonth={goPrevMonth}
      onNextMonth={goNextMonth}
    >
      <CalendarGrid
        seirekiYear={viewSeirekiYear}
        month={viewMonth}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
        disabledDays={disabledDays}
      />
    </CalendarFrame>
  );
}
