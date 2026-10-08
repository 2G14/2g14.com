import { describe, expect, it } from 'vitest';

import { createSeireki } from '../date/seireki.js';
import {
  calculateFullAge,
  calculateKazoedoshi,
  daysSinceBirth,
  InvalidBirthDateError,
  monthsSinceBirth,
  nextBirthday,
  weeksSinceBirth,
} from './age.js';

const d = (year: number, month: number, day: number) => createSeireki({ year, month, day });

describe('calculateFullAge', () => {
  it('誕生日前日は N-1 歳、当日と翌日は N 歳', () => {
    const birth = d(1990, 7, 17);
    expect(calculateFullAge(birth, d(2025, 7, 16))).toBe(34);
    expect(calculateFullAge(birth, d(2025, 7, 17))).toBe(35);
    expect(calculateFullAge(birth, d(2025, 7, 18))).toBe(35);
  });

  it('生まれた当日は 0 歳', () => {
    expect(calculateFullAge(d(2025, 7, 17), d(2025, 7, 17))).toBe(0);
  });

  it('2/29 生まれは平年 2/28 時点で未加齢、3/1 で加齢する', () => {
    const birth = d(2000, 2, 29);
    expect(calculateFullAge(birth, d(2025, 2, 28))).toBe(24);
    expect(calculateFullAge(birth, d(2025, 3, 1))).toBe(25);
  });

  it('2/29 生まれは閏年 2/29 当日に加齢する', () => {
    const birth = d(2000, 2, 29);
    expect(calculateFullAge(birth, d(2024, 2, 28))).toBe(23);
    expect(calculateFullAge(birth, d(2024, 2, 29))).toBe(24);
  });

  it('未来の生年月日はエラーになる', () => {
    expect(() => calculateFullAge(d(2025, 7, 18), d(2025, 7, 17))).toThrow(InvalidBirthDateError);
  });
});

describe('calculateKazoedoshi', () => {
  it('生まれた日は数え 1 歳', () => {
    expect(calculateKazoedoshi(d(2025, 7, 17), d(2025, 7, 17))).toBe(1);
  });

  it('年を跨ぐと 1/1 に加齢する（2024-12-31 生まれは翌日で数え 2 歳）', () => {
    const birth = d(2024, 12, 31);
    expect(calculateKazoedoshi(birth, d(2024, 12, 31))).toBe(1);
    expect(calculateKazoedoshi(birth, d(2025, 1, 1))).toBe(2);
  });
});

describe('nextBirthday', () => {
  it('誕生日当日は daysUntil = 0 で満年齢と同じ歳を返す', () => {
    const result = nextBirthday(d(1990, 7, 17), d(2025, 7, 17));
    expect(result.date).toEqual(d(2025, 7, 17));
    expect(result.daysUntil).toBe(0);
    expect(result.turningAge).toBe(35);
  });

  it('誕生日を過ぎていれば翌年の誕生日を返す', () => {
    const result = nextBirthday(d(1990, 7, 17), d(2025, 7, 18));
    expect(result.date).toEqual(d(2026, 7, 17));
    expect(result.daysUntil).toBe(364);
    expect(result.turningAge).toBe(36);
  });

  it('年末生まれの年跨ぎを扱える', () => {
    const result = nextBirthday(d(1990, 12, 31), d(2025, 1, 1));
    expect(result.date).toEqual(d(2025, 12, 31));
    expect(result.daysUntil).toBe(364);
    expect(result.turningAge).toBe(35);
  });

  it('2/29 生まれの次の誕生日は平年では 3/1 になる', () => {
    const result = nextBirthday(d(2000, 2, 29), d(2025, 1, 1));
    expect(result.date).toEqual(d(2025, 3, 1));
    expect(result.turningAge).toBe(25);
  });

  it('2/29 生まれの次の誕生日は閏年では 2/29 になる', () => {
    const result = nextBirthday(d(2000, 2, 29), d(2024, 1, 1));
    expect(result.date).toEqual(d(2024, 2, 29));
    expect(result.daysUntil).toBe(59);
  });
});

describe('daysSinceBirth / weeksSinceBirth', () => {
  it('生まれた日は生後 0 日、翌日は 1 日', () => {
    expect(daysSinceBirth(d(2025, 7, 17), d(2025, 7, 17))).toBe(0);
    expect(daysSinceBirth(d(2025, 7, 17), d(2025, 7, 18))).toBe(1);
  });

  it('閏日を跨ぐ日数を正しく数える', () => {
    expect(daysSinceBirth(d(2024, 2, 28), d(2024, 3, 1))).toBe(2);
  });

  it('週数は日数を 7 で割った切り捨て', () => {
    expect(weeksSinceBirth(d(2025, 1, 1), d(2025, 1, 14))).toBe(1);
    expect(weeksSinceBirth(d(2025, 1, 1), d(2025, 1, 15))).toBe(2);
  });
});

describe('monthsSinceBirth', () => {
  it('月末生まれの月数を暦月ベースで数える（1/31 生まれは 2/28 で 0 ヶ月、3/1 で 1 ヶ月）', () => {
    const birth = d(2025, 1, 31);
    expect(monthsSinceBirth(birth, d(2025, 2, 28))).toBe(0);
    expect(monthsSinceBirth(birth, d(2025, 3, 1))).toBe(1);
  });

  it('同日で丸 1 ヶ月・丸 1 年になる', () => {
    const birth = d(2025, 1, 15);
    expect(monthsSinceBirth(birth, d(2025, 2, 15))).toBe(1);
    expect(monthsSinceBirth(birth, d(2026, 1, 15))).toBe(12);
  });
});
