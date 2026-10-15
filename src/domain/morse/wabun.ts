import { entryFromPattern, type MorseEntry } from '#src/domain/morse/entry.js';

/** 段の位置を揃えるため、該当する仮名が無い段は null にする */
type KanaRow = readonly (MorseEntry | null)[];

/** 和文モールス符号（無線局運用規則 別表第一号）の仮名を五十音順に並べたもの */
export const WABUN_KANA_ROWS: readonly KanaRow[] = [
  [
    entryFromPattern('ア', '--.--'),
    entryFromPattern('イ', '.-'),
    entryFromPattern('ウ', '..-'),
    entryFromPattern('エ', '-.---'),
    entryFromPattern('オ', '.-...'),
  ],
  [
    entryFromPattern('カ', '.-..'),
    entryFromPattern('キ', '-.-..'),
    entryFromPattern('ク', '...-'),
    entryFromPattern('ケ', '-.--'),
    entryFromPattern('コ', '----'),
  ],
  [
    entryFromPattern('サ', '-.-.-'),
    entryFromPattern('シ', '--.-.'),
    entryFromPattern('ス', '---.-'),
    entryFromPattern('セ', '.---.'),
    entryFromPattern('ソ', '---.'),
  ],
  [
    entryFromPattern('タ', '-.'),
    entryFromPattern('チ', '..-.'),
    entryFromPattern('ツ', '.--.'),
    entryFromPattern('テ', '.-.--'),
    entryFromPattern('ト', '..-..'),
  ],
  [
    entryFromPattern('ナ', '.-.'),
    entryFromPattern('ニ', '-.-.'),
    entryFromPattern('ヌ', '....'),
    entryFromPattern('ネ', '--.-'),
    entryFromPattern('ノ', '..--'),
  ],
  [
    entryFromPattern('ハ', '-...'),
    entryFromPattern('ヒ', '--..-'),
    entryFromPattern('フ', '--..'),
    entryFromPattern('ヘ', '.'),
    entryFromPattern('ホ', '-..'),
  ],
  [
    entryFromPattern('マ', '-..-'),
    entryFromPattern('ミ', '..-.-'),
    entryFromPattern('ム', '-'),
    entryFromPattern('メ', '-...-'),
    entryFromPattern('モ', '-..-.'),
  ],
  [
    entryFromPattern('ヤ', '.--'),
    null,
    entryFromPattern('ユ', '-..--'),
    null,
    entryFromPattern('ヨ', '--'),
  ],
  [
    entryFromPattern('ラ', '...'),
    entryFromPattern('リ', '--.'),
    entryFromPattern('ル', '-.--.'),
    entryFromPattern('レ', '---'),
    entryFromPattern('ロ', '.-.-'),
  ],
  [
    entryFromPattern('ワ', '-.-'),
    entryFromPattern('ヰ', '.-..-'),
    null,
    entryFromPattern('ヱ', '.--..'),
    entryFromPattern('ヲ', '.---'),
  ],
];

export const WABUN_SIGNS: readonly MorseEntry[] = [
  entryFromPattern('ン', '.-.-.'),
  entryFromPattern('゛（濁点）', '..'),
  entryFromPattern('゜（半濁点）', '..--.'),
  entryFromPattern('ー（長音）', '.--.-'),
  entryFromPattern('、（区切点）', '.-.-.-'),
  entryFromPattern('」（段落）', '.-.-..'),
  entryFromPattern('左括弧（', '-.--.-'),
  entryFromPattern('右括弧）', '.-..-.'),
];
