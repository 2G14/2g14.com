import { describe, expect, it } from 'vitest';

import { reduceFraction } from '#src/lib/fraction.js';

describe('reduceFraction', () => {
  it('既約分数にする', () => {
    expect(reduceFraction(6, 36)).toEqual({ numerator: 1, denominator: 6 });
    expect(reduceFraction(5, 36)).toEqual({ numerator: 5, denominator: 36 });
    expect(reduceFraction(36, 36)).toEqual({ numerator: 1, denominator: 1 });
  });
});
