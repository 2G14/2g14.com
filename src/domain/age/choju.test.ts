import { describe, expect, it } from 'vitest';

import {
  chojuBirthYearsInYear,
  chojuYearsForBirthYear,
  CHOJU_LIST,
  InvalidChojuYearError,
} from './choju.js';

describe('CHOJU_LIST', () => {
  it('還暦から大還暦まで年齢の若い順に並ぶ', () => {
    expect(CHOJU_LIST.map((c) => c.name)).toEqual([
      '還暦',
      '緑寿',
      '古希',
      '喜寿',
      '傘寿',
      '半寿',
      '米寿',
      '卒寿',
      '白寿',
      '百寿',
      '茶寿',
      '皇寿',
      '大還暦',
    ]);
  });

  it('還暦と大還暦は干支の一巡に合わせて満年齢が数え年より 1 歳若い', () => {
    const kanreki = CHOJU_LIST.find((c) => c.name === '還暦');
    const daikanreki = CHOJU_LIST.find((c) => c.name === '大還暦');

    expect(kanreki).toMatchObject({ kazoedoshi: 61, fullAge: 60 });
    expect(daikanreki).toMatchObject({ kazoedoshi: 121, fullAge: 120 });
  });
});

describe('chojuYearsForBirthYear', () => {
  it('1966 年生まれの還暦は数え年でも満年齢でも 2026 年', () => {
    const [kanreki] = chojuYearsForBirthYear(1966);

    expect(kanreki).toMatchObject({ kazoedoshiYear: 2026, fullAgeYear: 2026 });
  });

  it('1950 年生まれの喜寿は数え年なら 2026 年、満年齢なら 2027 年', () => {
    const kiju = chojuYearsForBirthYear(1950).find((y) => y.choju.name === '喜寿');

    expect(kiju).toMatchObject({ kazoedoshiYear: 2026, fullAgeYear: 2027 });
  });

  it('非整数の年はエラーになる', () => {
    expect(() => chojuYearsForBirthYear(1950.5)).toThrow(InvalidChojuYearError);
  });
});

describe('chojuBirthYearsInYear', () => {
  it('2026 年に米寿を迎えるのは、数え年なら 1939 年生まれ、満年齢なら 1938 年生まれ', () => {
    const beiju = chojuBirthYearsInYear(2026).find((y) => y.choju.name === '米寿');

    expect(beiju).toMatchObject({ kazoedoshiBirthYear: 1939, fullAgeBirthYear: 1938 });
  });

  it('生まれ年から求めた年と、その年の生まれ年が一致する', () => {
    const birthYear = 1945;
    const inYears = chojuYearsForBirthYear(birthYear);

    for (const { choju, kazoedoshiYear, fullAgeYear } of inYears) {
      const byKazoe = chojuBirthYearsInYear(kazoedoshiYear).find((y) => y.choju === choju);
      const byFull = chojuBirthYearsInYear(fullAgeYear).find((y) => y.choju === choju);
      expect(byKazoe?.kazoedoshiBirthYear).toBe(birthYear);
      expect(byFull?.fullAgeBirthYear).toBe(birthYear);
    }
  });

  it('非整数の年はエラーになる', () => {
    expect(() => chojuBirthYearsInYear(Number.NaN)).toThrow(InvalidChojuYearError);
  });
});
