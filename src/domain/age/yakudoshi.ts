export type Sex = 'male' | 'female';

export type YakuKind = 'maeyaku' | 'honyaku' | 'atoyaku';

export const YAKU_KIND_LABELS = {
  maeyaku: '前厄',
  honyaku: '本厄',
  atoyaku: '後厄',
} as const satisfies Record<YakuKind, string>;

/** 本厄の数え年。寺社によって異なるため、広く採られている年齢に揃える */
const HONYAKU_AGES = {
  male: [25, 42, 61],
  female: [19, 33, 37, 61],
} as const satisfies Record<Sex, readonly number[]>;

const TAIYAKU_AGES = { male: 42, female: 33 } as const satisfies Record<Sex, number>;

interface Yaku {
  readonly kind: YakuKind;
  readonly kazoedoshi: number;
  readonly year: number;
  readonly birthYear: number;
}

export interface YakudoshiPeriod {
  /** 本厄の数え年 */
  readonly honyakuAge: number;
  /** 大厄（男性 42 歳・女性 33 歳） */
  readonly taiyaku: boolean;
  /** 前厄・本厄・後厄の順 */
  readonly yakus: readonly [Yaku, Yaku, Yaku];
}

export class InvalidYakudoshiYearError extends Error {
  constructor(message: string = '無効な年です') {
    super(message);
    this.name = 'InvalidYakudoshiYearError';
    Object.setPrototypeOf(this, InvalidYakudoshiYearError.prototype);
  }
}

function assertSafeYear(year: number): void {
  if (!Number.isSafeInteger(year)) {
    throw new InvalidYakudoshiYearError(`年は安全な整数である必要があります: ${year}`);
  }
}

type BirthYearOf = (kazoedoshi: number) => number;

// 数え年は生まれた年を 1 歳として 1 月 1 日に加齢するので、年齢と年の対応は誕生日によらない
function yakuOf(kind: YakuKind, kazoedoshi: number, birthYearOf: BirthYearOf): Yaku {
  const birthYear = birthYearOf(kazoedoshi);
  return { kind, kazoedoshi, birthYear, year: birthYear + kazoedoshi - 1 };
}

function periodsFor(sex: Sex, birthYearOf: BirthYearOf): YakudoshiPeriod[] {
  return HONYAKU_AGES[sex].map((honyakuAge) => ({
    honyakuAge,
    taiyaku: honyakuAge === TAIYAKU_AGES[sex],
    yakus: [
      yakuOf('maeyaku', honyakuAge - 1, birthYearOf),
      yakuOf('honyaku', honyakuAge, birthYearOf),
      yakuOf('atoyaku', honyakuAge + 1, birthYearOf),
    ],
  }));
}

/**
 * 生まれ年から、その人の厄年（前厄・本厄・後厄）を求める。
 */
export function yakudoshiForBirthYear(birthYear: number, sex: Sex): YakudoshiPeriod[] {
  assertSafeYear(birthYear);
  return periodsFor(sex, () => birthYear);
}

/**
 * 指定した年に厄年を迎える人の生まれ年を求める。
 */
export function yakudoshiInYear(year: number, sex: Sex): YakudoshiPeriod[] {
  assertSafeYear(year);
  return periodsFor(sex, (kazoedoshi) => year - kazoedoshi + 1);
}
