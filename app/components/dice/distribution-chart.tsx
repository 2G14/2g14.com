import { useMemo, useState } from 'hono/jsx';

import { niceAxis, niceTicks, type TickLabelSpace } from '#app/lib/chart-ticks.js';
import { formatProbability, formatWays } from '#app/lib/dice/format.js';
import { type DistributionRow, mostLikely, probabilityOf } from '#src/domain/dice/distribution.js';

const MODES = ['exact', 'atLeast', 'atMost'] as const;

type ChartMode = (typeof MODES)[number];

/**
 * 横軸の目盛りのラベルの大きさ。グラフの幅は、幅 360px のスマホで縦軸のラベル（w-12）と間（gap-2）を
 * 除いた実測の 224px で、ラベルは text-xs の数字 1 桁が約 7px。実際の幅を測る方法では、サーバーで
 * 描画する時点で目盛りを決められない
 */
const TICK_LABEL_SPACE: TickLabelSpace = { chartWidthPx: 224, digitWidthPx: 7, gapPx: 4 };

/** 表示の切り替えごとに、使う通り数と、値に添える言葉 */
interface ModeConfig {
  readonly key: keyof Omit<DistributionRow, 'value'>;
  readonly suffix: string;
}

const MODE_CONFIG: Readonly<Record<ChartMode, ModeConfig>> = {
  exact: { key: 'ways', suffix: '' },
  atLeast: { key: 'atLeastWays', suffix: ' 以上' },
  atMost: { key: 'atMostWays', suffix: ' 以下' },
};

/** 横軸の名前と単位（単位が無ければ空文字） */
export interface AxisLabel {
  readonly name: string;
  readonly unit: string;
}

/** 選んだ棒の位置と、それを選んだときの分布 */
interface Selection {
  readonly rows: readonly DistributionRow[];
  readonly index: number;
}

interface DistributionChartProps {
  rows: readonly DistributionRow[];
  /** 出目の組み合わせの総数（確率の分母） */
  total: bigint;
  axis: AxisLabel;
  /** 切り替えボタンの文言 */
  modeLabels: Readonly<Record<ChartMode, string>>;
}

function waysOf(row: DistributionRow, mode: ChartMode): bigint {
  return row[MODE_CONFIG[mode].key];
}

/**
 * 確率の分布を棒グラフで描き、選んだ棒の通り数と確率をツールチップで出す。棒はポインターのホバー・
 * タップのほか、グラフにフォーカスして矢印キーでも選べ、選んだ値はスライダーとして読み上げられる。
 * 数千本の棒でも重くならないよう、棒は 1 本の path にまとめて分布と表示の切り替えが変わったときだけ作り、
 * % や分数の整形は選んだ 1 本だけ行う
 */
export default function DistributionChart({
  rows,
  total,
  axis,
  modeLabels,
}: DistributionChartProps) {
  const [mode, setMode] = useState<ChartMode>('exact');
  // 選んだ位置は、どの分布の上で選んだかと一緒に持つ。個数や面数が変わると棒の数が変わり、
  // 前の位置のままだと別の棒や無い棒を指すため、分布が変わった時点でその場で無効にする
  const [selection, setSelection] = useState<Selection | null>(null);
  const selected = selection?.rows === rows ? selection.index : null;

  const peak = useMemo(() => mostLikely(rows), [rows]);
  const peakIndex = Math.max(
    0,
    rows.findIndex((row) => row.value === peak.values[0]),
  );
  const first = rows[0]?.value ?? 0;
  const last = rows.at(-1)?.value ?? first;
  const ticks = useMemo(() => niceTicks(first, last, 6, TICK_LABEL_SPACE), [first, last]);
  // ちょうどその値の確率は最大の棒に合わせて縦軸を伸び縮みさせ、以上・以下は 0〜100% で固定する
  const y = useMemo(
    () => niceAxis(mode === 'exact' ? probabilityOf(peak.ways, total) * 100 : 100, 5),
    [mode, peak, total],
  );
  const heightOf = (percent: number) => (percent / y.top) * 100;
  const bars = useMemo(
    () =>
      rows
        .map((row, i) => {
          const height = heightOf(probabilityOf(waysOf(row, mode), total) * 100);
          return `M${i} 100V${100 - height}h1V100z`;
        })
        .join(''),
    [rows, mode, total, y],
  );

  const unit = axis.unit === '' ? '' : ` ${axis.unit}`;
  const labelOf = (row: DistributionRow) =>
    `${axis.name} ${row.value}${unit}${MODE_CONFIG[mode].suffix}`;
  const selectedRow = selected === null ? null : (rows[selected] ?? null);
  const selectedWays = selectedRow === null ? null : waysOf(selectedRow, mode);
  // 読み上げは、まだ選んでいなくても最頻値の値にしておく。フォーカスしてから選ぶまでの間に
  // 何も読まれない時間ができないようにする
  const spokenRow = selectedRow ?? rows[peakIndex] ?? null;
  const spokenText =
    spokenRow === null
      ? null
      : `${labelOf(spokenRow)}：${formatProbability(waysOf(spokenRow, mode), total)}、${formatWays(waysOf(spokenRow, mode))} 通り`;

  const select = (index: number) =>
    setSelection({ rows, index: Math.min(rows.length - 1, Math.max(0, index)) });
  const onPointer = (e: PointerEvent) => {
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    select(Math.floor(((e.clientX - rect.left) / rect.width) * rows.length));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const current = selected ?? peakIndex;
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
            class={`pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-box bg-neutral px-3 py-1.5 text-xs whitespace-nowrap text-neutral-content tabular-nums shadow ${selectedRow === null ? 'hidden' : ''}`}
            style={`left: clamp(5rem, ${(((selected ?? 0) + 0.5) / rows.length) * 100}%, calc(100% - 5rem))`}
            aria-hidden="true"
          >
            <div class="font-bold">{selectedRow !== null && labelOf(selectedRow)}</div>
            <div>{selectedWays !== null && formatProbability(selectedWays, total)}</div>
            <div>{selectedWays !== null && `${formatWays(selectedWays)} 通り`}</div>
          </div>
          <svg
            viewBox={`0 0 ${rows.length} 100`}
            preserveAspectRatio="none"
            class="block h-48 w-full touch-pan-y border-b border-base-content/30 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            tabindex={0}
            role="slider"
            aria-label={`${axis.name}ごとの確率のグラフ。矢印キーで値を選べます`}
            aria-valuemin={first}
            aria-valuemax={last}
            aria-valuenow={spokenRow?.value ?? first}
            aria-valuetext={spokenText ?? undefined}
            // フォーカスした時点で読み上げる値が無いと、確率を聞くにはまずキーを押す必要がある
            onFocus={() => {
              if (selected === null) select(peakIndex);
            }}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            // タッチでは指を離すと pointerleave が来るため、タップした値が見えるようマウスのときだけ消す。
            // キーボードで選んでいる最中にマウスが外れたときも、選んだ値を残す
            onPointerLeave={(e: PointerEvent) => {
              if (e.pointerType === 'mouse' && document.activeElement !== e.currentTarget) {
                setSelection(null);
              }
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
            {selectedRow !== null && (
              <rect
                x={selected ?? 0}
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
            {ticks.map((tick) => {
              // 両端のラベルは、グラフの外にはみ出さないよう内側に寄せて描く
              const align =
                tick === first && ticks.length > 1
                  ? 'items-start'
                  : tick === last && ticks.length > 1
                    ? '-translate-x-full items-end'
                    : '-translate-x-1/2 items-center';
              return (
                <span
                  class={`absolute top-0 flex flex-col ${align}`}
                  style={`left: ${((tick - first + 0.5) / rows.length) * 100}%`}
                >
                  <span class="h-1 w-px bg-base-content/40" />
                  <span>{tick}</span>
                </span>
              );
            })}
          </div>
          <div class="text-center text-xs text-base-content/60">
            {axis.name}
            {axis.unit !== '' && `（${axis.unit}）`}
          </div>
        </div>
      </div>
    </div>
  );
}
