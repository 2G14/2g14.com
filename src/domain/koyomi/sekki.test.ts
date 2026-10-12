import { describe, expect, it } from 'vitest';

import { OutOfKoyomiRangeError } from './range.js';
import { sekkiOfMonth, sekkiOfYear } from './sekki.js';

describe('sekkiOfYear', () => {
  it('2026 年の二十四節気の日付が国立天文台の暦要項と一致する', () => {
    // 国立天文台 暦要項 2026 年「二十四節気および雑節」
    const expected = [
      ['小寒', 1, 5],
      ['大寒', 1, 20],
      ['立春', 2, 4],
      ['雨水', 2, 19],
      ['啓蟄', 3, 5],
      ['春分', 3, 20],
      ['清明', 4, 5],
      ['穀雨', 4, 20],
      ['立夏', 5, 5],
      ['小満', 5, 21],
      ['芒種', 6, 6],
      ['夏至', 6, 21],
      ['小暑', 7, 7],
      ['大暑', 7, 23],
      ['立秋', 8, 7],
      ['処暑', 8, 23],
      ['白露', 9, 7],
      ['秋分', 9, 23],
      ['寒露', 10, 8],
      ['霜降', 10, 23],
      ['立冬', 11, 7],
      ['小雪', 11, 22],
      ['大雪', 12, 7],
      ['冬至', 12, 22],
    ];

    expect(sekkiOfYear(2026).map((s) => [s.sekki.name, s.date.month, s.date.day])).toEqual(
      expected,
    );
  });

  it('春分・秋分の日は年によって日付が動く', () => {
    const shunbun = (year: number) => sekkiOfYear(year).find((s) => s.sekki.name === '春分')?.date;
    const shubun = (year: number) => sekkiOfYear(year).find((s) => s.sekki.name === '秋分')?.date;

    expect(shunbun(2024)).toMatchObject({ month: 3, day: 20 });
    expect(shubun(2024)).toMatchObject({ month: 9, day: 22 });
    expect(shubun(2025)).toMatchObject({ month: 9, day: 23 });
  });

  it('対応範囲（1901〜2100 年）外の年はエラーになる', () => {
    expect(() => sekkiOfYear(1900)).toThrow(OutOfKoyomiRangeError);
    expect(() => sekkiOfYear(2101)).toThrow(OutOfKoyomiRangeError);
  });
});

describe('sekkiOfMonth', () => {
  it('その月の節と中気を返し、1 年分を求めた結果と一致する', () => {
    const year = sekkiOfYear(2026);

    for (let month = 1; month <= 12; month++) {
      const days = sekkiOfMonth(2026, month);
      expect(days).toEqual(year.slice((month - 1) * 2, month * 2));
      expect(days.every((d) => d.date.month === month)).toBe(true);
    }
  });

  it('対応範囲（1901〜2100 年）外の年はエラーになる', () => {
    expect(() => sekkiOfMonth(1900, 1)).toThrow(OutOfKoyomiRangeError);
  });
});
