interface Jikkan {
  readonly kanji: string;
  readonly kana: string;
}

export interface Junishi {
  readonly kanji: string;
  readonly kana: string;
  readonly animal: string;
  readonly emoji: string;
}

const JIKKAN = [
  { kanji: '甲', kana: 'きのえ' },
  { kanji: '乙', kana: 'きのと' },
  { kanji: '丙', kana: 'ひのえ' },
  { kanji: '丁', kana: 'ひのと' },
  { kanji: '戊', kana: 'つちのえ' },
  { kanji: '己', kana: 'つちのと' },
  { kanji: '庚', kana: 'かのえ' },
  { kanji: '辛', kana: 'かのと' },
  { kanji: '壬', kana: 'みずのえ' },
  { kanji: '癸', kana: 'みずのと' },
] as const satisfies readonly Jikkan[];

export const JUNISHI = [
  { kanji: '子', kana: 'ね', animal: 'ねずみ', emoji: '🐭' },
  { kanji: '丑', kana: 'うし', animal: 'うし', emoji: '🐮' },
  { kanji: '寅', kana: 'とら', animal: 'とら', emoji: '🐯' },
  { kanji: '卯', kana: 'う', animal: 'うさぎ', emoji: '🐰' },
  { kanji: '辰', kana: 'たつ', animal: 'りゅう', emoji: '🐲' },
  { kanji: '巳', kana: 'み', animal: 'へび', emoji: '🐍' },
  { kanji: '午', kana: 'うま', animal: 'うま', emoji: '🐴' },
  { kanji: '未', kana: 'ひつじ', animal: 'ひつじ', emoji: '🐑' },
  { kanji: '申', kana: 'さる', animal: 'さる', emoji: '🐵' },
  { kanji: '酉', kana: 'とり', animal: 'にわとり', emoji: '🐔' },
  { kanji: '戌', kana: 'いぬ', animal: 'いぬ', emoji: '🐶' },
  { kanji: '亥', kana: 'い', animal: 'いのしし', emoji: '🐗' },
] as const satisfies readonly Junishi[];

export interface Kanshi {
  readonly jikkan: Jikkan;
  readonly junishi: Junishi;
  /** 六十干支の通し番号（甲子 = 1、癸亥 = 60） */
  readonly kanshiNumber: number;
  /** 十干十二支の漢字表記（例: 乙巳） */
  readonly kanji: string;
  /** 十干十二支の訓読み（例: きのとみ） */
  readonly reading: string;
}

export class InvalidEtoYearError extends Error {
  constructor(message: string = '無効な年です') {
    super(message);
    this.name = 'InvalidEtoYearError';
    Object.setPrototypeOf(this, InvalidEtoYearError.prototype);
  }
}

// 剰余演算子 % は負の被除数で負を返すため、常に 0 以上を返す mod を使う
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * 西暦年から十干十二支を求める。年の切り替わりは 1 月 1 日基準。
 * 西暦 4 年が甲子（1 番）であることを基準に 60 年周期で巡る。
 */
export function etoFromYear(year: number): Kanshi {
  if (!Number.isInteger(year)) {
    throw new InvalidEtoYearError(`年は整数である必要があります: ${year}`);
  }

  const jikkan = JIKKAN[mod(year - 4, 10)]!;
  const junishi = JUNISHI[mod(year - 4, 12)]!;

  return {
    jikkan,
    junishi,
    kanshiNumber: mod(year - 4, 60) + 1,
    kanji: `${jikkan.kanji}${junishi.kanji}`,
    reading: `${jikkan.kana}${junishi.kana}`,
  };
}

/**
 * 指定した十二支に該当する西暦年を新しい順に列挙する。
 */
export function yearsForJunishi(junishiIndex: number, fromYear: number, toYear: number): number[] {
  if (!Number.isInteger(junishiIndex) || junishiIndex < 0 || junishiIndex >= JUNISHI.length) {
    throw new InvalidEtoYearError(`十二支の番号は 0〜11 である必要があります: ${junishiIndex}`);
  }

  const years: number[] = [];
  for (let year = toYear; year >= fromYear; year--) {
    if (mod(year - 4, 12) === junishiIndex) years.push(year);
  }
  return years;
}
