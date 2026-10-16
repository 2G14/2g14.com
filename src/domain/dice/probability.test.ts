import { describe, expect, it } from 'vitest';

import { createDiceSet, totalOutcomes } from '#src/domain/dice/dice-set.js';
import {
  allSameWays,
  expectedSum,
  faceCountDistribution,
  sumDistribution,
} from '#src/domain/dice/probability.js';

describe('sumDistribution', () => {
  it('1 個なら各目が 1 通りずつ', () => {
    expect(sumDistribution(createDiceSet(1, 6)).map((row) => row.ways)).toEqual([
      1n,
      1n,
      1n,
      1n,
      1n,
      1n,
    ]);
  });

  it('2 個の 6 面は合計 2〜12 が 1・2・3・4・5・6・5・4・3・2・1 通り', () => {
    const rows = sumDistribution(createDiceSet(2, 6));
    expect(rows.map((row) => row.sum)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(rows.map((row) => Number(row.ways))).toEqual([1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]);
  });

  it('3 個の 6 面は合計 10 と 11 が最も多い 27 通り', () => {
    const rows = sumDistribution(createDiceSet(3, 6));
    expect(rows.find((row) => row.sum === 10)?.ways).toBe(27n);
    expect(rows.find((row) => row.sum === 11)?.ways).toBe(27n);
    expect(rows.every((row) => row.ways <= 27n)).toBe(true);
  });

  it('以上・以下の通り数を積み上げる', () => {
    const rows = sumDistribution(createDiceSet(2, 6));
    expect(rows.find((row) => row.sum === 8)).toMatchObject({ atLeastWays: 15n, atMostWays: 26n });
    expect(rows[0]).toMatchObject({ atLeastWays: 36n, atMostWays: 1n });
    expect(rows.at(-1)).toMatchObject({ atLeastWays: 1n, atMostWays: 36n });
  });

  it.each([
    [1, 2],
    [4, 6],
    [5, 7],
    [10, 20],
    [100, 100],
  ])('%i 個の %i 面の通り数の合計は出目の組み合わせの総数に等しく、左右対称', (count, faces) => {
    const dice = createDiceSet(count, faces);
    const ways = sumDistribution(dice).map((row) => row.ways);
    expect(ways).toHaveLength(count * (faces - 1) + 1);
    expect(ways.reduce((a, b) => a + b, 0n)).toBe(totalOutcomes(dice));
    expect(ways).toEqual(ways.toReversed());
  });

  it('全ての出目を数えた結果と一致する', () => {
    const dice = createDiceSet(3, 5);
    const counts = new Map<number, bigint>();
    for (let a = 1; a <= 5; a++) {
      for (let b = 1; b <= 5; b++) {
        for (let c = 1; c <= 5; c++) {
          counts.set(a + b + c, (counts.get(a + b + c) ?? 0n) + 1n);
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
    expect(allSameWays(createDiceSet(2, 6))).toBe(6n);
    expect(allSameWays(createDiceSet(3, 6))).toBe(6n);
  });
});

describe('faceCountDistribution', () => {
  it('2 個の 6 面で特定の目が 0・1・2 個出る通り数', () => {
    expect(faceCountDistribution(createDiceSet(2, 6))).toEqual([
      { count: 0, ways: 25n, atLeastWays: 36n },
      { count: 1, ways: 10n, atLeastWays: 11n },
      { count: 2, ways: 1n, atLeastWays: 1n },
    ]);
  });

  it('4 個の 6 面で 1 個以上出るのは 1296 - 625 = 671 通り', () => {
    expect(faceCountDistribution(createDiceSet(4, 6))[1]?.atLeastWays).toBe(671n);
  });

  it.each([
    [1, 2],
    [5, 6],
    [100, 100],
  ])('%i 個の %i 面で、個数ごとの通り数の合計は総数に等しい', (count, faces) => {
    const dice = createDiceSet(count, faces);
    const rows = faceCountDistribution(dice);
    expect(rows).toHaveLength(count + 1);
    expect(rows.reduce((sum, row) => sum + row.ways, 0n)).toBe(totalOutcomes(dice));
    expect(rows[0]?.atLeastWays).toBe(totalOutcomes(dice));
  });
});
