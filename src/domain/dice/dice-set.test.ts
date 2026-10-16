import { describe, expect, it } from 'vitest';

import {
  createDiceSet,
  InvalidDiceSetError,
  MAX_DICE_COUNT,
  totalOutcomes,
} from '#src/domain/dice/dice-set.js';

describe('createDiceSet', () => {
  it('個数と面数の組を作る', () => {
    const dice = createDiceSet(2, 6);
    expect(dice.count).toBe(2);
    expect(dice.faces).toBe(6);
  });

  it.each([0, -1, 1.5, MAX_DICE_COUNT + 1, Number.NaN])(
    '個数が 1〜上限の整数でない %s なら InvalidDiceSetError',
    (count) => {
      expect(() => createDiceSet(count, 6)).toThrow(InvalidDiceSetError);
    },
  );

  it.each([1, 3, 7, 100])('一般的な面数でない %s なら InvalidDiceSetError', (faces) => {
    expect(() => createDiceSet(2, faces)).toThrow(InvalidDiceSetError);
  });
});

describe('totalOutcomes', () => {
  it('面数の個数乗', () => {
    expect(totalOutcomes(createDiceSet(2, 6))).toBe(36);
    expect(totalOutcomes(createDiceSet(3, 6))).toBe(216);
  });

  it('上限の個数の 20 面でも安全な整数に収まる', () => {
    expect(Number.isSafeInteger(totalOutcomes(createDiceSet(MAX_DICE_COUNT, 20)))).toBe(true);
  });
});
