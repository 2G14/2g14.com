import { probabilityOf } from '#src/domain/dice/distribution.js';
import { reduceFraction } from '#src/lib/fraction.js';

const SUPERSCRIPT_DIGITS: Readonly<Record<string, string>> = {
  '-': '⁻',
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

/** 「1.2×10⁻¹⁹」の形で書く */
function formatScientific(value: number): string {
  const [mantissa, exponent] = value.toExponential(1).split('e');
  const superscript = [...String(Number(exponent))].map((c) => SUPERSCRIPT_DIGITS[c] ?? c).join('');
  return `${mantissa}×10${superscript}`;
}

const PERCENT = new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 2 });
// 小数第 2 位で丸めると 0 になってしまうほど小さい確率は、有効数字で書く
const SMALL_PERCENT = new Intl.NumberFormat('ja-JP', {
  maximumSignificantDigits: 2,
  maximumFractionDigits: 20,
});

/** 0〜100 の間の % を、0 に丸めずに書く */
function formatPercentValue(percent: number): string {
  if (percent >= 0.01) return PERCENT.format(percent);
  // 0.000001% より小さいと 0 が並びすぎて桁を読み取れない
  if (percent >= 1e-6) return SMALL_PERCENT.format(percent);
  return formatScientific(percent);
}

/**
 * 確率を % で書く。0% と 100% はちょうど 0 と 1 のときだけにする。
 * 1 にごく近い確率（100D6 で特定の目が 1 個以上出る 99.9999988% など）は、小数第 2 位で丸めると
 * 100% になって「必ず起きる」と読めてしまうため、100% との差が分かる桁まで書く
 */
export function formatPercent(ways: bigint, total: bigint): string {
  if (ways === 0n) return '0%';
  if (ways === total) return '100%';
  const rest = probabilityOf(total - ways, total) * 100;
  if (rest >= 0.01) return `${formatPercentValue(probabilityOf(ways, total) * 100)}%`;
  // 差が小さすぎると 100 から引いた値が Number の精度では 100 になってしまうため、差を書く
  if (rest < 1e-6) return `100% − ${formatScientific(rest)}%`;
  const digits = Math.ceil(-Math.log10(rest)) + 1;
  return `${new Intl.NumberFormat('ja-JP', { maximumFractionDigits: digits }).format(100 - rest)}%`;
}

/**
 * 桁が多すぎると読めないため、出目の組み合わせの総数が 12 桁以下のときだけ既約分数で書く。確率 1 は「1」。
 * 総数が大きいと約分しても分母はまず縮まらないうえ、200 桁の数の約分は時間がかかる
 */
export function formatFraction(ways: bigint, total: bigint): string | null {
  if (total.toString().length > 12) return null;
  const { numerator, denominator } = reduceFraction(ways, total);
  return denominator === 1n ? String(numerator) : `${numerator}/${denominator}`;
}

/**
 * 通り数を書く。maxDigits 桁を超えると「2.8×10¹⁹⁷」の形にする。
 * 既定の 15 桁は、それを超えると Number で正確に表せず下の桁が変わってしまう境目
 */
export function formatWays(ways: bigint, maxDigits = 15): string {
  if (ways.toString().length <= maxDigits) return Number(ways).toLocaleString('ja-JP');
  return formatScientific(Number(ways));
}
