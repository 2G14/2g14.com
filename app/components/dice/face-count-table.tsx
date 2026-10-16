import ProbabilityCell from '#app/components/dice/probability-cell.js';
import { formatPercent, formatWays } from '#app/lib/dice/format.js';
import type { FaceCountWays } from '#src/domain/dice/probability.js';

interface FaceCountTableProps {
  caption: string;
  rows: readonly FaceCountWays[];
  total: bigint;
}

export default function FaceCountTable({ caption, rows, total }: FaceCountTableProps) {
  const maxWays = rows.reduce((max, row) => (row.ways > max ? row.ways : max), 0n);
  return (
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <caption class="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th>個数</th>
            <th class="text-right">通り数</th>
            <th class="min-w-40">ちょうどその個数</th>
            <th class="text-right">その個数以上</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr class="hover:bg-base-200">
              <th class="text-base whitespace-nowrap">{row.count} 個</th>
              <td class="text-right tabular-nums">{formatWays(row.ways)}</td>
              <ProbabilityCell ways={row.ways} total={total} maxWays={maxWays} />
              <td class="text-right tabular-nums">{formatPercent(row.atLeastWays, total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
