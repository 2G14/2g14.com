import { formatFraction, formatPercent } from '#app/lib/dice/format.js';
import { fractionToNumber } from '#src/lib/fraction.js';

interface ProbabilityGaugeProps {
  title: string;
  description: string;
  ways: bigint;
  total: bigint;
}

/** 1 つの確率を円グラフ状のゲージで見せる */
export default function ProbabilityGauge({
  title,
  description,
  ways,
  total,
}: ProbabilityGaugeProps) {
  const percent = fractionToNumber(ways, total) * 100;
  const fraction = formatFraction(ways, total);
  return (
    <div class="flex items-center gap-4 rounded-box bg-base-200 px-4 py-3">
      <div
        class="radial-progress shrink-0 text-primary"
        // オブジェクトで渡すと数値に px が付き、daisyUI の calc(var(--value) * 1%) が壊れる
        style={`--value:${percent};--size:4rem;--thickness:0.5rem`}
        role="img"
        aria-label={`${formatPercent(ways, total)}`}
      />
      <div class="min-w-0">
        <div class="text-xs text-base-content/60">{title}</div>
        <div class="text-2xl font-bold tabular-nums">{formatPercent(ways, total)}</div>
        <div class="text-xs text-base-content/60 tabular-nums">
          {description}
          {fraction !== null && `（${fraction}）`}
        </div>
      </div>
    </div>
  );
}
