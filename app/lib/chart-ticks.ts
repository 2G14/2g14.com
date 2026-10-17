/** range を最大 intervals 個の区間に分ける、1・2・5×10^k のきりのよい刻み幅 */
function niceStep(range: number, intervals: number): number {
  const rough = range / intervals;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  return [1, 2, 5, 10].map((m) => m * magnitude).find((step) => step >= rough) ?? 10 * magnitude;
}

/** 0.1 × 3 が 0.30000000000000004 になるような浮動小数点の誤差を、刻み幅の桁で丸めて消す */
function roundToStep(value: number, step: number): number {
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  return Number(value.toFixed(decimals));
}

export interface AxisScale {
  readonly top: number;
  readonly ticks: readonly number[];
}

/**
 * 目盛りのラベルが重ならないかを見積もるための、グラフの最小の幅と 1 桁の幅。幅 360px のスマホでの
 * グラフの幅（実測 224px）に合わせる。実際の幅を測ると、サーバーで描画する時点では決められない
 */
const MIN_CHART_WIDTH_PX = 224;
const DIGIT_WIDTH_PX = 7;
const LABEL_GAP_PX = 4;

function digitsOf(n: number): number {
  return String(n).length;
}

/**
 * first〜last の整数の範囲に、両端と、1・2・5×10^k 刻みのきりのよい目盛りを最大 maxCount 本ほど置く。
 * 両端が無いと範囲が読み取れないため必ず置き（ラベルは内側に寄せて描く）、両端のラベルと重なるほど近い
 * きりのよい目盛りだけ省く。省く距離は、両端のラベルの幅と、中央に描く目盛りのラベルの半分の幅から決める
 */
export function niceTicks(first: number, last: number, maxCount: number): number[] {
  const range = last - first;
  if (range <= 0) return [first];
  // 横軸は整数なので、1 より細かい刻みにはしない
  const step = Math.max(1, niceStep(range, maxCount - 1));
  const pxOf = (distance: number) => (distance / range) * MIN_CHART_WIDTH_PX;
  const clearOf = (end: number, tick: number) =>
    pxOf(Math.abs(tick - end)) >=
    digitsOf(end) * DIGIT_WIDTH_PX + (digitsOf(tick) * DIGIT_WIDTH_PX) / 2 + LABEL_GAP_PX;
  const inner: number[] = [];
  for (let tick = Math.ceil(first / step) * step; tick <= last; tick += step) {
    if (tick !== first && tick !== last && clearOf(first, tick) && clearOf(last, tick)) {
      inner.push(tick);
    }
  }
  return [first, ...inner, last];
}

/**
 * 0〜max の縦軸を最大 maxIntervals 個の区間に分け、max 以上で最小のきりのよい値を上端にした目盛りを返す。
 * 上端を max ちょうどにすると、目盛りが上端に揃わず読みにくい
 */
export function niceAxis(max: number, maxIntervals: number): AxisScale {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const step = niceStep(max, maxIntervals);
  const count = Math.ceil(roundToStep(max / step, 1e-9));
  const ticks = Array.from({ length: count + 1 }, (_, i) => roundToStep(i * step, step));
  return { top: roundToStep(count * step, step), ticks };
}
