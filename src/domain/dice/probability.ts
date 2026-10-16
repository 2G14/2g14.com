import { type DiceSet, totalOutcomes } from '#src/domain/dice/dice-set.js';

/** 合計が sum になる出目の通り数と、sum 以上・sum 以下になる通り数 */
export interface SumWays {
  readonly sum: number;
  readonly ways: bigint;
  readonly atLeastWays: bigint;
  readonly atMostWays: bigint;
}

/** 特定の目（たとえば 6 の目）がちょうど count 個出る通り数と、count 個以上出る通り数 */
export interface FaceCountWays {
  readonly count: number;
  readonly ways: bigint;
  readonly atLeastWays: bigint;
}

function withAtLeastAndAtMost(dice: DiceSet, waysByOffset: readonly bigint[]): SumWays[] {
  const total = totalOutcomes(dice);
  let atMostWays = 0n;
  return waysByOffset.map((ways, offset) => {
    const atLeastWays = total - atMostWays;
    atMostWays += ways;
    return { sum: dice.count + offset, ways, atLeastWays, atMostWays };
  });
}

/**
 * 合計ごとの通り数を、サイコロを 1 個ずつ足しながら数える。
 * 1 個足した後の合計 s の通り数は、足す前の合計 s-(面数-1)〜s の通り数の和なので、累積和の差で求める。
 * 面数ぶん足し合わせる素直な方法では 100 面 100 個で約 1 億回の BigInt の足し算になり遅すぎる。
 * どの段階でも分布は左右対称なので、前半だけ数えて後半は反転して埋める
 */
export function sumDistribution(dice: DiceSet): SumWays[] {
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
  return withAtLeastAndAtMost(dice, waysByOffset);
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
 * 特定の目が出る個数ごとの通り数。ちょうど k 個になるのは、どの k 個がその目かの選び方
 * （二項係数）に、残りが他の目になる通り数を掛けたもの
 */
export function faceCountDistribution(dice: DiceSet): FaceCountWays[] {
  const others = BigInt(dice.faces - 1);
  const exact: bigint[] = [];
  let binomial = 1n;
  for (let k = 0; k <= dice.count; k++) {
    exact.push(binomial * others ** BigInt(dice.count - k));
    binomial = (binomial * BigInt(dice.count - k)) / BigInt(k + 1);
  }
  let atLeastWays = 0n;
  return exact
    .toReversed()
    .map((ways, i) => {
      atLeastWays += ways;
      return { count: dice.count - i, ways, atLeastWays };
    })
    .toReversed();
}
