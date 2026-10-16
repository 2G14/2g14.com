/**
 * first〜last の整数の範囲に、1・2・5×10^k 刻みのきりのよい目盛りを最大 maxCount 本ほど置く。
 * 範囲が 2〜12 でも 100〜10000 でも、ラベルが重ならない本数に収める
 */
export function niceTicks(first: number, last: number, maxCount: number): number[] {
  const range = last - first;
  if (range <= 0) return [first];
  const rough = range / (maxCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const nice = [1, 2, 5, 10].map((m) => m * magnitude).find((step) => step >= rough);
  // 横軸は整数なので、1 より細かい刻みにはしない
  const step = Math.max(1, nice ?? 10 * magnitude);
  const ticks: number[] = [];
  for (let tick = Math.ceil(first / step) * step; tick <= last; tick += step) ticks.push(tick);
  return ticks;
}
