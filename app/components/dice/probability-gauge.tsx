import { formatFraction, formatPercent } from '#app/lib/dice/format.js';
import { probabilityOf } from '#src/domain/dice/distribution.js';

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
  const percent = probabilityOf(ways, total) * 100;
  const percentText = formatPercent(ways, total);
  const fraction = formatFraction(ways, total);
  return (
    <div class="flex items-center gap-4 rounded-box bg-base-200 px-4 py-3">
      <div class="relative size-16 shrink-0" role="img" aria-label={percentText}>
        {/* daisyUI の radial-progress は値の弧しか描かないため、1% のような小さい値でも円と分かるよう背景の輪を敷く */}
        <div class="absolute inset-0 rounded-full border-8 border-primary/20" />
        <div
          class="radial-progress absolute inset-0 text-primary"
          // オブジェクトで渡すと数値に px が付き、daisyUI の calc(var(--value) * 1%) が壊れる
          style={`--value:${percent};--size:4rem;--thickness:0.5rem`}
        />
      </div>
      <div class="min-w-0">
        <div class="text-xs text-base-content/60">{title}</div>
        <div class="text-2xl font-bold tabular-nums">{percentText}</div>
        <div class="text-xs text-base-content/60 tabular-nums">
          {description}
          {fraction !== null && `（${fraction}）`}
        </div>
      </div>
    </div>
  );
}
