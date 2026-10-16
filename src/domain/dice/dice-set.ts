/** TRPG などで一般的に使われる多面体サイコロの面数 */
export const DICE_FACES = [4, 6, 8, 10, 12, 20] as const;

type DiceFaces = (typeof DICE_FACES)[number];

/**
 * 振るサイコロの最大個数。20 面 10 個でも出目の組み合わせは 20^10 ≈ 1.0×10^13 通りで
 * Number の安全な整数の範囲に収まるため、通り数を BigInt にしなくて済む
 */
export const MAX_DICE_COUNT = 10;

const brand = Symbol('DiceSet');

/** 同じ面数のサイコロを何個か振る組 */
export interface DiceSet {
  readonly [brand]: unknown;
  readonly count: number;
  readonly faces: DiceFaces;
}

export class InvalidDiceSetError extends Error {
  constructor(message: string = '無効なサイコロの組です') {
    super(message);
    this.name = 'InvalidDiceSetError';
    Object.setPrototypeOf(this, InvalidDiceSetError.prototype);
  }
}

function isDiceFaces(n: number): n is DiceFaces {
  return DICE_FACES.some((faces) => faces === n);
}

export function createDiceSet(count: number, faces: number): DiceSet {
  if (!Number.isInteger(count) || count < 1 || count > MAX_DICE_COUNT) {
    throw new InvalidDiceSetError(
      `サイコロの個数は 1〜${MAX_DICE_COUNT} の整数である必要があります: ${count}`,
    );
  }
  if (!isDiceFaces(faces)) {
    throw new InvalidDiceSetError(
      `サイコロの面数は ${DICE_FACES.join('・')} のいずれかである必要があります: ${faces}`,
    );
  }
  return { count, faces } as DiceSet;
}

/** 出目の組み合わせ（どのサイコロがどの目かを区別した並び）の総数 */
export function totalOutcomes(dice: DiceSet): number {
  return dice.faces ** dice.count;
}
