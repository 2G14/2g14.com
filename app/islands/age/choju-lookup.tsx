import BirthYearLookupCard from '#app/components/age/birth-year-lookup-card.js';
import ChojuTable from '#app/components/age/choju-table.js';
import { lookupChoju } from '#app/lib/age/choju-result.js';
import { useYearQuery } from '#app/lib/use-year-query.js';
import { todayInJST } from '#src/lib/date.js';

interface Props {
  initialYear?: string | undefined;
}

export default function ChojuLookup({ initialYear }: Props) {
  const [year, setYear] = useYearQuery(initialYear);

  return (
    <BirthYearLookupCard
      title="生まれ年から長寿祝いの年を調べる"
      emptyMessage="生まれ年を入力すると長寿祝いを迎える年を表示します。"
      year={year}
      onYearInput={setYear}
      result={lookupChoju(year)}
      renderResult={(result) => (
        <ChojuTable
          caption={`${result.birthYear}年生まれの長寿祝いの年`}
          rows={result.years.map((y) => ({
            choju: y.choju,
            kazoedoshi: y.kazoedoshiYear,
            fullAge: y.fullAgeYear,
          }))}
          yearLabel="祝う年"
          highlightYear={todayInJST().year}
        />
      )}
    />
  );
}
