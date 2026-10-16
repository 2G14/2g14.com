import { describe, expect, it } from 'vitest';

import { fractionToNumber, reduceFraction } from '#src/lib/fraction.js';

describe('reduceFraction', () => {
  it('既約分数にする', () => {
    expect(reduceFraction(6n, 36n)).toEqual({ numerator: 1n, denominator: 6n });
    expect(reduceFraction(5n, 36n)).toEqual({ numerator: 5n, denominator: 36n });
    expect(reduceFraction(36n, 36n)).toEqual({ numerator: 1n, denominator: 1n });
  });
});

describe('fractionToNumber', () => {
  it('分数を小数にする', () => {
    expect(fractionToNumber(1n, 4n)).toBe(0.25);
    expect(fractionToNumber(1n, 36n)).toBeCloseTo(1 / 36, 15);
    expect(fractionToNumber(0n, 36n)).toBe(0);
    expect(fractionToNumber(36n, 36n)).toBe(1);
  });

  it('分母が Number の範囲を超えても近似値を求める', () => {
    expect(fractionToNumber(3n, 10n ** 200n)).toBeCloseTo(3e-200, 213);
    expect(fractionToNumber(10n ** 199n, 10n ** 200n)).toBeCloseTo(0.1, 15);
  });
});
