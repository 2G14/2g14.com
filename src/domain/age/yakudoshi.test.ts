import { describe, expect, it } from 'vitest';

import { InvalidYakudoshiYearError, yakudoshiForBirthYear, yakudoshiInYear } from './yakudoshi.js';

describe('yakudoshiForBirthYear', () => {
  it('男性の本厄は数え年 25・42・61 歳で、42 歳が大厄', () => {
    const periods = yakudoshiForBirthYear(1985, 'male');

    expect(periods.map((p) => [p.honyakuAge, p.taiyaku])).toEqual([
      [25, false],
      [42, true],
      [61, false],
    ]);
  });

  it('女性の本厄は数え年 19・33・37・61 歳で、33 歳が大厄', () => {
    const periods = yakudoshiForBirthYear(1985, 'female');

    expect(periods.map((p) => [p.honyakuAge, p.taiyaku])).toEqual([
      [19, false],
      [33, true],
      [37, false],
      [61, false],
    ]);
  });

  it('前厄・本厄・後厄は数え年で本厄の前後 1 年', () => {
    const [, taiyaku] = yakudoshiForBirthYear(1985, 'male');

    expect(taiyaku?.yakus).toEqual([
      { kind: 'maeyaku', kazoedoshi: 41, birthYear: 1985, year: 2025 },
      { kind: 'honyaku', kazoedoshi: 42, birthYear: 1985, year: 2026 },
      { kind: 'atoyaku', kazoedoshi: 43, birthYear: 1985, year: 2027 },
    ]);
  });

  it('非整数の年はエラーになる', () => {
    expect(() => yakudoshiForBirthYear(1985.5, 'male')).toThrow(InvalidYakudoshiYearError);
    expect(() => yakudoshiForBirthYear(Number.NaN, 'female')).toThrow(InvalidYakudoshiYearError);
  });
});

describe('yakudoshiInYear', () => {
  it('2026 年に男性の大厄（数え 42 歳）を迎えるのは 1985 年生まれ', () => {
    const [, taiyaku] = yakudoshiInYear(2026, 'male');

    expect(taiyaku?.yakus.map((y) => [y.kind, y.birthYear, y.year])).toEqual([
      ['maeyaku', 1986, 2026],
      ['honyaku', 1985, 2026],
      ['atoyaku', 1984, 2026],
    ]);
  });

  it('2026 年に女性の大厄（数え 33 歳）を迎えるのは 1994 年生まれ', () => {
    const [, taiyaku] = yakudoshiInYear(2026, 'female');

    expect(taiyaku?.yakus[1]).toEqual({
      kind: 'honyaku',
      kazoedoshi: 33,
      birthYear: 1994,
      year: 2026,
    });
  });

  it('生まれ年から求めた厄年と、その年の厄年の生まれ年が一致する', () => {
    for (const period of yakudoshiForBirthYear(1990, 'female')) {
      for (const yaku of period.yakus) {
        const inYear = yakudoshiInYear(yaku.year, 'female').flatMap((p) => p.yakus);
        expect(inYear).toContainEqual(yaku);
      }
    }
  });

  it('非整数の年はエラーになる', () => {
    expect(() => yakudoshiInYear(1e21, 'male')).toThrow(InvalidYakudoshiYearError);
  });
});
