import { describe, expect, it } from 'vitest';

import { createBrailleCell, InvalidBrailleCellError } from '#src/domain/braille/cell.js';
import {
  createBrailleEntry,
  entryFromDots,
  InvalidBrailleEntryError,
} from '#src/domain/braille/entry.js';

describe('createBrailleEntry', () => {
  it('墨字の表記とマスの組を作る', () => {
    const entry = createBrailleEntry('が', [createBrailleCell([5]), createBrailleCell([1, 6])]);
    expect(entry.label).toBe('が');
    expect(entry.cells.map((c) => c.dots)).toEqual([[5], [1, 6]]);
  });

  it('墨字の表記が空なら InvalidBrailleEntryError', () => {
    expect(() => createBrailleEntry('', [createBrailleCell([1])])).toThrow(
      InvalidBrailleEntryError,
    );
  });

  it('マスが無ければ InvalidBrailleEntryError', () => {
    expect(() => createBrailleEntry('あ', [])).toThrow(InvalidBrailleEntryError);
  });
});

describe('entryFromDots', () => {
  it('点番号の配列からマスを作る', () => {
    expect(entryFromDots('数', [3, 4, 5, 6], [1]).cells.map((c) => c.dots)).toEqual([
      [3, 4, 5, 6],
      [1],
    ]);
  });

  it('不正な点番号はマスの検証で弾く', () => {
    expect(() => entryFromDots('あ', [7])).toThrow(InvalidBrailleCellError);
  });
});
