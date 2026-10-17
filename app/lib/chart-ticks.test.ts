import { describe, expect, it } from 'vitest';

import { niceAxis, niceTicks } from '#app/lib/chart-ticks.js';

describe('niceTicks', () => {
  it.each([
    [2, 12, [2, 4, 6, 8, 10, 12]],
    [1, 6, [1, 2, 3, 4, 5, 6]],
    [3, 18, [3, 10, 15, 18]],
    [0, 100, [0, 20, 40, 60, 80, 100]],
    [1, 100, [1, 20, 40, 60, 80, 100]],
    [100, 10000, [100, 2000, 4000, 6000, 8000, 10000]],
    [99, 9900, [99, 2000, 4000, 6000, 8000, 9900]],
    [0, 2, [0, 1, 2]],
  ])('%i〜%i の目盛りは両端を含む', (first, last, expected) => {
    expect(niceTicks(first, last, 6)).toEqual(expected);
  });

  it('範囲が 1 点なら、その点だけ', () => {
    expect(niceTicks(1, 1, 6)).toEqual([1]);
  });
});

describe('niceAxis', () => {
  it.each([
    [100, 100, [0, 20, 40, 60, 80, 100]],
    [16.67, 20, [0, 5, 10, 15, 20]],
    [2.33, 2.5, [0, 0.5, 1, 1.5, 2, 2.5]],
    [0.14, 0.15, [0, 0.05, 0.1, 0.15]],
    [36.97, 40, [0, 10, 20, 30, 40]],
  ])('最大 %s の縦軸は上端 %s', (max, top, ticks) => {
    expect(niceAxis(max, 5)).toEqual({ top, ticks });
  });
});
