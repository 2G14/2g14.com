import { createBrailleCell, type Dot } from '#src/domain/braille/cell.js';
import {
  type BrailleEntry,
  createBrailleEntry,
  entryFromDots as entry,
} from '#src/domain/braille/entry.js';

const NUMERAL_SIGN = createBrailleCell([3, 4, 5, 6]);

/** 数字は数符の後に数字の形を続ける。数符は続く数字の並び全体に効くので、1 つの数に 1 回だけ置く */
export const NUMERALS: readonly BrailleEntry[] = [
  createBrailleEntry('数符', [NUMERAL_SIGN]),
  createBrailleEntry('1', [NUMERAL_SIGN, createBrailleCell([1])]),
  createBrailleEntry('2', [NUMERAL_SIGN, createBrailleCell([1, 2])]),
  createBrailleEntry('3', [NUMERAL_SIGN, createBrailleCell([1, 4])]),
  createBrailleEntry('4', [NUMERAL_SIGN, createBrailleCell([1, 4, 5])]),
  createBrailleEntry('5', [NUMERAL_SIGN, createBrailleCell([1, 5])]),
  createBrailleEntry('6', [NUMERAL_SIGN, createBrailleCell([1, 2, 4])]),
  createBrailleEntry('7', [NUMERAL_SIGN, createBrailleCell([1, 2, 4, 5])]),
  createBrailleEntry('8', [NUMERAL_SIGN, createBrailleCell([1, 2, 5])]),
  createBrailleEntry('9', [NUMERAL_SIGN, createBrailleCell([2, 4])]),
  createBrailleEntry('0', [NUMERAL_SIGN, createBrailleCell([2, 4, 5])]),
];

export const PUNCTUATION: readonly BrailleEntry[] = [
  entry('。（句点）', [2, 5, 6]),
  entry('、（読点）', [5, 6]),
  entry('？（疑問符）', [2, 6]),
  entry('！（感嘆符）', [2, 3, 5]),
  entry('・（中点）', [5]),
];

const FOREIGN_LETTER_SIGN = createBrailleCell([5, 6]);
const CAPITAL_SIGN = createBrailleCell([6]);

const LETTERS = [
  ['a', [1]],
  ['b', [1, 2]],
  ['c', [1, 4]],
  ['d', [1, 4, 5]],
  ['e', [1, 5]],
  ['f', [1, 2, 4]],
  ['g', [1, 2, 4, 5]],
  ['h', [1, 2, 5]],
  ['i', [2, 4]],
  ['j', [2, 4, 5]],
  ['k', [1, 3]],
  ['l', [1, 2, 3]],
  ['m', [1, 3, 4]],
  ['n', [1, 3, 4, 5]],
  ['o', [1, 3, 5]],
  ['p', [1, 2, 3, 4]],
  ['q', [1, 2, 3, 4, 5]],
  ['r', [1, 2, 3, 5]],
  ['s', [2, 3, 4]],
  ['t', [2, 3, 4, 5]],
  ['u', [1, 3, 6]],
  ['v', [1, 2, 3, 6]],
  ['w', [2, 4, 5, 6]],
  ['x', [1, 3, 4, 6]],
  ['y', [1, 3, 4, 5, 6]],
  ['z', [1, 3, 5, 6]],
] as const satisfies readonly (readonly [string, readonly Dot[]])[];

/**
 * 日本語の文中で文字や略称を書くときは外字符の後に続ける。外字符は数符と同じく続く文字の並び全体に効き、
 * 大文字はその文字の前に大文字符を置く。大文字が続くときの二重大文字符と、英単語・英文を囲む
 * 外国語引用符は、1 文字ずつの対応表に収まらないため一覧に含めない
 */
export const ALPHABET: readonly BrailleEntry[] = [
  createBrailleEntry('外字符', [FOREIGN_LETTER_SIGN]),
  createBrailleEntry('大文字符', [CAPITAL_SIGN]),
  ...LETTERS.map(([label, dots]) =>
    createBrailleEntry(label, [FOREIGN_LETTER_SIGN, createBrailleCell(dots)]),
  ),
];
