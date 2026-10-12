import { YAKU_KIND_LABELS, type YakudoshiPeriod } from '#src/domain/age/yakudoshi.js';

import YearCell from './year-cell.js';

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
              {period.yakus.map((yaku) => (
                <YearCell year={yaku[show]} highlighted={yaku.year === highlightYear} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
