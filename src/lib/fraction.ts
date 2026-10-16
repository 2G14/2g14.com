interface Fraction {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

function gcd(a: bigint, b: bigint): bigint {
  return b === 0n ? a : gcd(b, a % b);
}

/** 正の整数どうしの分数を既約分数にする */
export function reduceFraction(numerator: bigint, denominator: bigint): Fraction {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

/**
 * 1 以下の分数を Number の近似値にする。分母が Number の範囲を超えても精度を落とさないよう、
 * 分子を 10 の累乗倍して商が 20 桁ほどになるように割ってから戻す
 */
export function fractionToNumber(numerator: bigint, denominator: bigint): number {
  if (numerator === 0n) return 0;
  const shift = Math.max(0, denominator.toString().length - numerator.toString().length + 20);
  return Number((numerator * 10n ** BigInt(shift)) / denominator) / 10 ** shift;
}
