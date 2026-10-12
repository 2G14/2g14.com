import DateField from '#app/components/date-field.js';
import { calculateSchoolYearResult } from '#app/lib/age/school-year-result.js';
import { parseQueryNumber } from '#app/lib/date-query.js';
import { useDateQuery } from '#app/lib/use-date-query.js';
import { formatSeireki } from '#src/domain/date/format.js';
import { createSeireki } from '#src/domain/date/seireki.js';
import { warekiYearLabel } from '#src/domain/wareki/year-label.js';
import { todayInJST } from '#src/lib/date.js';

interface Props {
  initialYear?: string | undefined;
  initialMonth?: string | undefined;
  initialDay?: string | undefined;
}

export default function SchoolYearLookup({ initialYear, initialMonth, initialDay }: Props) {
  const { year, month, day, setYear, setMonth, setDay } = useDateQuery({
    year: parseQueryNumber(initialYear),
    month: parseQueryNumber(initialMonth),
    day: parseQueryNumber(initialDay),
  });

  const result = calculateSchoolYearResult(year, month, day, createSeireki(todayInJST()));

  return (
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title">生年月日から入学・卒業の年を調べる</h2>
        <div class="mt-2 flex flex-wrap items-end gap-3">
          <DateField label="年" value={year} max={9999} widthClass="w-20" onInput={setYear} />
          <DateField label="月" value={month} max={12} widthClass="w-14" onInput={setMonth} />
          <DateField label="日" value={day} max={31} widthClass="w-14" onInput={setDay} />
        </div>
        {result.kind === 'empty' ? (
          <p class="mt-2 text-base-content/50">生年月日を入力すると入学・卒業の年を表示します。</p>
        ) : result.kind === 'error' ? (
          <div role="alert" class="mt-2 alert alert-error">
            <span>{result.message}</span>
          </div>
        ) : (
          <div class="mt-2 flex flex-col gap-3">
            <p>
              {formatSeireki(result.birth)}生まれは、今年度
              {result.grade ? (
                <span class="mx-1 text-2xl font-bold">{result.grade.label}</span>
              ) : (
                '在学期間の外'
              )}
              です。
            </p>
            <div class="overflow-x-auto">
              <table class="table">
                <caption class="sr-only">入学・卒業の年</caption>
                <thead>
                  <tr>
                    <th>学校</th>
                    <th>入学・入園</th>
                    <th>卒業・卒園</th>
                  </tr>
                </thead>
                <tbody>
                  {result.timeline.map((period) => (
                    <tr class={period.stage === result.grade?.stage ? 'bg-primary/10' : ''}>
                      <th>{period.name}</th>
                      <td>
                        {period.entryYear}年4月
                        <span class="ml-1 text-xs text-base-content/60">
                          {warekiYearLabel(period.entryYear)}
                        </span>
                      </td>
                      <td>
                        {period.graduationYear}年3月
                        <span class="ml-1 text-xs text-base-content/60">
                          {warekiYearLabel(period.graduationYear)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
