import { useState } from 'hono/jsx';

import { formatFraction, formatPercent, formatWays } from '#app/lib/dice/format.js';
import { probabilityOf } from '#src/domain/dice/probability.js';

/** 横軸の 1 つの値（合計や個数）と、ちょうど・以上・以下になる通り数 */
interface ChartPoint {
  readonly x: number;
  readonly ways: bigint;
  readonly atLeastWays: bigint;
  readonly atMostWays: bigint;
}

type ChartMode = 'exact' | 'atLeast' | 'atMost';

const MODES = ['exact', 'atLeast', 'atMost'] as const satisfies readonly ChartMode[];
const MODE_SUFFIX: Readonly<Record<ChartMode, string>> = {
  exact: '',
  atLeast: ' 以上',
  atMost: ' 以下',
};

interface DistributionChartProps {
  points: readonly ChartPoint[];
  /** 出目の組み合わせの総数（確率の分母） */
  total: bigint;
  /** 横軸の値の名前と単位（「合計」と「」、「個数」と「 個」） */
  xName: string;
  xUnit: string;
  /** 切り替えボタンの文言 */
  modeLabels: Readonly<Record<ChartMode, string>>;
}

function waysOf(point: ChartPoint, mode: ChartMode): bigint {
  if (mode === 'atLeast') return point.atLeastWays;
  if (mode === 'atMost') return point.atMostWays;
  return point.ways;
}

/**
 * 確率の分布を棒グラフで描き、ホバー（タップ）した棒の通り数と確率をツールチップで出す。
 * 数千本の棒でも重くならないよう、棒は 1 本の path にまとめ、% や分数の整形はホバー中の 1 本だけ行う
 */
export default function DistributionChart({
  points,
  total,
  xName,
  xUnit,
  modeLabels,
}: DistributionChartProps) {
  const [mode, setMode] = useState<ChartMode>('exact');
  const [hovered, setHovered] = useState<number | null>(null);

  const maxWays = points.reduce((max, point) => (point.ways > max ? point.ways : max), 0n);
  // ちょうどその値の確率は最大の棒を、以上・以下は 100% をグラフの高さいっぱいにする
  const scale = mode === 'exact' ? maxWays : total;
  const bars = points
    .map((point, i) => `M${i} 100V${100 - probabilityOf(waysOf(point, mode), scale) * 100}h1V100z`)
    .join('');
  const hoveredPoint = hovered === null ? undefined : points[hovered];

  const onPointer = (e: PointerEvent) => {
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    const index = Math.floor(((e.clientX - rect.left) / rect.width) * points.length);
    setHovered(Math.min(points.length - 1, Math.max(0, index)));
  };

  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="join" role="group" aria-label="グラフの表示">
          {MODES.map((m) => (
            <button
              type="button"
              class={`btn join-item btn-sm ${m === mode ? 'btn-primary' : ''}`}
              aria-pressed={String(m === mode)}
              onClick={() => setMode(m)}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
        <p class="text-xs text-base-content/60 tabular-nums">
          縦軸の上端（点線）：{mode === 'exact' ? formatPercent(maxWays, total) : '100%'}
        </p>
      </div>

      <div class="relative pt-16">
        {hoveredPoint !== undefined && hovered !== null && (
          <div
            class="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-box bg-neutral px-3 py-1.5 text-xs whitespace-nowrap text-neutral-content tabular-nums shadow"
            style={`left: clamp(5rem, ${((hovered + 0.5) / points.length) * 100}%, calc(100% - 5rem))`}
          >
            <div class="font-bold">
              {xName} {hoveredPoint.x}
              {xUnit}
              {MODE_SUFFIX[mode]}
            </div>
            <div>
              {formatPercent(waysOf(hoveredPoint, mode), total)}
              {formatFraction(waysOf(hoveredPoint, mode), total) !== null &&
                `（${formatFraction(waysOf(hoveredPoint, mode), total)}）`}
            </div>
            <div>{formatWays(waysOf(hoveredPoint, mode))} 通り</div>
          </div>
        )}
        <svg
          viewBox={`0 0 ${points.length} 100`}
          preserveAspectRatio="none"
          class="block h-48 w-full touch-pan-y border-t border-dashed border-base-300 text-primary"
          role="img"
          aria-label={`${xName}ごとの確率のグラフ`}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setHovered(null)}
        >
          <path
            d={bars}
            fill="currentColor"
            // 棒が少ないときだけ、隣り合う棒の境目を背景色の線で見せる
            stroke={points.length > 60 ? 'none' : 'var(--color-base-100)'}
            stroke-width={1}
            vector-effect="non-scaling-stroke"
          />
          {hovered !== null && (
            <rect
              x={hovered}
              y={0}
              width={1}
              height={100}
              class="fill-base-content/15 stroke-base-content/40"
              stroke-width={1}
              vector-effect="non-scaling-stroke"
            />
          )}
        </svg>
        <div class="mt-1 flex justify-between text-xs text-base-content/60 tabular-nums">
          <span>
            {points[0]?.x}
            {xUnit}
          </span>
          <span>{xName}</span>
          <span>
            {points.at(-1)?.x}
            {xUnit}
          </span>
        </div>
      </div>
    </div>
  );
}
