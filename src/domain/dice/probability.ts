import { type DiceSet, totalOutcomes } from '#src/domain/dice/dice-set.js';
import { toDistributionRows, type DistributionRow } from '#src/domain/dice/distribution.js';

/**
 * 合計ごとの通り数を、サイコロを 1 個ずつ足しながら数える。
 * 1 個足した後の合計 s の通り数は、足す前の合計 s-(面数-1)〜s の通り数の和なので、累積和の差で求める。
 * 面数ぶん足し合わせる素直な方法では 100 面 100 個で約 1 億回の BigInt の足し算になり遅すぎる。
 * どの段階でも分布は左右対称なので、前半だけ数えて後半は反転して埋める
 */
export function sumDistribution(dice: DiceSet): DistributionRow[] {
  let waysByOffset: bigint[] = [1n];
  for (let i = 0; i < dice.count; i++) {
    const prefix = [0n];
    for (const ways of waysByOffset) prefix.push((prefix.at(-1) ?? 0n) + ways);
    const last = waysByOffset.length;
    const length = last + dice.faces - 1;
    const firstHalf = Array.from(
      { length: Math.ceil(length / 2) },
      (_, offset) =>
        (prefix[Math.min(offset + 1, last)] ?? 0n) -
        (prefix[Math.max(0, offset - dice.faces + 1)] ?? 0n),
    );
    waysByOffset = [...firstHalf, ...firstHalf.slice(0, Math.floor(length / 2)).toReversed()];
  }
  return toDistributionRows(dice.count, waysByOffset, totalOutcomes(dice));
}

/** 合計の期待値（平均） */
export function expectedSum(dice: DiceSet): number {
  return (dice.count * (dice.faces + 1)) / 2;
}

/** 全てのサイコロが同じ目（ゾロ目）になる通り数 */
export function allSameWays(dice: DiceSet): bigint {
  return BigInt(dice.faces);
}

/**
 * 特定の目（たとえば 6 の目）が出る個数ごとの通り数。ちょうど k 個になるのは、どの k 個がその目かの
 * 選び方（二項係数）に、残りが他の目になる通り数を掛けたもの
 */
export function faceCountDistribution(dice: DiceSet): DistributionRow[] {
  const others = BigInt(dice.faces - 1);
  const exact: bigint[] = [];
  let binomial = 1n;
  for (let k = 0; k <= dice.count; k++) {
    exact.push(binomial * others ** BigInt(dice.count - k));
    binomial = (binomial * BigInt(dice.count - k)) / BigInt(k + 1);
  }
  return toDistributionRows(0, exact, totalOutcomes(dice));
}

/** 特定の目（たとえば 6 の目）が 1 個以上出る通り数。1 個も出ない通り数を全体から引く */
export function atLeastOneWays(dice: DiceSet): bigint {
  return totalOutcomes(dice) - BigInt(dice.faces - 1) ** BigInt(dice.count);
}
