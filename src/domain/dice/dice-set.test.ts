import { describe, expect, it } from 'vitest';

import {
  createDiceSet,
  InvalidDiceSetError,
  MAX_DICE_COUNT,
  MAX_FACES,
  isSameDiceSet,
  MIN_FACES,
  sumRange,
  totalOutcomes,
} from '#src/domain/dice/dice-set.js';

describe('createDiceSet', () => {
  it('個数と面数の組を作る', () => {
    const dice = createDiceSet({ count: 2, faces: 6 });
    expect(dice.count).toBe(2);
    expect(dice.faces).toBe(6);
  });

  it('現実に無い面数でも範囲内なら作れる', () => {
    expect(createDiceSet({ count: 1, faces: 7 }).faces).toBe(7);
    expect(createDiceSet({ count: MAX_DICE_COUNT, faces: MAX_FACES }).count).toBe(MAX_DICE_COUNT);
    expect(createDiceSet({ count: 1, faces: MIN_FACES }).faces).toBe(MIN_FACES);
  });

  it.each([0, -1, 1.5, MAX_DICE_COUNT + 1, Number.NaN])(
    '個数が 1〜上限の整数でない %s なら InvalidDiceSetError',
    (count) => {
      expect(() => createDiceSet({ count, faces: 6 })).toThrow(InvalidDiceSetError);
    },
  );

  it.each([1, 0, 2.5, MAX_FACES + 1])('面数が範囲外の %s なら InvalidDiceSetError', (faces) => {
    expect(() => createDiceSet({ count: 2, faces })).toThrow(InvalidDiceSetError);
  });
});

describe('totalOutcomes', () => {
  it('面数の個数乗', () => {
    expect(totalOutcomes(createDiceSet({ count: 2, faces: 6 }))).toBe(36n);
    expect(totalOutcomes(createDiceSet({ count: 3, faces: 6 }))).toBe(216n);
  });

  it('100 面 100 個でも正確に数える', () => {
    expect(totalOutcomes(createDiceSet({ count: 100, faces: 100 }))).toBe(10n ** 200n);
  });
});

describe('sumRange', () => {
  it('合計の最小は個数、最大は個数 × 面数', () => {
    expect(sumRange(createDiceSet({ count: 3, faces: 6 }))).toEqual({ min: 3, max: 18 });
  });
});

describe('isSameDiceSet', () => {
  it('個数と面数が同じなら同じ組', () => {
    expect(
      isSameDiceSet(createDiceSet({ count: 2, faces: 6 }), createDiceSet({ count: 2, faces: 6 })),
    ).toBe(true);
    expect(
      isSameDiceSet(createDiceSet({ count: 2, faces: 6 }), createDiceSet({ count: 6, faces: 2 })),
    ).toBe(false);
  });
});
