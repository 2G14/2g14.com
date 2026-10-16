import { reduceFraction } from '#src/lib/fraction.js';

/** 既約分数で書く。確率 1 は「1/1」ではなく「1」にする */
export function formatFraction(ways: number, total: number): string {
  const { numerator, denominator } = reduceFraction(ways, total);
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

const PERCENT = new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 2 });
// 小数第 2 位で丸めると 0 になってしまうほど小さい確率は、有効数字で書く
const SMALL_PERCENT = new Intl.NumberFormat('ja-JP', {
  maximumSignificantDigits: 2,
  maximumFractionDigits: 20,
});

export function formatPercent(ways: number, total: number): string {
  const percent = (ways / total) * 100;
  return `${(percent >= 0.01 ? PERCENT : SMALL_PERCENT).format(percent)}%`;
}
