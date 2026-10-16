import { type DiceSet, totalOutcomes } from '#src/domain/dice/dice-set.js';

/** 合計が sum になる出目の通り数と、sum 以上・sum 以下になる通り数 */
export interface SumWays {
  readonly sum: number;
  readonly ways: number;
  readonly atLeastWays: number;
  readonly atMostWays: number;
}

/**
 * 合計ごとの通り数を、サイコロを 1 個ずつ足しながら数える。
 * 全ての出目を列挙すると 20 面 10 個で 10^13 通りになるが、この方法なら合計の種類数 × 面数の計算で済む
 */
export function sumDistribution(dice: DiceSet): SumWays[] {
  let waysByOffset = [1];
  for (let i = 0; i < dice.count; i++) {
    const next = Array.from({ length: waysByOffset.length + dice.faces - 1 }, () => 0);
    waysByOffset.forEach((ways, offset) => {
      for (let face = 0; face < dice.faces; face++) {
        next[offset + face] = (next[offset + face] ?? 0) + ways;
      }
    });
    waysByOffset = next;
  }

  const total = totalOutcomes(dice);
  let atMostWays = 0;
  return waysByOffset.map((ways, offset) => {
    const atLeastWays = total - atMostWays;
    atMostWays += ways;
    return { sum: dice.count + offset, ways, atLeastWays, atMostWays };
  });
}

/** 合計の期待値（平均） */
export function expectedSum(dice: DiceSet): number {
  return (dice.count * (dice.faces + 1)) / 2;
}

/** 全てのサイコロが同じ目（ゾロ目）になる通り数 */
export function allSameWays(dice: DiceSet): number {
  return dice.faces;
}

/** 特定の目（たとえば 6）が少なくとも 1 個出る通り数。1 個も出ない通り数を全体から引く */
export function atLeastOneWays(dice: DiceSet): number {
  return totalOutcomes(dice) - (dice.faces - 1) ** dice.count;
}
