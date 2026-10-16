import type { SumWays } from '#src/domain/dice/probability.js';
import { fractionToNumber } from '#src/lib/fraction.js';

interface SumChartProps {
  rows: readonly SumWays[];
  maxWays: bigint;
  /** 最も出やすい合計（横軸の中央に添える） */
  modes: readonly number[];
}

/** 合計ごとの確率の棒グラフ。合計が数千種類あっても描けるよう、棒を 1 本の path にまとめる */
export default function SumChart({ rows, maxWays, modes }: SumChartProps) {
  const bars = rows
    .map((row, i) => {
      const height = fractionToNumber(row.ways, maxWays) * 100;
      return `M${i} 100V${100 - height}h1V100z`;
    })
    .join('');
  const first = rows[0]?.sum;
  const last = rows.at(-1)?.sum;

  return (
    // daisyUI の .card figure は中身を横に並べるため、figure ではなく div で囲む
    <div>
      <svg
        viewBox={`0 0 ${rows.length} 100`}
        preserveAspectRatio="none"
        class="h-40 w-full text-primary"
        role="img"
        aria-label={`合計ごとの確率のグラフ。合計 ${modes.join('・')} が最も出やすい`}
      >
        <path
          d={bars}
          fill="currentColor"
          // 棒が少ないときだけ、隣り合う棒の境目を背景色の線で見せる
          stroke={rows.length > 60 ? 'none' : 'var(--color-base-100)'}
          stroke-width={1}
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <div class="mt-1 flex justify-between text-xs text-base-content/60 tabular-nums">
        <span>{first}</span>
        <span>最も出やすい合計 {modes.join('・')}</span>
        <span>{last}</span>
      </div>
    </div>
  );
}
