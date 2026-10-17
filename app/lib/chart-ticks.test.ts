import { describe, expect, it } from 'vitest';

import { niceAxis, niceTicks } from '#app/lib/chart-ticks.js';

const SPACE = { chartWidthPx: 224, digitWidthPx: 7, gapPx: 4 };

describe('niceTicks', () => {
  it.each([
    [2, 12, [2, 4, 6, 8, 10, 12]],
    [1, 6, [1, 2, 3, 4, 5, 6]],
    [3, 18, [3, 5, 10, 15, 18]],
    [0, 12, [0, 5, 10, 12]],
    [0, 100, [0, 20, 40, 60, 80, 100]],
    [1, 100, [1, 20, 40, 60, 80, 100]],
    [100, 10000, [100, 2000, 4000, 6000, 10000]],
    [99, 9900, [99, 2000, 4000, 6000, 9900]],
    [0, 2, [0, 1, 2]],
    [65, 1625, [65, 500, 1000, 1625]],
    [9, 108, [9, 20, 40, 60, 80, 108]],
  ])('%i〜%i の目盛りは両端を含み、両端のラベルと重なる目盛りは省く', (first, last, expected) => {
    expect(niceTicks(first, last, 6, SPACE)).toEqual(expected);
  });

  it('範囲が 1 点なら、その点だけ', () => {
    expect(niceTicks(1, 1, 6, SPACE)).toEqual([1]);
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
