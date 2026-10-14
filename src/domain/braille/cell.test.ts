import { describe, expect, it } from 'vitest';

import { cellToUnicode, createBrailleCell, dotsLabel, InvalidBrailleCellError } from './cell.js';

describe('createBrailleCell', () => {
  it('点番号を昇順に並べたマスを作る', () => {
    expect(createBrailleCell([6, 1]).dots).toEqual([1, 6]);
  });

  it('点の無いマスも作れる', () => {
    expect(createBrailleCell([]).dots).toEqual([]);
  });

  it.each([[[0]], [[7]], [[1.5]], [[Number.NaN]]])(
    '1〜6 の整数でない点番号 %j は InvalidBrailleCellError',
    (dots) => {
      expect(() => createBrailleCell(dots)).toThrow(InvalidBrailleCellError);
    },
  );

  it('同じ点番号が重複していれば InvalidBrailleCellError', () => {
    expect(() => createBrailleCell([1, 1])).toThrow(InvalidBrailleCellError);
  });
});

describe('cellToUnicode', () => {
  it('点の組み合わせを Unicode の点字パターンにする', () => {
    expect(cellToUnicode(createBrailleCell([]))).toBe('⠀');
    expect(cellToUnicode(createBrailleCell([1]))).toBe('⠁');
    expect(cellToUnicode(createBrailleCell([1, 2, 3, 4, 5, 6]))).toBe('⠿');
    expect(cellToUnicode(createBrailleCell([3, 4, 5, 6]))).toBe('⠼');
  });
});

describe('dotsLabel', () => {
  it('点番号を中点でつなぐ', () => {
    expect(dotsLabel(createBrailleCell([1, 2, 4]))).toBe('1・2・4');
  });
});
