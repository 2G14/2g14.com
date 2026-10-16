import { formatFraction, formatPercent } from '#app/lib/dice/format.js';
import type { SumWays } from '#src/domain/dice/probability.js';

interface SumTableProps {
  caption: string;
  rows: readonly SumWays[];
  /** 出目の組み合わせの総数（確率の分母） */
  total: number;
}

export default function SumTable({ caption, rows, total }: SumTableProps) {
  const maxWays = Math.max(...rows.map((row) => row.ways));

  return (
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <caption class="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th>合計</th>
            <th class="text-right">通り数</th>
            <th class="min-w-40">確率</th>
            <th class="text-right">その数以上</th>
            <th class="text-right">その数以下</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr class="hover:bg-base-200">
              <th class="text-base">{row.sum}</th>
              <td class="text-right tabular-nums">{row.ways.toLocaleString()}</td>
              <td>
                <div class="flex items-baseline justify-between gap-2 tabular-nums">
                  <span class="font-semibold">{formatPercent(row.ways, total)}</span>
                  <span class="text-xs text-base-content/60">
                    {formatFraction(row.ways, total)}
                  </span>
                </div>
                <div class="mt-1 h-1.5 rounded-full bg-base-300" aria-hidden="true">
                  <div
                    class="h-full rounded-full bg-primary"
                    style={{ width: `${(row.ways / maxWays) * 100}%` }}
                  />
                </div>
              </td>
              <td class="text-right tabular-nums">{formatPercent(row.atLeastWays, total)}</td>
              <td class="text-right tabular-nums">{formatPercent(row.atMostWays, total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
