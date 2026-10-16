import ProbabilityCell from '#app/components/dice/probability-cell.js';
import { formatPercent, formatWays } from '#app/lib/dice/format.js';
import type { SumWays } from '#src/domain/dice/probability.js';

interface SumTableProps {
  caption: string;
  rows: readonly SumWays[];
  /** 出目の組み合わせの総数（確率の分母） */
  total: bigint;
  maxWays: bigint;
}

export default function SumTable({ caption, rows, total, maxWays }: SumTableProps) {
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
              <td class="text-right tabular-nums">{formatWays(row.ways)}</td>
              <ProbabilityCell ways={row.ways} total={total} maxWays={maxWays} />
              <td class="text-right tabular-nums">{formatPercent(row.atLeastWays, total)}</td>
              <td class="text-right tabular-nums">{formatPercent(row.atMostWays, total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
