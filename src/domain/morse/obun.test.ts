import { describe, expect, it } from 'vitest';

import { morseCodeToText } from '#src/domain/morse/code.js';
import type { MorseEntry } from '#src/domain/morse/entry.js';
import { NUMERALS, OBUN_LETTERS, OBUN_SYMBOLS } from '#src/domain/morse/obun.js';

const textOf = (entry: MorseEntry): string => morseCodeToText(entry.code);

describe('OBUN_LETTERS', () => {
  it('A〜Z の符号', () => {
    expect(OBUN_LETTERS.map((entry) => entry.label).join('')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(OBUN_LETTERS.map((entry) => textOf(entry))).toEqual([
      '・－',
      '－・・・',
      '－・－・',
      '－・・',
      '・',
      '・・－・',
      '－－・',
      '・・・・',
      '・・',
      '・－－－',
      '－・－',
      '・－・・',
      '－－',
      '－・',
      '－－－',
      '・－－・',
      '－－・－',
      '・－・',
      '・・・',
      '－',
      '・・－',
      '・・・－',
      '・－－',
      '－・・－',
      '－・－－',
      '－－・・',
    ]);
  });
});

describe('NUMERALS', () => {
  it('1〜9・0 の符号', () => {
    expect(NUMERALS.map((entry) => `${entry.label}${textOf(entry)}`)).toEqual([
      '1・－－－－',
      '2・・－－－',
      '3・・・－－',
      '4・・・・－',
      '5・・・・・',
      '6－・・・・',
      '7－－・・・',
      '8－－－・・',
      '9－－－－・',
      '0－－－－－',
    ]);
  });
});

describe('OBUN_SYMBOLS', () => {
  it('ITU-R M.1677-1 の句読点・記号の符号', () => {
    expect(OBUN_SYMBOLS.map((entry) => [entry.label, textOf(entry)])).toEqual([
      ['.（ピリオド）', '・－・－・－'],
      [',（コンマ）', '－－・・－－'],
      [':（コロン）', '－－－・・・'],
      ['?（疑問符）', '・・－－・・'],
      ["'（アポストロフィ）", '・－－－－・'],
      ['-（ハイフン）', '－・・・・－'],
      ['/（斜線）', '－・・－・'],
      ['左括弧 (', '－・－－・'],
      ['右括弧 )', '－・－－・－'],
      ['"（引用符）', '・－・・－・'],
      ['=（二重線）', '－・・・－'],
      ['+（加算記号）', '・－・－・'],
      ['×（乗算記号）', '－・・－'],
      ['@（アットマーク）', '・－－・－・'],
    ]);
  });

  it('乗算記号は X と同じ符号で、それ以外の欧文の符号はすべて異なる', () => {
    const multiplication = OBUN_SYMBOLS.find((entry) => entry.label.startsWith('×'));
    const x = OBUN_LETTERS.find((entry) => entry.label === 'X');
    expect(multiplication && textOf(multiplication)).toBe(x && textOf(x));

    const codes = [...OBUN_LETTERS, ...NUMERALS, ...OBUN_SYMBOLS]
      .filter((entry) => entry !== multiplication)
      .map((entry) => textOf(entry));
    expect(new Set(codes).size).toBe(codes.length);
  });
});
