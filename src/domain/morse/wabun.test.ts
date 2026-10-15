import { describe, expect, it } from 'vitest';

import { morseCodeToText } from '#src/domain/morse/code.js';
import type { MorseEntry } from '#src/domain/morse/entry.js';
import { WABUN_KANA_ROWS, WABUN_SIGNS } from '#src/domain/morse/wabun.js';

const kanaEntries: MorseEntry[] = WABUN_KANA_ROWS.flat().filter((entry) => entry !== null);
const codeOf = new Map(kanaEntries.map((entry) => [entry.label, morseCodeToText(entry.code)]));

describe('WABUN_KANA_ROWS', () => {
  // 無線局運用規則 別表第一号の和文の表と同じいろは順で照合する
  it.each([
    ['イ', '・－'],
    ['ロ', '・－・－'],
    ['ハ', '－・・・'],
    ['ニ', '－・－・'],
    ['ホ', '－・・'],
    ['ヘ', '・'],
    ['ト', '・・－・・'],
    ['チ', '・・－・'],
    ['リ', '－－・'],
    ['ヌ', '・・・・'],
    ['ル', '－・－－・'],
    ['ヲ', '・－－－'],
    ['ワ', '－・－'],
    ['カ', '・－・・'],
    ['ヨ', '－－'],
    ['タ', '－・'],
    ['レ', '－－－'],
    ['ソ', '－－－・'],
    ['ツ', '・－－・'],
    ['ネ', '－－・－'],
    ['ナ', '・－・'],
    ['ラ', '・・・'],
    ['ム', '－'],
    ['ウ', '・・－'],
    ['ヰ', '・－・・－'],
    ['ノ', '・・－－'],
    ['オ', '・－・・・'],
    ['ク', '・・・－'],
    ['ヤ', '・－－'],
    ['マ', '－・・－'],
    ['ケ', '－・－－'],
    ['フ', '－－・・'],
    ['コ', '－－－－'],
    ['エ', '－・－－－'],
    ['テ', '・－・－－'],
    ['ア', '－－・－－'],
    ['サ', '－・－・－'],
    ['キ', '－・－・・'],
    ['ユ', '－・・－－'],
    ['メ', '－・・・－'],
    ['ミ', '・・－・－'],
    ['シ', '－－・－・'],
    ['ヱ', '・－－・・'],
    ['ヒ', '－－・・－'],
    ['モ', '－・・－・'],
    ['セ', '・－－－・'],
    ['ス', '－－－・－'],
  ])('%s は %s', (kana, expected) => {
    expect(codeOf.get(kana)).toBe(expected);
  });

  it('いろは 47 字をすべて含む', () => {
    expect(kanaEntries).toHaveLength(47);
  });

  it('各行を 5 段に揃え、仮名の無い段は null にする', () => {
    expect(WABUN_KANA_ROWS.every((row) => row.length === 5)).toBe(true);
    expect(WABUN_KANA_ROWS.map((row) => row.map((entry) => entry?.label ?? null))).toContainEqual([
      'ヤ',
      null,
      'ユ',
      null,
      'ヨ',
    ]);
    expect(WABUN_KANA_ROWS.at(-1)?.map((entry) => entry?.label ?? null)).toEqual([
      'ワ',
      'ヰ',
      null,
      'ヱ',
      'ヲ',
    ]);
  });
});

describe('WABUN_SIGNS', () => {
  it('ン・濁点・半濁点・長音・区切点・段落・括弧の符号', () => {
    expect(WABUN_SIGNS.map((entry) => morseCodeToText(entry.code))).toEqual([
      '・－・－・',
      '・・',
      '・・－－・',
      '・－－・－',
      '・－・－・－',
      '・－・－・・',
      '－・－－・－',
      '・－・・－・',
    ]);
  });

  it('和文の仮名と記号の符号はすべて異なる', () => {
    const codes = [...kanaEntries, ...WABUN_SIGNS].map((entry) => morseCodeToText(entry.code));
    expect(new Set(codes).size).toBe(codes.length);
  });
});
