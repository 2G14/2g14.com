import { useEffect, useState } from 'hono/jsx';

import DateField from '#app/components/date-field.js';
import ConverterView from '#app/components/wareki/converter-view.js';
import SeirekiCalendar from '#app/components/wareki/seireki-calendar.js';
import { parseDateInput } from '#app/lib/date-input.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import { type ConvertResult, reverseToolUrl } from '#app/lib/wareki/convert-result.js';
import { dateQueryString, parseQueryNumber } from '#app/lib/wareki/date-query.js';
import { seirekiToWareki } from '#src/domain/wareki/conversion.js';
import { createSeireki } from '#src/domain/wareki/seireki.js';

function tryConvert(year: number | null, month: number | null, day: number | null): ConvertResult {
  const parsed = parseDateInput(year, month, day);
  if (!parsed || 'error' in parsed) return parsed;

  try {
    const seireki = createSeireki(parsed);
    const wareki = seirekiToWareki(seireki);
    if (!wareki) {
      return { error: '明治以前の日付は変換できません。' };
    }
    return {
      text: `${wareki.era}${wareki.year}年${wareki.month}月${wareki.day}日`,
      reverseQuery: {
        era: wareki.era,
        year: wareki.year,
        month: wareki.month,
        day: wareki.day,
      },
    };
  } catch (e) {
    if (e instanceof Error) return { error: e.message };
    return { error: '変換中にエラーが発生しました。' };
  }
}

interface Props {
  initialYear?: string | undefined;
  initialMonth?: string | undefined;
  initialDay?: string | undefined;
}

export default function SeirekiToWarekiConverter({ initialYear, initialMonth, initialDay }: Props) {
  const now = new Date();
  const [year, setYear] = useState<number | null>(
    parseQueryNumber(initialYear) ?? now.getFullYear(),
  );
  const [month, setMonth] = useState<number | null>(
    parseQueryNumber(initialMonth) ?? now.getMonth() + 1,
  );
  const [day, setDay] = useState<number | null>(parseQueryNumber(initialDay) ?? now.getDate());

  useEffect(() => {
    replaceUrlQuery(dateQueryString({ year, month, day }));
  }, [year, month, day]);

  const result = tryConvert(year, month, day);

  const reverseUrl = reverseToolUrl('/contents/wareki/convert-to-seireki', result);

  return (
    <ConverterView
      inputTitle="西暦"
      fields={
        <>
          <DateField label="年" value={year} max={9999} widthClass="w-20" onInput={setYear} />
          <DateField label="月" value={month} max={12} widthClass="w-14" onInput={setMonth} />
          <DateField label="日" value={day} max={31} widthClass="w-14" onInput={setDay} />
        </>
      }
      calendar={
        <SeirekiCalendar
          year={year}
          month={month}
          day={day}
          onDateSelect={(y, m, d) => {
            setYear(y);
            setMonth(m);
            setDay(d);
          }}
        />
      }
      reverseUrl={reverseUrl}
      resultTitle="和暦"
      result={result}
      placeholder="西暦の日付を入力すると自動で変換されます。"
    />
  );
}
