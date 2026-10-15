import { describe, expect, it } from 'vitest';

import { createMorseCode, InvalidMorseCodeError } from '#src/domain/morse/code.js';
import {
  createMorseEntry,
  entryFromPattern,
  InvalidMorseEntryError,
} from '#src/domain/morse/entry.js';

describe('createMorseEntry', () => {
  it('文字と符号の組を作る', () => {
    const entry = createMorseEntry('A', createMorseCode('.-'));
    expect(entry.label).toBe('A');
    expect(entry.code.signals).toEqual(['dot', 'dash']);
  });

  it('文字の表記が空なら InvalidMorseEntryError', () => {
    expect(() => createMorseEntry('', createMorseCode('.'))).toThrow(InvalidMorseEntryError);
  });
});

describe('entryFromPattern', () => {
  it('「.」「-」の文字列から符号を作る', () => {
    expect(entryFromPattern('S', '...').code.signals).toEqual(['dot', 'dot', 'dot']);
  });

  it('不正な符号は符号の検証で弾く', () => {
    expect(() => entryFromPattern('A', '.x')).toThrow(InvalidMorseCodeError);
  });
});
