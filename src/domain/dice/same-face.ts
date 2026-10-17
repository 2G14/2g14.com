import { type DiceSet, totalOutcomes } from '#src/domain/dice/dice-set.js';
import { accumulate, type DistributionRow } from '#src/domain/dice/distribution.js';

/** C(m, j)（0 ≤ j ≤ m ≤ n）の表 */
function binomialTable(n: number): bigint[][] {
  const table: bigint[][] = [[1n]];
  for (let m = 1; m <= n; m++) {
    const prev = table[m - 1] ?? [];
    table.push(Array.from({ length: m + 1 }, (_, j) => (prev[j - 1] ?? 0n) + (prev[j] ?? 0n)));
  }
  return table;
}

/**
 * 並びを数える列どうしの積。a[j] が「j 個の位置への並べ方」、b[i] が「i 個の位置への並べ方」のとき、
 * m 個の位置をどの j 個を a に使うか選んで（C(m, j) 通り）並べる数。n 個を超える分は使わないので捨てる
 */
function multiply(a: readonly bigint[], b: readonly bigint[], binomial: bigint[][]): bigint[] {
  const n = binomial.length - 1;
  return Array.from({ length: n + 1 }, (_, m) => {
    let sum = 0n;
    for (let j = 0; j <= m; j++) {
      const left = a[j] ?? 0n;
      const right = b[m - j] ?? 0n;
      if (left !== 0n && right !== 0n) sum += (binomial[m]?.[j] ?? 0n) * left * right;
    }
    return sum;
  });
}

function power(base: readonly bigint[], exponent: number, binomial: bigint[][]): bigint[] {
  let result: bigint[] = [1n];
  let square = [...base];
  for (let e = exponent; e > 0; e = Math.floor(e / 2)) {
    if (e % 2 === 1) result = multiply(result, square, binomial);
    if (e > 1) square = multiply(square, square, binomial);
  }
  return result;
}

/**
 * どの目も k 個以下しか出ない通り数。1 つの目を 0〜k 個の位置に置く並べ方は 1 通りずつなので、
 * その列を面数ぶん掛け合わせた「サイコロの個数ぶんの位置」の並べ方の数になる
 */
function allAtMostWays(dice: DiceSet, k: number, binomial: bigint[][]): bigint {
  const perFace = Array.from({ length: k + 1 }, () => 1n);
  return power(perFace, dice.faces, binomial)[dice.count] ?? 0n;
}

/**
 * 同じ目が最も多く出た個数（3 個がゾロ目なら 3、全部違えば 1）ごとの通り数。
 * k が個数の半分を超えると k 個より多く出る目は 1 つしかありえないため、特定の目が k 個より多く出る
 * 通り数を面数倍して全体から引くだけで求まる。それ以下の k だけ並べ方の積で数える
 */
export function sameFaceDistribution(dice: DiceSet): DistributionRow[] {
  const n = dice.count;
  const total = totalOutcomes(dice);
  const binomial = binomialTable(n);
  const others = BigInt(dice.faces - 1);
  const atMost = (k: number): bigint => {
    if (k >= n) return total;
    if (2 * (k + 1) > n) {
      let exceeding = 0n;
      for (let j = k + 1; j <= n; j++)
        exceeding += (binomial[n]?.[j] ?? 0n) * others ** BigInt(n - j);
      return total - BigInt(dice.faces) * exceeding;
    }
    return allAtMostWays(dice, k, binomial);
  };

  const atMostByK = Array.from({ length: n + 1 }, (_, k) => (k === 0 ? 0n : atMost(k)));
  const exact = atMostByK.slice(1).map((ways, i) => ways - (atMostByK[i] ?? 0n));
  return accumulate(1, exact, total);
}
