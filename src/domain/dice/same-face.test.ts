import { describe, expect, it } from 'vitest';

import { createDiceSet, totalOutcomes } from '#src/domain/dice/dice-set.js';
import { sameFaceDistribution } from '#src/domain/dice/same-face.js';

/** 全ての出目を並べ、同じ目が最も多く出た個数ごとに数える */
function bruteForce(count: number, faces: number): bigint[] {
  const ways = Array.from({ length: count }, () => 0n);
  const rolls = Array.from({ length: count }, () => 0);
  const visit = (i: number) => {
    if (i === count) {
      const tally = new Map<number, number>();
      for (const face of rolls) tally.set(face, (tally.get(face) ?? 0) + 1);
      const max = Math.max(...tally.values());
      ways[max - 1] = (ways[max - 1] ?? 0n) + 1n;
      return;
    }
    for (let face = 0; face < faces; face++) {
      rolls[i] = face;
      visit(i + 1);
    }
  };
  visit(0);
  return ways;
}

describe('sameFaceDistribution', () => {
  it('2 個の 6 面は、全部違う目が 30 通り、ゾロ目が 6 通り', () => {
    expect(
      sameFaceDistribution(createDiceSet({ count: 2, faces: 6 })).map((row) => [
        row.value,
        row.ways,
      ]),
    ).toEqual([
      [1, 30n],
      [2, 6n],
    ]);
  });

  it('3 個の 6 面は、全部違う目が 120 通り、2 個だけ同じが 90 通り、ゾロ目が 6 通り', () => {
    expect(
      sameFaceDistribution(createDiceSet({ count: 3, faces: 6 })).map((row) => row.ways),
    ).toEqual([120n, 90n, 6n]);
  });

  it.each([
    [1, 6],
    [4, 2],
    [5, 3],
    [6, 4],
    [7, 3],
    [4, 6],
  ])('%i 個の %i 面で、全ての出目を数えた結果と一致する', (count, faces) => {
    expect(sameFaceDistribution(createDiceSet({ count, faces })).map((row) => row.ways)).toEqual(
      bruteForce(count, faces),
    );
  });

  it.each([
    [100, 100],
    [100, 2],
    [37, 99],
  ])(
    '%i 個の %i 面で、通り数の合計は総数に等しく、全部同じ目は面数と同じ通り数',
    (count, faces) => {
      const dice = createDiceSet({ count, faces });
      const rows = sameFaceDistribution(dice);
      expect(rows).toHaveLength(count);
      expect(rows.reduce((sum, row) => sum + row.ways, 0n)).toBe(totalOutcomes(dice));
      expect(rows.at(-1)?.ways).toBe(BigInt(faces));
    },
  );

  it('面数より個数が多いと、全部違う目にはならない', () => {
    expect(sameFaceDistribution(createDiceSet({ count: 7, faces: 6 }))[0]?.ways).toBe(0n);
  });
});
