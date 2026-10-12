export interface Choju {
  readonly name: string;
  readonly reading: string;
  readonly kazoedoshi: number;
  readonly fullAge: number;
  readonly origin: string;
}

export const CHOJU_LIST = [
  {
    name: '還暦',
    reading: 'かんれき',
    kazoedoshi: 61,
    fullAge: 60,
    origin: '生まれた年の干支（六十干支）が一巡して暦が還ることから',
  },
  {
    name: '緑寿',
    reading: 'ろくじゅ',
    kazoedoshi: 66,
    fullAge: 66,
    origin: '「緑緑寿（ろくろくじゅ）」の略で、66（ろくろく）にかけた語呂合わせから',
  },
  {
    name: '古希',
    reading: 'こき',
    kazoedoshi: 70,
    fullAge: 70,
    origin: '杜甫の詩「人生七十古来稀なり」から',
  },
  {
    name: '喜寿',
    reading: 'きじゅ',
    kazoedoshi: 77,
    fullAge: 77,
    origin: '「喜」の草書体「㐂」が七十七に見えることから',
  },
  {
    name: '傘寿',
    reading: 'さんじゅ',
    kazoedoshi: 80,
    fullAge: 80,
    origin: '「傘」の略字「仐」が八十に見えることから',
  },
  {
    name: '半寿',
    reading: 'はんじゅ',
    kazoedoshi: 81,
    fullAge: 81,
    origin: '「半」の字を分解すると八十一になることから',
  },
  {
    name: '米寿',
    reading: 'べいじゅ',
    kazoedoshi: 88,
    fullAge: 88,
    origin: '「米」の字を分解すると八十八になることから',
  },
  {
    name: '卒寿',
    reading: 'そつじゅ',
    kazoedoshi: 90,
    fullAge: 90,
    origin: '「卒」の略字「卆」が九十に見えることから',
  },
  {
    name: '白寿',
    reading: 'はくじゅ',
    kazoedoshi: 99,
    fullAge: 99,
    origin: '「百」から「一」を取ると「白」になることから',
  },
  {
    name: '百寿',
    reading: 'ひゃくじゅ',
    kazoedoshi: 100,
    fullAge: 100,
    origin: '100 歳の祝い。紀寿（きじゅ）とも呼ぶ',
  },
  {
    name: '茶寿',
    reading: 'ちゃじゅ',
    kazoedoshi: 108,
    fullAge: 108,
    origin: '「茶」の字を分解すると十・十・八十八になり、合わせて 108 になることから',
  },
  {
    name: '皇寿',
    reading: 'こうじゅ',
    kazoedoshi: 111,
    fullAge: 111,
    origin:
      '「皇」の字を分解すると「白」（99）と「一・十・一」（12）になり、合わせて 111 になることから',
  },
  {
    name: '大還暦',
    reading: 'だいかんれき',
    kazoedoshi: 121,
    fullAge: 120,
    origin: '2 度目の還暦',
  },
] as const satisfies readonly Choju[];

export interface ChojuYears {
  readonly choju: Choju;
  /** 数え年で祝う場合の年 */
  readonly kazoedoshiYear: number;
  /** 満年齢で祝う場合の年（その年の誕生日に迎える） */
  readonly fullAgeYear: number;
}

export interface ChojuBirthYears {
  readonly choju: Choju;
  /** 数え年で祝う場合の生まれ年 */
  readonly kazoedoshiBirthYear: number;
  /** 満年齢で祝う場合の生まれ年 */
  readonly fullAgeBirthYear: number;
}

export class InvalidChojuYearError extends Error {
  constructor(message: string = '無効な年です') {
    super(message);
    this.name = 'InvalidChojuYearError';
    Object.setPrototypeOf(this, InvalidChojuYearError.prototype);
  }
}

function assertSafeYear(year: number): void {
  if (!Number.isSafeInteger(year)) {
    throw new InvalidChojuYearError(`年は安全な整数である必要があります: ${year}`);
  }
}

/**
 * 生まれ年から、長寿祝いを迎える年を求める。
 * 数え年は生まれた年を 1 歳として 1 月 1 日に加齢し、満年齢は誕生日に加齢する。
 */
export function chojuYearsForBirthYear(birthYear: number): ChojuYears[] {
  assertSafeYear(birthYear);
  return CHOJU_LIST.map((choju) => ({
    choju,
    kazoedoshiYear: birthYear + choju.kazoedoshi - 1,
    fullAgeYear: birthYear + choju.fullAge,
  }));
}

/**
 * 指定した年に長寿祝いを迎える人の生まれ年を求める。
 */
export function chojuBirthYearsInYear(year: number): ChojuBirthYears[] {
  assertSafeYear(year);
  return CHOJU_LIST.map((choju) => ({
    choju,
    kazoedoshiBirthYear: year - choju.kazoedoshi + 1,
    fullAgeBirthYear: year - choju.fullAge,
  }));
}
