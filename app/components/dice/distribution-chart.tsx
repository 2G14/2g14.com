import { useState } from 'hono/jsx';

import { niceAxis, niceTicks } from '#app/lib/chart-ticks.js';
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
  // ちょうどその値の確率は最大の棒に合わせて縦軸を伸び縮みさせ、以上・以下は 0〜100% で固定する
  const y = niceAxis(mode === 'exact' ? probabilityOf(maxWays, total) * 100 : 100, 5);
  const heightOf = (percent: number) => (percent / y.top) * 100;
  const bars = points
    .map((point, i) => {
      const height = heightOf(probabilityOf(waysOf(point, mode), total) * 100);
      return `M${i} 100V${100 - height}h1V100z`;
    })
    .join('');
  const hoveredPoint = hovered === null ? undefined : points[hovered];
  const first = points[0]?.x ?? 0;
  const ticks = niceTicks(first, points.at(-1)?.x ?? first, 6);

  const onPointer = (e: PointerEvent) => {
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    const index = Math.floor(((e.clientX - rect.left) / rect.width) * points.length);
    setHovered(Math.min(points.length - 1, Math.max(0, index)));
  };

  return (
    <div class="flex flex-col gap-3">
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

      <div class="flex gap-2">
        <div
          class="relative mt-16 h-48 w-12 shrink-0 text-xs text-base-content/60 tabular-nums"
          aria-hidden="true"
        >
          {y.ticks.map((tick) => (
            <span
              class="absolute right-0 translate-y-1/2 whitespace-nowrap"
              style={`bottom: ${heightOf(tick)}%`}
            >
              {tick}%
            </span>
          ))}
        </div>
        <div class="relative min-w-0 flex-1 pt-16">
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
            class="block h-48 w-full touch-pan-y border-b border-base-content/30 text-primary"
            role="img"
            aria-label={`${xName}ごとの確率のグラフ`}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={() => setHovered(null)}
          >
            {y.ticks.slice(1).map((tick) => (
              <line
                x1={0}
                x2={points.length}
                y1={100 - heightOf(tick)}
                y2={100 - heightOf(tick)}
                class="stroke-base-content/10"
                stroke-width={1}
                vector-effect="non-scaling-stroke"
              />
            ))}
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
          <div class="relative h-5 text-xs text-base-content/60 tabular-nums" aria-hidden="true">
            {ticks.map((tick) => (
              <span
                class="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                style={`left: ${((tick - first + 0.5) / points.length) * 100}%`}
              >
                <span class="h-1 w-px bg-base-content/40" />
                <span>{tick}</span>
              </span>
            ))}
          </div>
          <div class="text-center text-xs text-base-content/60">
            {xName}
            {xUnit !== '' && `（${xUnit.trim()}）`}
          </div>
        </div>
      </div>
    </div>
  );
}
