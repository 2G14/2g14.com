import { useState } from 'hono/jsx';

import { niceAxis, niceTicks } from '#app/lib/chart-ticks.js';
import { formatFraction, formatPercent, formatWays } from '#app/lib/dice/format.js';
import { type DistributionRow, mostLikely, probabilityOf } from '#src/domain/dice/distribution.js';

type ChartMode = 'exact' | 'atLeast' | 'atMost';

const MODES = ['exact', 'atLeast', 'atMost'] as const satisfies readonly ChartMode[];
const MODE_SUFFIX: Readonly<Record<ChartMode, string>> = {
  exact: '',
  atLeast: ' 以上',
  atMost: ' 以下',
};

interface DistributionChartProps {
  rows: readonly DistributionRow[];
  /** 出目の組み合わせの総数（確率の分母） */
  total: bigint;
  /** 横軸の値の名前と単位（「合計」と「」、「個数」と「 個」） */
  xName: string;
  xUnit: string;
  /** 切り替えボタンの文言 */
  modeLabels: Readonly<Record<ChartMode, string>>;
}

function waysOf(row: DistributionRow, mode: ChartMode): bigint {
  if (mode === 'atLeast') return row.atLeastWays;
  if (mode === 'atMost') return row.atMostWays;
  return row.ways;
}

/**
 * 確率の分布を棒グラフで描き、選んだ棒の通り数と確率をツールチップで出す。棒はポインターのホバー・
 * タップのほか、グラフにフォーカスして矢印キーでも選べ、選んだ値はスライダーとして読み上げられる。
 * 数千本の棒でも重くならないよう、棒は 1 本の path にまとめ、% や分数の整形は選んだ 1 本だけ行う
 */
export default function DistributionChart({
  rows,
  total,
  xName,
  xUnit,
  modeLabels,
}: DistributionChartProps) {
  const [mode, setMode] = useState<ChartMode>('exact');
  const [selected, setSelected] = useState<number | null>(null);

  const peak = mostLikely(rows);
  // ちょうどその値の確率は最大の棒に合わせて縦軸を伸び縮みさせ、以上・以下は 0〜100% で固定する
  const y = niceAxis(mode === 'exact' ? probabilityOf(peak.ways, total) * 100 : 100, 5);
  const heightOf = (percent: number) => (percent / y.top) * 100;
  const bars = rows
    .map((row, i) => {
      const height = heightOf(probabilityOf(waysOf(row, mode), total) * 100);
      return `M${i} 100V${100 - height}h1V100z`;
    })
    .join('');
  const first = rows[0]?.value ?? 0;
  const ticks = niceTicks(first, rows.at(-1)?.value ?? first, 6);

  const selectedRow = selected === null ? null : (rows[selected] ?? null);
  const selectedWays = selectedRow === null ? null : waysOf(selectedRow, mode);
  const selectedFraction = selectedWays === null ? null : formatFraction(selectedWays, total);
  const selectedLabel =
    selectedRow === null ? '' : `${xName} ${selectedRow.value}${xUnit}${MODE_SUFFIX[mode]}`;
  const selectedPercent = selectedWays === null ? '' : formatPercent(selectedWays, total);
  const selectedText =
    selectedWays === null
      ? ''
      : `${selectedLabel}：${selectedPercent}${selectedFraction === null ? '' : `（${selectedFraction}）`}、${formatWays(selectedWays)} 通り`;

  const select = (index: number) => setSelected(Math.min(rows.length - 1, Math.max(0, index)));
  const onPointer = (e: PointerEvent) => {
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    select(Math.floor(((e.clientX - rect.left) / rect.width) * rows.length));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const current = selected ?? rows.findIndex((row) => row.value === peak.values[0]);
    const page = Math.max(1, Math.round(rows.length / 10));
    const next: Readonly<Record<string, number>> = {
      ArrowRight: current + 1,
      ArrowUp: current + 1,
      ArrowLeft: current - 1,
      ArrowDown: current - 1,
      PageUp: current + page,
      PageDown: current - page,
      Home: 0,
      End: rows.length - 1,
    };
    const index = next[e.key];
    if (index === undefined) return;
    e.preventDefault();
    select(index);
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
          {/* 選んだときだけ差し込むと、後ろの svg が挿し直されてキーボードのフォーカスが外れるため、常に置いて隠す */}
          <div
            class={`pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-box bg-neutral px-3 py-1.5 text-xs whitespace-nowrap text-neutral-content tabular-nums shadow ${selected === null ? 'hidden' : ''}`}
            style={`left: clamp(5rem, ${(((selected ?? 0) + 0.5) / rows.length) * 100}%, calc(100% - 5rem))`}
            aria-hidden="true"
          >
            <div class="font-bold">{selectedLabel}</div>
            <div>
              {selectedPercent}
              {selectedFraction !== null && `（${selectedFraction}）`}
            </div>
            <div>{selectedWays !== null && `${formatWays(selectedWays)} 通り`}</div>
          </div>
          <svg
            viewBox={`0 0 ${rows.length} 100`}
            preserveAspectRatio="none"
            class="block h-48 w-full touch-pan-y border-b border-base-content/30 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            tabindex={0}
            role="slider"
            aria-label={`${xName}ごとの確率のグラフ。矢印キーで値を選べます`}
            aria-valuemin={first}
            aria-valuemax={rows.at(-1)?.value ?? first}
            aria-valuenow={selectedRow?.value ?? peak.values[0] ?? first}
            aria-valuetext={selectedText || undefined}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            // タッチでは指を離すと pointerleave が来るため、タップした値が見えるようマウスのときだけ消す
            onPointerLeave={(e: PointerEvent) => {
              if (e.pointerType === 'mouse') setSelected(null);
            }}
            onKeyDown={onKeyDown}
          >
            {y.ticks.slice(1).map((tick) => (
              <line
                x1={0}
                x2={rows.length}
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
              stroke={rows.length > 60 ? 'none' : 'var(--color-base-100)'}
              stroke-width={1}
              vector-effect="non-scaling-stroke"
            />
            {selected !== null && (
              <rect
                x={selected}
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
                style={`left: ${((tick - first + 0.5) / rows.length) * 100}%`}
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
