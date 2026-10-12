import type { Choju } from '#src/domain/age/choju.js';

import YearCell from './year-cell.js';

interface ChojuRow {
  choju: Choju;
  /** 数え年で祝う場合の年（または生まれ年） */
  kazoedoshi: number;
  /** 満年齢で祝う場合の年（または生まれ年） */
  fullAge: number;
}

interface ChojuTableProps {
  caption: string;
  rows: readonly ChojuRow[];
  /** 年の列が表すもの（「生まれ年」「祝う年」など） */
  yearLabel: string;
  showOrigin?: boolean;
  /** この年に当たるセルを強調する */
  highlightYear?: number;
}

export default function ChojuTable({
  caption,
  rows,
  yearLabel,
  showOrigin = false,
  highlightYear,
}: ChojuTableProps) {
  return (
    <div class="overflow-x-auto">
      <table class="table">
        <caption class="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th>名称</th>
            <th>年齢</th>
            <th>{yearLabel}（数え年）</th>
            <th>{yearLabel}（満年齢）</th>
            {showOrigin && <th>由来</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ choju, kazoedoshi, fullAge }) => (
            <tr>
              <th class="whitespace-nowrap">
                <p>{choju.name}</p>
                <p class="text-xs font-normal text-base-content/60">{choju.reading}</p>
              </th>
              <td class="whitespace-nowrap">
                {choju.kazoedoshi === choju.fullAge
                  ? `${choju.fullAge} 歳`
                  : `数え ${choju.kazoedoshi} 歳・満 ${choju.fullAge} 歳`}
              </td>
              <YearCell year={kazoedoshi} highlighted={kazoedoshi === highlightYear} />
              <YearCell year={fullAge} highlighted={fullAge === highlightYear} />
              {showOrigin && <td class="min-w-60 text-sm">{choju.origin}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
