import { entryFromPattern, type MorseEntry } from '#src/domain/morse/entry.js';

/** 欧文モールス符号（ITU-R M.1677-1）の文字 */
export const OBUN_LETTERS: readonly MorseEntry[] = [
  entryFromPattern('A', '.-'),
  entryFromPattern('B', '-...'),
  entryFromPattern('C', '-.-.'),
  entryFromPattern('D', '-..'),
  entryFromPattern('E', '.'),
  entryFromPattern('F', '..-.'),
  entryFromPattern('G', '--.'),
  entryFromPattern('H', '....'),
  entryFromPattern('I', '..'),
  entryFromPattern('J', '.---'),
  entryFromPattern('K', '-.-'),
  entryFromPattern('L', '.-..'),
  entryFromPattern('M', '--'),
  entryFromPattern('N', '-.'),
  entryFromPattern('O', '---'),
  entryFromPattern('P', '.--.'),
  entryFromPattern('Q', '--.-'),
  entryFromPattern('R', '.-.'),
  entryFromPattern('S', '...'),
  entryFromPattern('T', '-'),
  entryFromPattern('U', '..-'),
  entryFromPattern('V', '...-'),
  entryFromPattern('W', '.--'),
  entryFromPattern('X', '-..-'),
  entryFromPattern('Y', '-.--'),
  entryFromPattern('Z', '--..'),
];

/** 数字は和文・欧文で共通 */
export const NUMERALS: readonly MorseEntry[] = [
  entryFromPattern('1', '.----'),
  entryFromPattern('2', '..---'),
  entryFromPattern('3', '...--'),
  entryFromPattern('4', '....-'),
  entryFromPattern('5', '.....'),
  entryFromPattern('6', '-....'),
  entryFromPattern('7', '--...'),
  entryFromPattern('8', '---..'),
  entryFromPattern('9', '----.'),
  entryFromPattern('0', '-----'),
];

export const OBUN_SYMBOLS: readonly MorseEntry[] = [
  entryFromPattern('.（ピリオド）', '.-.-.-'),
  entryFromPattern(',（コンマ）', '--..--'),
  entryFromPattern(':（コロン）', '---...'),
  entryFromPattern('?（疑問符）', '..--..'),
  entryFromPattern("'（アポストロフィ）", '.----.'),
  entryFromPattern('-（ハイフン）', '-....-'),
  entryFromPattern('/（斜線）', '-..-.'),
  entryFromPattern('左括弧 (', '-.--.'),
  entryFromPattern('右括弧 )', '-.--.-'),
  entryFromPattern('"（引用符）', '.-..-.'),
  entryFromPattern('=（二重線・イコール）', '-...-'),
  entryFromPattern('+（加算記号）', '.-.-.'),
  entryFromPattern('×（乗算記号）', '-..-'),
  entryFromPattern('@（アットマーク）', '.--.-.'),
];
