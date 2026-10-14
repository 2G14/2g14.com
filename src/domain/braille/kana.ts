import { type Cell, createBrailleCell } from '#src/domain/braille/cell.js';
import {
  type BrailleEntry,
  createBrailleEntry,
  entryFromDots as entry,
  type KanaRow,
} from '#src/domain/braille/entry.js';

export const SEION_ROWS: readonly KanaRow[] = [
  [
    entry('あ', [1]),
    entry('い', [1, 2]),
    entry('う', [1, 4]),
    entry('え', [1, 2, 4]),
    entry('お', [2, 4]),
  ],
  [
    entry('か', [1, 6]),
    entry('き', [1, 2, 6]),
    entry('く', [1, 4, 6]),
    entry('け', [1, 2, 4, 6]),
    entry('こ', [2, 4, 6]),
  ],
  [
    entry('さ', [1, 5, 6]),
    entry('し', [1, 2, 5, 6]),
    entry('す', [1, 4, 5, 6]),
    entry('せ', [1, 2, 4, 5, 6]),
    entry('そ', [2, 4, 5, 6]),
  ],
  [
    entry('た', [1, 3, 5]),
    entry('ち', [1, 2, 3, 5]),
    entry('つ', [1, 3, 4, 5]),
    entry('て', [1, 2, 3, 4, 5]),
    entry('と', [2, 3, 4, 5]),
  ],
  [
    entry('な', [1, 3]),
    entry('に', [1, 2, 3]),
    entry('ぬ', [1, 3, 4]),
    entry('ね', [1, 2, 3, 4]),
    entry('の', [2, 3, 4]),
  ],
  [
    entry('は', [1, 3, 6]),
    entry('ひ', [1, 2, 3, 6]),
    entry('ふ', [1, 3, 4, 6]),
    entry('へ', [1, 2, 3, 4, 6]),
    entry('ほ', [2, 3, 4, 6]),
  ],
  [
    entry('ま', [1, 3, 5, 6]),
    entry('み', [1, 2, 3, 5, 6]),
    entry('む', [1, 3, 4, 5, 6]),
    entry('め', [1, 2, 3, 4, 5, 6]),
    entry('も', [2, 3, 4, 5, 6]),
  ],
  [entry('や', [3, 4]), null, entry('ゆ', [3, 4, 6]), null, entry('よ', [3, 4, 5])],
  [
    entry('ら', [1, 5]),
    entry('り', [1, 2, 5]),
    entry('る', [1, 4, 5]),
    entry('れ', [1, 2, 4, 5]),
    entry('ろ', [2, 4, 5]),
  ],
  [entry('わ', [3]), null, null, null, entry('を', [3, 5])],
];

const SEION_CELLS = new Map<string, Cell>();
for (const seion of SEION_ROWS.flat()) {
  const [first] = seion?.cells ?? [];
  if (seion !== null && first !== undefined) SEION_CELLS.set(seion.label, first);
}

function seionCell(kana: string): Cell {
  const found = SEION_CELLS.get(kana);
  if (found === undefined) throw new Error(`清音の点字が定義されていません: ${kana}`);
  return found;
}

const DAKUTEN = createBrailleCell([5]);
const COMBINING_DAKUTEN = '\u3099';
const HANDAKUTEN = createBrailleCell([6]);
const COMBINING_HANDAKUTEN = '\u309A';

/**
 * 濁音・半濁音は清音の前に濁点（5 の点）・半濁点（6 の点）を置いた 2 マスで表す。
 * 墨字の表記は清音に結合用濁点（U+3099）・半濁点（U+309A）を付けて NFC 正規化すると得られる
 */
function dakuonRow(bases: string, prefix: Cell, combiningMark: string): BrailleEntry[] {
  return [...bases].map((base) =>
    createBrailleEntry((base + combiningMark).normalize('NFC'), [prefix, seionCell(base)]),
  );
}

export const DAKUON_ROWS: readonly KanaRow[] = [
  dakuonRow('かきくけこ', DAKUTEN, COMBINING_DAKUTEN),
  dakuonRow('さしすせそ', DAKUTEN, COMBINING_DAKUTEN),
  dakuonRow('たちつてと', DAKUTEN, COMBINING_DAKUTEN),
  dakuonRow('はひふへほ', DAKUTEN, COMBINING_DAKUTEN),
  dakuonRow('はひふへほ', HANDAKUTEN, COMBINING_HANDAKUTEN),
];

const YOON_SIGN = createBrailleCell([4]);
const YOON_DAKUON_SIGN = createBrailleCell([4, 5]);
const YOON_HANDAKUON_SIGN = createBrailleCell([4, 6]);

/** 拗音は拗音符の後に、同じ行のア段・ウ段・オ段の仮名を置いて表す（きゃ = 拗音符 + か） */
function yoonRow(head: string, sign: Cell, a: string, u: string, o: string): BrailleEntry[] {
  return [
    createBrailleEntry(`${head}ゃ`, [sign, seionCell(a)]),
    createBrailleEntry(`${head}ゅ`, [sign, seionCell(u)]),
    createBrailleEntry(`${head}ょ`, [sign, seionCell(o)]),
  ];
}

export const YOON_ROWS: readonly KanaRow[] = [
  yoonRow('き', YOON_SIGN, 'か', 'く', 'こ'),
  yoonRow('し', YOON_SIGN, 'さ', 'す', 'そ'),
  yoonRow('ち', YOON_SIGN, 'た', 'つ', 'と'),
  yoonRow('に', YOON_SIGN, 'な', 'ぬ', 'の'),
  yoonRow('ひ', YOON_SIGN, 'は', 'ふ', 'ほ'),
  yoonRow('み', YOON_SIGN, 'ま', 'む', 'も'),
  yoonRow('り', YOON_SIGN, 'ら', 'る', 'ろ'),
  yoonRow('ぎ', YOON_DAKUON_SIGN, 'か', 'く', 'こ'),
  yoonRow('じ', YOON_DAKUON_SIGN, 'さ', 'す', 'そ'),
  yoonRow('ぢ', YOON_DAKUON_SIGN, 'た', 'つ', 'と'),
  yoonRow('び', YOON_DAKUON_SIGN, 'は', 'ふ', 'ほ'),
  yoonRow('ぴ', YOON_HANDAKUON_SIGN, 'は', 'ふ', 'ほ'),
];

export const SPECIAL_KANA: readonly BrailleEntry[] = [
  entry('ん（撥音）', [3, 5, 6]),
  entry('っ（促音）', [2]),
  entry('ー（長音）', [2, 5]),
];

/** 合拗音符。ウィ・クァ・ツァ・ファなど、ウ段・ク・ツ・フなどに小さいア行が付く音に使う */
const GOYOON_SIGN = createBrailleCell([2, 6]);
const GOYOON_DAKUON_SIGN = createBrailleCell([2, 5, 6]);
const YOON_DAKUON_HANDAKUON_SIGN = createBrailleCell([4, 5, 6]);

function extended(label: string, sign: Cell, base: string): BrailleEntry {
  return createBrailleEntry(label, [sign, seionCell(base)]);
}

/** 特殊音（主に外来語の音）。前置符号の後に、母音や子音の近い清音を置いて表す */
export const EXTENDED_KANA: readonly BrailleEntry[] = [
  extended('イェ', YOON_SIGN, 'え'),
  extended('キェ', YOON_SIGN, 'け'),
  extended('シェ', YOON_SIGN, 'せ'),
  extended('ジェ', YOON_DAKUON_SIGN, 'せ'),
  extended('チェ', YOON_SIGN, 'て'),
  extended('ニェ', YOON_SIGN, 'ね'),
  extended('ヒェ', YOON_SIGN, 'へ'),
  extended('スィ', YOON_SIGN, 'し'),
  extended('ズィ', YOON_DAKUON_SIGN, 'し'),
  extended('ティ', YOON_SIGN, 'ち'),
  extended('ディ', YOON_DAKUON_SIGN, 'ち'),
  extended('ウィ', GOYOON_SIGN, 'い'),
  extended('ウェ', GOYOON_SIGN, 'え'),
  extended('ウォ', GOYOON_SIGN, 'お'),
  extended('クァ', GOYOON_SIGN, 'か'),
  extended('クィ', GOYOON_SIGN, 'き'),
  extended('クェ', GOYOON_SIGN, 'け'),
  extended('クォ', GOYOON_SIGN, 'こ'),
  extended('グァ', GOYOON_DAKUON_SIGN, 'か'),
  extended('グィ', GOYOON_DAKUON_SIGN, 'き'),
  extended('グェ', GOYOON_DAKUON_SIGN, 'け'),
  extended('グォ', GOYOON_DAKUON_SIGN, 'こ'),
  extended('ツァ', GOYOON_SIGN, 'た'),
  extended('ツィ', GOYOON_SIGN, 'ち'),
  extended('ツェ', GOYOON_SIGN, 'て'),
  extended('ツォ', GOYOON_SIGN, 'と'),
  extended('トゥ', GOYOON_SIGN, 'つ'),
  extended('ドゥ', GOYOON_DAKUON_SIGN, 'つ'),
  extended('ファ', GOYOON_SIGN, 'は'),
  extended('フィ', GOYOON_SIGN, 'ひ'),
  extended('フェ', GOYOON_SIGN, 'へ'),
  extended('フォ', GOYOON_SIGN, 'ほ'),
  extended('ヴァ', GOYOON_DAKUON_SIGN, 'は'),
  extended('ヴィ', GOYOON_DAKUON_SIGN, 'ひ'),
  extended('ヴェ', GOYOON_DAKUON_SIGN, 'へ'),
  extended('ヴォ', GOYOON_DAKUON_SIGN, 'ほ'),
  extended('テュ', YOON_HANDAKUON_SIGN, 'つ'),
  extended('デュ', YOON_DAKUON_HANDAKUON_SIGN, 'つ'),
  extended('フュ', YOON_HANDAKUON_SIGN, 'ゆ'),
  extended('ヴュ', YOON_DAKUON_HANDAKUON_SIGN, 'ゆ'),
  extended('フョ', YOON_HANDAKUON_SIGN, 'よ'),
  extended('ヴョ', YOON_DAKUON_HANDAKUON_SIGN, 'よ'),
  extended('ヴ', DAKUTEN, 'う'),
];
