/** 点字 1 マスの点番号。読む面から見て左列上から 1・2・3、右列上から 4・5・6 */
export type Dot = 1 | 2 | 3 | 4 | 5 | 6;

const brand = Symbol('BrailleCell');

/** 点字 1 マス */
export interface Cell {
  readonly [brand]: unknown;
  /** 盛り上がっている点の番号（昇順） */
  readonly dots: readonly Dot[];
}

export class InvalidBrailleCellError extends Error {
  constructor(message: string = '無効な点字のマスです') {
    super(message);
    this.name = 'InvalidBrailleCellError';
    Object.setPrototypeOf(this, InvalidBrailleCellError.prototype);
  }
}

export const ALL_DOTS = [1, 2, 3, 4, 5, 6] as const satisfies readonly Dot[];

function isDot(n: number): n is Dot {
  return Number.isInteger(n) && n >= 1 && n <= 6;
}

/** 点番号を検証し、昇順に並べた 1 マスにする。点の無いマス（マスあけ）も表せるよう空は許す */
export function createBrailleCell(dots: readonly number[]): Cell {
  if (!dots.every((n) => isDot(n))) {
    throw new InvalidBrailleCellError(
      `点番号は 1〜6 の整数である必要があります: ${dots.join(',')}`,
    );
  }
  if (new Set(dots).size !== dots.length) {
    throw new InvalidBrailleCellError(`同じ点番号が重複しています: ${dots.join(',')}`);
  }
  const sorted: readonly Dot[] = dots.toSorted((a, b) => a - b);
  return { dots: sorted } as Cell;
}

/** Unicode の点字パターン（U+2800〜U+283F）は 1 の点を最下位ビットとしたビット列で並んでいる */
export function cellToUnicode(cell: Cell): string {
  return String.fromCodePoint(0x2800 + cell.dots.reduce((bits, dot) => bits | (1 << (dot - 1)), 0));
}

export function dotsLabel(cell: Cell): string {
  return cell.dots.join('・');
}
