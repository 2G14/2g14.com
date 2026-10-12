import BirthYearLookupCard from '#app/components/age/birth-year-lookup-card.js';
import YakudoshiTable from '#app/components/age/yakudoshi-table.js';
import { lookupYakudoshi } from '#app/lib/age/yakudoshi-result.js';
import { useYearQuery } from '#app/lib/use-year-query.js';
import { todayInJST } from '#src/lib/date.js';

interface Props {
  initialYear?: string | undefined;
}

export default function YakudoshiLookup({ initialYear }: Props) {
  const [year, setYear] = useYearQuery(initialYear);
  const currentYear = todayInJST().year;

  return (
    <BirthYearLookupCard
      title="生まれ年から厄年を調べる"
      emptyMessage="生まれ年を入力すると厄年の年を表示します。"
      year={year}
      onYearInput={setYear}
      result={lookupYakudoshi(year)}
      renderResult={(result) => (
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section>
            <h3 class="font-semibold">男性</h3>
            <YakudoshiTable
              caption={`${result.birthYear}年生まれの男性の厄年`}
              periods={result.male}
              show="year"
              highlightYear={currentYear}
            />
          </section>
          <section>
            <h3 class="font-semibold">女性</h3>
            <YakudoshiTable
              caption={`${result.birthYear}年生まれの女性の厄年`}
              periods={result.female}
              show="year"
              highlightYear={currentYear}
            />
          </section>
        </div>
      )}
    />
  );
}
