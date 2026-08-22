import { useEffect, useState } from 'hono/jsx';

import ConverterLayout from '#app/components/converter-layout.js';
import DateField from '#app/components/date-field.js';
import Field from '#app/components/field.js';
import WarekiCalendar from '#app/components/wareki-calendar.js';
import { type ConvertResult, reverseToolUrl } from '#app/lib/convert-result.js';
import { parseDateInput } from '#app/lib/date-input.js';
import { dateQueryString, parseQueryNumber } from '#app/lib/date-query.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import { seirekiToWareki, warekiToSeireki } from '#src/domain/wareki/conversion.js';
import { ERAS } from '#src/domain/wareki/era.js';
import { createSeireki } from '#src/domain/wareki/seireki.js';
import { createWareki } from '#src/domain/wareki/wareki.js';

function tryConvert(
  era: string,
  year: number | null,
  month: number | null,
  day: number | null,
): ConvertResult {
  const parsed = parseDateInput(year, month, day);
  if (!parsed || 'error' in parsed) return parsed;

  try {
    const wareki = createWareki({ era, ...parsed });
    const seireki = warekiToSeireki(wareki);
    return {
      text: `${seireki.year}年${seireki.month}月${seireki.day}日`,
      reverseQuery: {
        year: seireki.year,
        month: seireki.month,
        day: seireki.day,
      },
    };
  } catch (e) {
    if (e instanceof Error) return { error: e.message };
    return { error: '変換中にエラーが発生しました。' };
  }
}

interface Props {
  initialEra?: string | undefined;
  initialYear?: string | undefined;
  initialMonth?: string | undefined;
  initialDay?: string | undefined;
}

function todayWareki() {
  const now = new Date();
  const seireki = createSeireki({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
  const wareki = seirekiToWareki(seireki);
  if (wareki) return wareki;
  return { era: ERAS[0]!.name, year: 1, month: 1, day: 1 };
}

export default function WarekiToSeirekiConverter({
  initialEra,
  initialYear,
  initialMonth,
  initialDay,
}: Props) {
  const today = todayWareki();
  const [era, setEra] = useState(initialEra ?? today.era);
  const [year, setYear] = useState<number | null>(parseQueryNumber(initialYear) ?? today.year);
  const [month, setMonth] = useState<number | null>(parseQueryNumber(initialMonth) ?? today.month);
  const [day, setDay] = useState<number | null>(parseQueryNumber(initialDay) ?? today.day);

  useEffect(() => {
    replaceUrlQuery(dateQueryString({ era, year, month, day }));
  }, [era, year, month, day]);

  const result = tryConvert(era, year, month, day);

  const reverseUrl = reverseToolUrl('/contents/wareki/convert-from-seireki', result);

  return (
    <ConverterLayout
      inputTitle="和暦"
      fields={
        <>
          <Field label="元号" widthClass="w-20">
            <select
              class="select-bordered select w-full"
              onInput={(e) => setEra((e.target as HTMLSelectElement).value)}
            >
              {ERAS.map((e) => (
                <option value={e.name} selected={era === e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </Field>
          <DateField label="年" value={year} max={999} widthClass="w-16" onInput={setYear} />
          <DateField label="月" value={month} max={12} widthClass="w-14" onInput={setMonth} />
          <DateField label="日" value={day} max={31} widthClass="w-14" onInput={setDay} />
        </>
      }
      calendar={
        <WarekiCalendar
          era={era}
          year={year}
          month={month}
          day={day}
          onDateSelect={(e, y, m, d) => {
            setEra(e);
            setYear(y);
            setMonth(m);
            setDay(d);
          }}
        />
      }
      reverseUrl={reverseUrl}
      resultTitle="西暦"
      result={result}
      placeholder="和暦の日付を入力すると自動で変換されます。"
    />
  );
}
