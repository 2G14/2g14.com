import { fractionToNumber, reduceFraction } from '#src/lib/fraction.js';

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

export function formatPercent(ways: bigint, total: bigint): string {
  const percent = fractionToNumber(ways, total) * 100;
  if (percent === 0 || percent >= 0.01) return `${PERCENT.format(percent)}%`;
  // 0.000001% より小さいと 0 が並びすぎて桁を読み取れない
  if (percent >= 1e-6) return `${SMALL_PERCENT.format(percent)}%`;
  return `${formatScientific(percent)}%`;
}

/**
 * 桁が多すぎると読めないため、出目の組み合わせの総数が 12 桁以下のときだけ既約分数で書く。確率 1 は「1」。
 * 総数が大きいと約分しても分母はまず縮まらないうえ、200 桁の数の約分は表全体で 0.5 秒ほどかかる
 */
export function formatFraction(ways: bigint, total: bigint): string | null {
  if (total.toString().length > 12) return null;
  const { numerator, denominator } = reduceFraction(ways, total);
  return denominator === 1n ? String(numerator) : `${numerator}/${denominator}`;
}

/** 通り数を書く。Number で正確に表せない 16 桁以上は「2.8×10¹⁹⁷」の形にする */
export function formatWays(ways: bigint): string {
  if (ways.toString().length <= 15) return Number(ways).toLocaleString('ja-JP');
  return formatScientific(Number(ways));
}
