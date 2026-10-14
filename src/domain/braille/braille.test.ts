import { describe, expect, it } from 'vitest';

import {
  ALPHABET,
  type BrailleEntry,
  cellToUnicode,
  DAKUON_ROWS,
  dotsLabel,
  EXTENDED_KANA,
  type KanaRow,
  NUMERALS,
  PUNCTUATION,
  SEION_ROWS,
  SPECIAL_KANA,
  YOON_ROWS,
} from './braille.js';

function entriesOf(rows: readonly KanaRow[]): BrailleEntry[] {
  return rows.flat().filter((entry) => entry !== null);
}

function find(entries: readonly BrailleEntry[], label: string): BrailleEntry | undefined {
  return entries.find((entry) => entry.label === label);
}

function unicodeOf(entry: BrailleEntry | null): string {
  return entry === null ? '' : entry.cells.map((c) => cellToUnicode(c)).join('');
}

describe('cellToUnicode', () => {
  it('点の組み合わせを Unicode の点字パターンにする', () => {
    expect(cellToUnicode([])).toBe('⠀');
    expect(cellToUnicode([1])).toBe('⠁');
    expect(cellToUnicode([1, 2, 3, 4, 5, 6])).toBe('⠿');
    expect(cellToUnicode([3, 4, 5, 6])).toBe('⠼');
  });
});

describe('dotsLabel', () => {
  it('点番号を中点でつなぐ', () => {
    expect(dotsLabel([1, 2, 4])).toBe('1・2・4');
  });
});

describe('SEION_ROWS', () => {
  it.each([
    ['あ', '⠁⠃⠉⠋⠊'],
    ['か', '⠡⠣⠩⠫⠪'],
    ['さ', '⠱⠳⠹⠻⠺'],
    ['た', '⠕⠗⠝⠟⠞'],
    ['な', '⠅⠇⠍⠏⠎'],
    ['は', '⠥⠧⠭⠯⠮'],
    ['ま', '⠵⠷⠽⠿⠾'],
    ['や', '⠌⠬⠜'],
    ['ら', '⠑⠓⠙⠛⠚'],
    ['わ', '⠄⠔'],
  ])('%s行の点字', (head, expected) => {
    const row = SEION_ROWS.find((r) => r[0]?.label === head);
    expect(row?.map((entry) => unicodeOf(entry)).join('')).toBe(expected);
  });

  it('各行を 5 段に揃え、仮名の無い段は null にする', () => {
    expect(SEION_ROWS.every((row) => row.length === 5)).toBe(true);
    expect(SEION_ROWS[7]?.map((entry) => entry?.label ?? null)).toEqual([
      'や',
      null,
      'ゆ',
      null,
      'よ',
    ]);
  });
});

describe('DAKUON_ROWS', () => {
  const entries = entriesOf(DAKUON_ROWS);

  it('濁音は濁点（5 の点）の後に清音を置く', () => {
    expect(find(entries, 'が')?.cells).toEqual([[5], [1, 6]]);
    expect(find(entries, 'ぢ')?.cells).toEqual([[5], [1, 2, 3, 5]]);
    expect(find(entries, 'ぼ')?.cells).toEqual([[5], [2, 3, 4, 6]]);
  });

  it('半濁音は半濁点（6 の点）の後に清音を置く', () => {
    expect(find(entries, 'ぱ')?.cells).toEqual([[6], [1, 3, 6]]);
    expect(find(entries, 'ぽ')?.cells).toEqual([[6], [2, 3, 4, 6]]);
  });

  it('が行・ざ行・だ行・ば行・ぱ行の 25 文字', () => {
    expect(entries.map((entry) => entry.label).join('')).toBe(
      'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ',
    );
  });
});

describe('YOON_ROWS', () => {
  const entries = entriesOf(YOON_ROWS);

  it('拗音は拗音符（4 の点）の後に同じ行のア段・ウ段・オ段を置く', () => {
    expect(find(entries, 'きゃ')?.cells).toEqual([[4], [1, 6]]);
    expect(find(entries, 'しゅ')?.cells).toEqual([[4], [1, 4, 5, 6]]);
    expect(find(entries, 'りょ')?.cells).toEqual([[4], [2, 4, 5]]);
  });

  it('拗濁音は 4・5 の点、拗半濁音は 4・6 の点を前に置く', () => {
    expect(find(entries, 'ぎゃ')?.cells).toEqual([
      [4, 5],
      [1, 6],
    ]);
    expect(find(entries, 'ぢょ')?.cells).toEqual([
      [4, 5],
      [2, 3, 4, 5],
    ]);
    expect(find(entries, 'ぴゅ')?.cells).toEqual([
      [4, 6],
      [1, 3, 4, 6],
    ]);
  });

  it('きゃ行からぴゃ行までの 36 文字', () => {
    expect(entries).toHaveLength(36);
  });
});

describe('SPECIAL_KANA', () => {
  it('撥音・促音・長音の点字', () => {
    expect(SPECIAL_KANA.map((entry) => unicodeOf(entry)).join('')).toBe('⠴⠂⠒');
  });
});

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
    expect(NUMERALS.every((entry) => cellToUnicode(entry.cells[0]) === '⠼')).toBe(true);
  });
});

describe('PUNCTUATION', () => {
  it('句点・読点・疑問符・感嘆符・中点の点字', () => {
    expect(PUNCTUATION.map((entry) => unicodeOf(entry)).join('')).toBe('⠲⠰⠢⠖⠐');
  });
});

describe('EXTENDED_KANA', () => {
  it.each([
    ['イェ', [4], [1, 2, 4]],
    ['キェ', [4], [1, 2, 4, 6]],
    ['シェ', [4], [1, 2, 4, 5, 6]],
    ['ジェ', [4, 5], [1, 2, 4, 5, 6]],
    ['チェ', [4], [1, 2, 3, 4, 5]],
    ['ニェ', [4], [1, 2, 3, 4]],
    ['ヒェ', [4], [1, 2, 3, 4, 6]],
    ['スィ', [4], [1, 2, 5, 6]],
    ['ズィ', [4, 5], [1, 2, 5, 6]],
    ['ティ', [4], [1, 2, 3, 5]],
    ['ディ', [4, 5], [1, 2, 3, 5]],
    ['ウィ', [2, 6], [1, 2]],
    ['ウェ', [2, 6], [1, 2, 4]],
    ['ウォ', [2, 6], [2, 4]],
    ['クァ', [2, 6], [1, 6]],
    ['クィ', [2, 6], [1, 2, 6]],
    ['クェ', [2, 6], [1, 2, 4, 6]],
    ['クォ', [2, 6], [2, 4, 6]],
    ['グァ', [2, 5, 6], [1, 6]],
    ['グィ', [2, 5, 6], [1, 2, 6]],
    ['グェ', [2, 5, 6], [1, 2, 4, 6]],
    ['グォ', [2, 5, 6], [2, 4, 6]],
    ['ツァ', [2, 6], [1, 3, 5]],
    ['ツィ', [2, 6], [1, 2, 3, 5]],
    ['ツェ', [2, 6], [1, 2, 3, 4, 5]],
    ['ツォ', [2, 6], [2, 3, 4, 5]],
    ['トゥ', [2, 6], [1, 3, 4, 5]],
    ['ドゥ', [2, 5, 6], [1, 3, 4, 5]],
    ['ファ', [2, 6], [1, 3, 6]],
    ['フィ', [2, 6], [1, 2, 3, 6]],
    ['フェ', [2, 6], [1, 2, 3, 4, 6]],
    ['フォ', [2, 6], [2, 3, 4, 6]],
    ['ヴァ', [2, 5, 6], [1, 3, 6]],
    ['ヴィ', [2, 5, 6], [1, 2, 3, 6]],
    ['ヴェ', [2, 5, 6], [1, 2, 3, 4, 6]],
    ['ヴォ', [2, 5, 6], [2, 3, 4, 6]],
    ['テュ', [4, 6], [1, 3, 4, 5]],
    ['デュ', [4, 5, 6], [1, 3, 4, 5]],
    ['フュ', [4, 6], [3, 4, 6]],
    ['ヴュ', [4, 5, 6], [3, 4, 6]],
    ['フョ', [4, 6], [3, 4, 5]],
    ['ヴョ', [4, 5, 6], [3, 4, 5]],
    ['ヴ', [5], [1, 4]],
  ])('%s は前置符号 %j の後に %j を置く', (label, sign, base) => {
    expect(find(EXTENDED_KANA, label)?.cells).toEqual([sign, base]);
  });

  it('43 文字', () => {
    expect(EXTENDED_KANA).toHaveLength(43);
  });
});

describe('ALPHABET', () => {
  it('a〜z は外字符（5・6 の点）の後に文字の形を続ける', () => {
    const letters = ALPHABET.slice(2);
    expect(letters.map((entry) => entry.label).join('')).toBe('abcdefghijklmnopqrstuvwxyz');
    expect(letters.every((entry) => cellToUnicode(entry.cells[0]) === '⠰')).toBe(true);
    expect(letters.map((entry) => unicodeOf(entry).slice(1)).join('')).toBe(
      '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵',
    );
  });

  it('大文字符は 6 の点', () => {
    expect(find(ALPHABET, '大文字符')?.cells).toEqual([[6]]);
  });
});
