import ProbabilityBar from '#app/components/dice/probability-bar.js';
import { formatFraction, formatPercent } from '#app/lib/dice/format.js';
import { fractionToNumber } from '#src/lib/fraction.js';

interface ProbabilityCellProps {
  ways: bigint;
  total: bigint;
  /** 棒の長さの基準にする通り数（表の中の最大値） */
  maxWays: bigint;
}

/** 確率の % と既約分数に、表の中での大きさを表す棒を添える */
export default function ProbabilityCell({ ways, total, maxWays }: ProbabilityCellProps) {
  const fraction = formatFraction(ways, total);
  return (
    <td>
      <div class="flex items-baseline justify-between gap-2 tabular-nums">
        <span class="font-semibold">{formatPercent(ways, total)}</span>
        {fraction !== null && <span class="text-xs text-base-content/60">{fraction}</span>}
      </div>
      <ProbabilityBar ratio={fractionToNumber(ways, maxWays)} />
    </td>
  );
}
