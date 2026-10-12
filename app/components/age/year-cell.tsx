import { warekiYearLabel } from '#src/domain/wareki/year-label.js';

interface YearCellProps {
  year: number;
  highlighted: boolean;
}

/** 西暦年と和暦年を 2 段で並べる表のセル */
export default function YearCell({ year, highlighted }: YearCellProps) {
  const wareki = warekiYearLabel(year);
  return (
    <td class={`whitespace-nowrap ${highlighted ? 'bg-primary/10 font-bold' : ''}`}>
      <p>{year}年</p>
      {wareki && <p class="text-xs text-base-content/60">{wareki}</p>}
    </td>
  );
}
