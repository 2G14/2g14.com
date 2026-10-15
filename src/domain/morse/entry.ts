import { createMorseCode, type MorseCode } from '#src/domain/morse/code.js';

const brand = Symbol('MorseEntry');

/** 文字 1 つ（または記号 1 つ）と、それを表すモールス符号 */
export interface MorseEntry {
  readonly [brand]: unknown;
  readonly label: string;
  readonly code: MorseCode;
}

export class InvalidMorseEntryError extends Error {
  constructor(message: string = '無効なモールス符号の項目です') {
    super(message);
    this.name = 'InvalidMorseEntryError';
    Object.setPrototypeOf(this, InvalidMorseEntryError.prototype);
  }
}

export function createMorseEntry(label: string, code: MorseCode): MorseEntry {
  if (label === '') {
    throw new InvalidMorseEntryError('文字の表記が空です');
  }
  return { label, code } as MorseEntry;
}

/** 一覧表を符号の見た目のまま読みやすく書くため、「.」「-」の文字列から直接項目を作る */
export function entryFromPattern(label: string, pattern: string): MorseEntry {
  return createMorseEntry(label, createMorseCode(pattern));
}
