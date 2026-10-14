import { type Cell, createBrailleCell } from '#src/domain/braille/cell.js';

const brand = Symbol('BrailleEntry');

/** 墨字 1 文字（または符号 1 つ）と、それを表す点字のマス */
export interface BrailleEntry {
  readonly [brand]: unknown;
  /** 墨字（点字でない普通の文字）での表記 */
  readonly label: string;
  /** 1 文字を表すのに使うマス（濁音・拗音・数字などは 2 マス） */
  readonly cells: readonly Cell[];
}

/** 段の位置を揃えるため、該当する仮名が無い段は null にする */
export type KanaRow = readonly (BrailleEntry | null)[];

export class InvalidBrailleEntryError extends Error {
  constructor(message: string = '無効な点字の項目です') {
    super(message);
    this.name = 'InvalidBrailleEntryError';
    Object.setPrototypeOf(this, InvalidBrailleEntryError.prototype);
  }
}

export function createBrailleEntry(label: string, cells: readonly Cell[]): BrailleEntry {
  if (label === '') {
    throw new InvalidBrailleEntryError('墨字の表記が空です');
  }
  if (cells.length === 0) {
    throw new InvalidBrailleEntryError(`マスが 1 つもありません: ${label}`);
  }
  return { label, cells } as BrailleEntry;
}

/** 一覧表を点番号のまま読みやすく書くため、点番号の配列から直接項目を作る */
export function entryFromDots(
  label: string,
  ...cells: readonly (readonly number[])[]
): BrailleEntry {
  return createBrailleEntry(
    label,
    cells.map((dots) => createBrailleCell(dots)),
  );
}
