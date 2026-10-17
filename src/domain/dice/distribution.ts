/** 分布の横軸の 1 つの値（合計や個数）と、ちょうど・以上・以下になる通り数 */
export interface DistributionRow {
  readonly value: number;
  readonly ways: bigint;
  readonly atLeastWays: bigint;
  readonly atMostWays: bigint;
}

export interface MostLikely {
  readonly values: readonly number[];
  readonly ways: bigint;
}

/** firstValue から 1 ずつ増える値ごとの通り数に、以上・以下の通り数を積み上げて添える */
export function accumulate(
  firstValue: number,
  waysByOffset: readonly bigint[],
  total: bigint,
): DistributionRow[] {
  let atMostWays = 0n;
  return waysByOffset.map((ways, offset) => {
    const atLeastWays = total - atMostWays;
    atMostWays += ways;
    return { value: firstValue + offset, ways, atLeastWays, atMostWays };
  });
}

/** 通り数が最も多い値（同数なら全て） */
export function mostLikely(rows: readonly DistributionRow[]): MostLikely {
  const ways = rows.reduce((max, row) => (row.ways > max ? row.ways : max), 0n);
  return { values: rows.filter((row) => row.ways === ways).map((row) => row.value), ways };
}

/**
 * 通り数の比を Number の確率にする。通り数は最大でも 100 面 100 個の 10^200 で、Number の上限
 * （約 1.8×10^308）に収まるため、BigInt を Number にしてから割っても桁あふれしない
 */
export function probabilityOf(ways: bigint, total: bigint): number {
  return Number(ways) / Number(total);
}
