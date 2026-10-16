interface Fraction {
  readonly numerator: number;
  readonly denominator: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** 正の整数どうしの分数を既約分数にする */
export function reduceFraction(numerator: number, denominator: number): Fraction {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}
