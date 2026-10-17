import { describe, expect, it } from 'vitest';

import { accumulate, mostLikely, probabilityOf } from '#src/domain/dice/distribution.js';

describe('accumulate', () => {
  it('値ごとの通り数に、以上・以下の通り数を積み上げて添える', () => {
    expect(accumulate(2, [1n, 2n, 1n], 4n)).toEqual([
      { value: 2, ways: 1n, atLeastWays: 4n, atMostWays: 1n },
      { value: 3, ways: 2n, atLeastWays: 3n, atMostWays: 3n },
      { value: 4, ways: 1n, atLeastWays: 1n, atMostWays: 4n },
    ]);
  });
});

describe('mostLikely', () => {
  it('通り数が最も多い値と、その通り数', () => {
    expect(mostLikely(accumulate(2, [1n, 2n, 1n], 4n))).toEqual({ values: [3], ways: 2n });
  });

  it('同数なら全ての値', () => {
    expect(mostLikely(accumulate(1, [1n, 1n, 1n], 3n))).toEqual({ values: [1, 2, 3], ways: 1n });
  });
});

describe('probabilityOf', () => {
  it('通り数の比を確率にする', () => {
    expect(probabilityOf(1n, 4n)).toBe(0.25);
    expect(probabilityOf(36n, 36n)).toBe(1);
  });

  it('100 面 100 個の総数が分母でも桁あふれしない', () => {
    expect(probabilityOf(3n, 10n ** 200n)).toBeCloseTo(3e-200, 213);
    expect(probabilityOf(10n ** 199n, 10n ** 200n)).toBeCloseTo(0.1, 15);
  });
});
