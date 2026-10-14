import { describe, expect, it } from 'vitest';

import { cellToUnicode } from './cell.js';
import type { BrailleEntry } from './entry.js';
import { ALPHABET, NUMERALS, PUNCTUATION } from './symbols.js';

const unicodeOf = (entry: BrailleEntry): string =>
  entry.cells.map((c) => cellToUnicode(c)).join('');

describe('NUMERALS', () => {
  it('数字は数符の後に 1〜0 の形を続ける', () => {
    expect(NUMERALS.slice(1).map((entry) => entry.label)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
    ]);
    expect(
      NUMERALS.slice(1)
        .map((entry) => unicodeOf(entry).slice(1))
        .join(''),
    ).toBe('⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚');
    expect(NUMERALS.every((entry) => entry.cells[0]?.dots.join() === '3,4,5,6')).toBe(true);
  });
});

describe('PUNCTUATION', () => {
  it('句点・読点・疑問符・感嘆符・中点の点字', () => {
    expect(PUNCTUATION.map((entry) => unicodeOf(entry)).join('')).toBe('⠲⠰⠢⠖⠐');
  });
});

describe('ALPHABET', () => {
  it('a〜z は外字符（5・6 の点）の後に文字の形を続ける', () => {
    const letters = ALPHABET.slice(2);
    expect(letters.map((entry) => entry.label).join('')).toBe('abcdefghijklmnopqrstuvwxyz');
    expect(letters.every((entry) => entry.cells[0]?.dots.join() === '5,6')).toBe(true);
    expect(letters.map((entry) => unicodeOf(entry).slice(1)).join('')).toBe(
      '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵',
    );
  });

  it('大文字符は 6 の点', () => {
    expect(ALPHABET.find((entry) => entry.label === '大文字符')?.cells.map((c) => c.dots)).toEqual([
      [6],
    ]);
  });
});
