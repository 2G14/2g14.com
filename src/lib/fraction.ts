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
