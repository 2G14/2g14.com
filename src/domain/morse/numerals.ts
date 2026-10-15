import { entryFromPattern, type MorseEntry } from '#src/domain/morse/entry.js';

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
