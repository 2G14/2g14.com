export const MIN_FACES = 2;
export const MAX_FACES = 100;
export const MAX_DICE_COUNT = 100;

const brand = Symbol('DiceSet');

/** 同じ面数のサイコロを何個か振る組。現実に無い面数のサイコロも、各面が同じ確率で出るものとして扱う */
export interface DiceSet {
  readonly [brand]: unknown;
  readonly count: number;
  readonly faces: number;
}

export class InvalidDiceSetError extends Error {
  constructor(message: string = '無効なサイコロの組です') {
    super(message);
    this.name = 'InvalidDiceSetError';
    Object.setPrototypeOf(this, InvalidDiceSetError.prototype);
  }
}

function isIntegerInRange(n: number, min: number, max: number): boolean {
  return Number.isInteger(n) && n >= min && n <= max;
}

export function createDiceSet(count: number, faces: number): DiceSet {
  if (!isIntegerInRange(count, 1, MAX_DICE_COUNT)) {
    throw new InvalidDiceSetError(
      `サイコロの個数は 1〜${MAX_DICE_COUNT} の整数である必要があります: ${count}`,
    );
  }
  if (!isIntegerInRange(faces, MIN_FACES, MAX_FACES)) {
    throw new InvalidDiceSetError(
      `サイコロの面数は ${MIN_FACES}〜${MAX_FACES} の整数である必要があります: ${faces}`,
    );
  }
  return { count, faces } as DiceSet;
}

/**
 * 出目の組み合わせ（どのサイコロがどの目かを区別した並び）の総数。
 * 100 面 100 個では 10^200 通りになり Number では正確に表せないため BigInt で数える
 */
export function totalOutcomes(dice: DiceSet): bigint {
  return BigInt(dice.faces) ** BigInt(dice.count);
}
