import { describe, expect, it } from 'vitest';

import { createDiceSet, MAX_DICE_COUNT, totalOutcomes } from '#src/domain/dice/dice-set.js';
import {
  allSameWays,
  atLeastOneWays,
  expectedSum,
  sumDistribution,
} from '#src/domain/dice/probability.js';

describe('sumDistribution', () => {
  it('1 個なら各目が 1 通りずつ', () => {
    expect(sumDistribution(createDiceSet(1, 6)).map((row) => row.ways)).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it('2 個の 6 面は合計 2〜12 が 1・2・3・4・5・6・5・4・3・2・1 通り', () => {
    const rows = sumDistribution(createDiceSet(2, 6));
    expect(rows.map((row) => row.sum)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(rows.map((row) => row.ways)).toEqual([1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]);
  });

  it('3 個の 6 面は合計 10 と 11 が最も多い 27 通り', () => {
    const rows = sumDistribution(createDiceSet(3, 6));
    expect(rows.find((row) => row.sum === 10)?.ways).toBe(27);
    expect(rows.find((row) => row.sum === 11)?.ways).toBe(27);
    expect(Math.max(...rows.map((row) => row.ways))).toBe(27);
  });

  it('以上・以下の通り数を積み上げる', () => {
    const rows = sumDistribution(createDiceSet(2, 6));
    expect(rows.find((row) => row.sum === 8)).toMatchObject({ atLeastWays: 15, atMostWays: 26 });
    expect(rows[0]).toMatchObject({ atLeastWays: 36, atMostWays: 1 });
    expect(rows.at(-1)).toMatchObject({ atLeastWays: 1, atMostWays: 36 });
  });

  it.each([
    [1, 20],
    [4, 6],
    [5, 8],
    [MAX_DICE_COUNT, 20],
  ])('%i 個の %i 面の通り数の合計は出目の組み合わせの総数に等しく、左右対称', (count, faces) => {
    const dice = createDiceSet(count, faces);
    const ways = sumDistribution(dice).map((row) => row.ways);
    expect(ways.reduce((a, b) => a + b, 0)).toBe(totalOutcomes(dice));
    expect(ways).toEqual(ways.toReversed());
  });

  it('全ての出目を数えた結果と一致する', () => {
    const dice = createDiceSet(3, 4);
    const counts = new Map<number, number>();
    for (let a = 1; a <= 4; a++) {
      for (let b = 1; b <= 4; b++) {
        for (let c = 1; c <= 4; c++) {
          counts.set(a + b + c, (counts.get(a + b + c) ?? 0) + 1);
        }
      }
    }
    expect(sumDistribution(dice).map((row) => [row.sum, row.ways])).toEqual([...counts.entries()]);
  });
});

describe('expectedSum', () => {
  it('1 個の期待値（面数 + 1）/ 2 に個数を掛ける', () => {
    expect(expectedSum(createDiceSet(2, 6))).toBe(7);
    expect(expectedSum(createDiceSet(1, 20))).toBe(10.5);
  });
});

describe('allSameWays', () => {
  it('ゾロ目は面数と同じ通り数', () => {
    expect(allSameWays(createDiceSet(2, 6))).toBe(6);
    expect(allSameWays(createDiceSet(3, 6))).toBe(6);
  });
});

describe('atLeastOneWays', () => {
  it('特定の目が少なくとも 1 個出る通り数', () => {
    expect(atLeastOneWays(createDiceSet(1, 6))).toBe(1);
    expect(atLeastOneWays(createDiceSet(2, 6))).toBe(11);
    expect(atLeastOneWays(createDiceSet(4, 6))).toBe(671);
  });
});
