import { YAKU_KIND_LABELS, type Yaku, type YakudoshiPeriod } from '#src/domain/age/yakudoshi.js';
import { warekiYearLabel } from '#src/domain/wareki/year-label.js';

interface YakudoshiTableProps {
  caption: string;
  periods: readonly YakudoshiPeriod[];
  /** 生まれ年を並べるか、厄年を迎える年を並べるか */
  show: 'birthYear' | 'year';
  /** この年に当たるセルを強調する */
  highlightYear?: number;
}

export default function YakudoshiTable({
  caption,
  periods,
  show,
  highlightYear,
}: YakudoshiTableProps) {
  const cell = (yaku: Yaku) => {
    const year = yaku[show];
    const wareki = warekiYearLabel(year);
    const highlighted = yaku.year === highlightYear;
    return (
      <td class={`whitespace-nowrap ${highlighted ? 'bg-primary/10 font-bold' : ''}`}>
        <p>{year}年</p>
        {wareki && <p class="text-xs text-base-content/60">{wareki}</p>}
      </td>
    );
  };

  return (
    <div class="overflow-x-auto">
      <table class="table">
        <caption class="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th>本厄（数え年）</th>
            <th>{YAKU_KIND_LABELS.maeyaku}</th>
            <th>{YAKU_KIND_LABELS.honyaku}</th>
            <th>{YAKU_KIND_LABELS.atoyaku}</th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr>
              <th class="whitespace-nowrap">
                {period.honyakuAge} 歳
                {period.taiyaku && <span class="ml-1 badge badge-sm badge-error">大厄</span>}
              </th>
              {period.yakus.map(cell)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
