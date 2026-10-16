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

/**
 * first〜last の整数の範囲に、1・2・5×10^k 刻みのきりのよい目盛りを最大 maxCount 本ほど置く。
 * 範囲が 2〜12 でも 100〜10000 でも、ラベルが重ならない本数に収める
 */
export function niceTicks(first: number, last: number, maxCount: number): number[] {
  const range = last - first;
  if (range <= 0) return [first];
  // 横軸は整数なので、1 より細かい刻みにはしない
  const step = Math.max(1, niceStep(range, maxCount - 1));
  const ticks: number[] = [];
  for (let tick = Math.ceil(first / step) * step; tick <= last; tick += step) ticks.push(tick);
  return ticks;
}

/**
 * 0〜max の縦軸を最大 maxIntervals 個の区間に分け、max 以上で最小のきりのよい値を上端にした目盛りを返す。
 * 上端を max ちょうどにすると、目盛りが上端に揃わず読みにくい
 */
export function niceAxis(max: number, maxIntervals: number): { top: number; ticks: number[] } {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const step = niceStep(max, maxIntervals);
  const count = Math.ceil(roundToStep(max / step, 1e-9));
  const ticks = Array.from({ length: count + 1 }, (_, i) => roundToStep(i * step, step));
  return { top: roundToStep(count * step, step), ticks };
}
