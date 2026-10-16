import { describe, expect, it } from 'vitest';

import { niceTicks } from '#app/lib/chart-ticks.js';

describe('niceTicks', () => {
  it.each([
    [2, 12, [2, 4, 6, 8, 10, 12]],
    [1, 6, [1, 2, 3, 4, 5, 6]],
    [3, 18, [5, 10, 15]],
    [0, 100, [0, 20, 40, 60, 80, 100]],
    [100, 10000, [2000, 4000, 6000, 8000, 10000]],
    [0, 2, [0, 1, 2]],
  ])('%i〜%i の目盛り', (first, last, expected) => {
    expect(niceTicks(first, last, 6)).toEqual(expected);
  });

  it('範囲が 1 点なら、その点だけ', () => {
    expect(niceTicks(1, 1, 6)).toEqual([1]);
  });
});
