import { describe, expect, it } from 'vitest';

import { reduceFraction } from '#src/lib/fraction.js';

describe('reduceFraction', () => {
  it('既約分数にする', () => {
    expect(reduceFraction(6n, 36n)).toEqual({ numerator: 1n, denominator: 6n });
    expect(reduceFraction(5n, 36n)).toEqual({ numerator: 5n, denominator: 36n });
    expect(reduceFraction(36n, 36n)).toEqual({ numerator: 1n, denominator: 1n });
  });
});
