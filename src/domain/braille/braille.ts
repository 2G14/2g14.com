/** 点字 1 マスの点番号。読む面から見て左列上から 1・2・3、右列上から 4・5・6 */
export type Dot = 1 | 2 | 3 | 4 | 5 | 6;

/** 点字 1 マス（盛り上がっている点の番号の集合） */
export type Cell = readonly Dot[];

export interface BrailleEntry {
  /** 墨字（点字でない普通の文字）での表記 */
  readonly label: string;
  /** 1 文字を表すのに使うマス（濁音・拗音・数字などは 2 マス） */
  readonly cells: readonly Cell[];
}

/** 段の位置を揃えるため、該当する仮名が無い段は null にする */
export type KanaRow = readonly (BrailleEntry | null)[];

export const ALL_DOTS = [1, 2, 3, 4, 5, 6] as const satisfies readonly Dot[];

/** Unicode の点字パターン（U+2800〜U+283F）は 1 の点を最下位ビットとしたビット列で並んでいる */
export function cellToUnicode(cell: Cell): string {
  return String.fromCodePoint(0x2800 + cell.reduce((bits, dot) => bits | (1 << (dot - 1)), 0));
}

export function dotsLabel(cell: Cell): string {
  return cell.join('・');
}

export const SEION_ROWS = [
  [
    { label: 'あ', cells: [[1]] },
    { label: 'い', cells: [[1, 2]] },
    { label: 'う', cells: [[1, 4]] },
    { label: 'え', cells: [[1, 2, 4]] },
    { label: 'お', cells: [[2, 4]] },
  ],
  [
    { label: 'か', cells: [[1, 6]] },
    { label: 'き', cells: [[1, 2, 6]] },
    { label: 'く', cells: [[1, 4, 6]] },
    { label: 'け', cells: [[1, 2, 4, 6]] },
    { label: 'こ', cells: [[2, 4, 6]] },
  ],
  [
    { label: 'さ', cells: [[1, 5, 6]] },
    { label: 'し', cells: [[1, 2, 5, 6]] },
    { label: 'す', cells: [[1, 4, 5, 6]] },
    { label: 'せ', cells: [[1, 2, 4, 5, 6]] },
    { label: 'そ', cells: [[2, 4, 5, 6]] },
  ],
  [
    { label: 'た', cells: [[1, 3, 5]] },
    { label: 'ち', cells: [[1, 2, 3, 5]] },
    { label: 'つ', cells: [[1, 3, 4, 5]] },
    { label: 'て', cells: [[1, 2, 3, 4, 5]] },
    { label: 'と', cells: [[2, 3, 4, 5]] },
  ],
  [
    { label: 'な', cells: [[1, 3]] },
    { label: 'に', cells: [[1, 2, 3]] },
    { label: 'ぬ', cells: [[1, 3, 4]] },
    { label: 'ね', cells: [[1, 2, 3, 4]] },
    { label: 'の', cells: [[2, 3, 4]] },
  ],
  [
    { label: 'は', cells: [[1, 3, 6]] },
    { label: 'ひ', cells: [[1, 2, 3, 6]] },
    { label: 'ふ', cells: [[1, 3, 4, 6]] },
    { label: 'へ', cells: [[1, 2, 3, 4, 6]] },
    { label: 'ほ', cells: [[2, 3, 4, 6]] },
  ],
  [
    { label: 'ま', cells: [[1, 3, 5, 6]] },
    { label: 'み', cells: [[1, 2, 3, 5, 6]] },
    { label: 'む', cells: [[1, 3, 4, 5, 6]] },
    { label: 'め', cells: [[1, 2, 3, 4, 5, 6]] },
    { label: 'も', cells: [[2, 3, 4, 5, 6]] },
  ],
  [
    { label: 'や', cells: [[3, 4]] },
    null,
    { label: 'ゆ', cells: [[3, 4, 6]] },
    null,
    { label: 'よ', cells: [[3, 4, 5]] },
  ],
  [
    { label: 'ら', cells: [[1, 5]] },
    { label: 'り', cells: [[1, 2, 5]] },
    { label: 'る', cells: [[1, 4, 5]] },
    { label: 'れ', cells: [[1, 2, 4, 5]] },
    { label: 'ろ', cells: [[2, 4, 5]] },
  ],
  [{ label: 'わ', cells: [[3]] }, null, null, null, { label: 'を', cells: [[3, 5]] }],
] as const satisfies readonly KanaRow[];

const SEION_CELLS = new Map<string, Cell>(
  SEION_ROWS.flat()
    .filter((entry) => entry !== null)
    .map((entry) => [entry.label, entry.cells[0]]),
);

function seionCell(kana: string): Cell {
  const found = SEION_CELLS.get(kana);
  if (found === undefined) throw new Error(`清音の点字が定義されていません: ${kana}`);
  return found;
}

const DAKUTEN: Cell = [5];
const HANDAKUTEN: Cell = [6];

/**
 * 濁音・半濁音は清音の前に濁点（5 の点）・半濁点（6 の点）を置いた 2 マスで表す。
 * 墨字の表記は清音に結合用濁点（U+3099）・半濁点（U+309A）を付けて NFC 正規化すると得られる
 */
function dakuonRow(bases: string, prefix: Cell, combiningMark: string): BrailleEntry[] {
  return [...bases].map((base) => ({
    label: (base + combiningMark).normalize('NFC'),
    cells: [prefix, seionCell(base)],
  }));
}

export const DAKUON_ROWS = [
  dakuonRow('かきくけこ', DAKUTEN, '゙'),
  dakuonRow('さしすせそ', DAKUTEN, '゙'),
  dakuonRow('たちつてと', DAKUTEN, '゙'),
  dakuonRow('はひふへほ', DAKUTEN, '゙'),
  dakuonRow('はひふへほ', HANDAKUTEN, '゚'),
] as const satisfies readonly KanaRow[];

const YOON_SIGN: Cell = [4];
const YOON_DAKUON_SIGN: Cell = [4, 5];
const YOON_HANDAKUON_SIGN: Cell = [4, 6];

/** 拗音は拗音符の後に、同じ行のア段・ウ段・オ段の仮名を置いて表す（きゃ = 拗音符 + か） */
function yoonRow(head: string, sign: Cell, a: string, u: string, o: string): BrailleEntry[] {
  return [
    { label: `${head}ゃ`, cells: [sign, seionCell(a)] },
    { label: `${head}ゅ`, cells: [sign, seionCell(u)] },
    { label: `${head}ょ`, cells: [sign, seionCell(o)] },
  ];
}

export const YOON_ROWS = [
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
] as const satisfies readonly KanaRow[];

export const SPECIAL_KANA = [
  { label: 'ん（撥音）', cells: [[3, 5, 6]] },
  { label: 'っ（促音）', cells: [[2]] },
  { label: 'ー（長音）', cells: [[2, 5]] },
] as const satisfies readonly BrailleEntry[];

const NUMERAL_SIGN: Cell = [3, 4, 5, 6];

/** 数字は数符の後に数字の形を続ける。数符は続く数字の並び全体に効くので、1 つの数に 1 回だけ置く */
export const NUMERALS = [
  { label: '数符', cells: [NUMERAL_SIGN] },
  { label: '1', cells: [NUMERAL_SIGN, [1]] },
  { label: '2', cells: [NUMERAL_SIGN, [1, 2]] },
  { label: '3', cells: [NUMERAL_SIGN, [1, 4]] },
  { label: '4', cells: [NUMERAL_SIGN, [1, 4, 5]] },
  { label: '5', cells: [NUMERAL_SIGN, [1, 5]] },
  { label: '6', cells: [NUMERAL_SIGN, [1, 2, 4]] },
  { label: '7', cells: [NUMERAL_SIGN, [1, 2, 4, 5]] },
  { label: '8', cells: [NUMERAL_SIGN, [1, 2, 5]] },
  { label: '9', cells: [NUMERAL_SIGN, [2, 4]] },
  { label: '0', cells: [NUMERAL_SIGN, [2, 4, 5]] },
] as const satisfies readonly BrailleEntry[];

export const PUNCTUATION = [
  { label: '。（句点）', cells: [[2, 5, 6]] },
  { label: '、（読点）', cells: [[5, 6]] },
  { label: '？（疑問符）', cells: [[2, 6]] },
  { label: '！（感嘆符）', cells: [[2, 3, 5]] },
  { label: '・（中点）', cells: [[5]] },
] as const satisfies readonly BrailleEntry[];
