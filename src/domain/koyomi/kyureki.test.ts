import { describe, expect, it } from 'vitest';

import { fromDayNumber, toDayNumber } from '../date/day-count.js';
import { createSeireki } from '../date/seireki.js';
import { toKyureki, toKyurekiDays } from './kyureki.js';
import { OutOfKoyomiRangeError } from './range.js';

const kyureki = (year: number, month: number, day: number) => {
  const k = toKyureki(createSeireki({ year, month, day }));
  return { year: k.year, month: k.month, day: k.day, leap: k.leap };
};

describe('toKyureki', () => {
  it('朔（新月）の日を 1 日とする', () => {
    // 国立天文台 暦要項 2026 年の朔: 10 月 11 日 0 時 50 分
    expect(kyureki(2026, 10, 10)).toEqual({ year: 2026, month: 8, day: 30, leap: false });
    expect(kyureki(2026, 10, 11)).toEqual({ year: 2026, month: 9, day: 1, leap: false });
    expect(kyureki(2026, 10, 12)).toEqual({ year: 2026, month: 9, day: 2, leap: false });
  });

  it('旧正月（1 月 1 日）', () => {
    expect(kyureki(2024, 2, 10)).toEqual({ year: 2024, month: 1, day: 1, leap: false });
    expect(kyureki(2025, 1, 29)).toEqual({ year: 2025, month: 1, day: 1, leap: false });
    expect(kyureki(2026, 2, 17)).toEqual({ year: 2026, month: 1, day: 1, leap: false });
  });

  it('朔が日本時間で日付をまたぐと、中国の春節と旧正月が 1 日ずれる', () => {
    // 2027 年 2 月の朔は世界時 6 日 16 時ごろで、北京時間では 6 日、日本時間では 7 日になる
    expect(kyureki(2027, 2, 6)).toMatchObject({ year: 2026, month: 12 });
    expect(kyureki(2027, 2, 7)).toEqual({ year: 2027, month: 1, day: 1, leap: false });
  });

  it('旧正月の前日は前の年の 12 月', () => {
    expect(kyureki(2026, 2, 16)).toMatchObject({ year: 2025, month: 12, leap: false });
  });

  it('中気を含まない月を閏月にする', () => {
    expect(kyureki(2023, 3, 22)).toEqual({ year: 2023, month: 2, day: 1, leap: true });
    expect(kyureki(2023, 4, 20)).toEqual({ year: 2023, month: 3, day: 1, leap: false });
    expect(kyureki(2025, 7, 25)).toEqual({ year: 2025, month: 6, day: 1, leap: true });
  });

  it('2033 年は閏 11 月を置く（2033 年問題）', () => {
    expect(kyureki(2033, 12, 22)).toEqual({ year: 2033, month: 11, day: 1, leap: true });
    expect(kyureki(2034, 1, 20)).toMatchObject({ year: 2033, month: 12, day: 1, leap: false });
  });

  it('対応範囲（1901〜2100 年）外の日付はエラーになる', () => {
    expect(() => kyureki(1900, 12, 31)).toThrow(OutOfKoyomiRangeError);
    expect(() => kyureki(2101, 1, 1)).toThrow(OutOfKoyomiRangeError);
  });
});

describe('toKyurekiDays', () => {
  it('1 日ずつ toKyureki で求めた日付と一致する', () => {
    // 閏月の始まり（2025-07-25）と年の替わり目をまたぐ範囲で比べる
    for (const from of [
      createSeireki({ year: 2025, month: 7, day: 1 }),
      createSeireki({ year: 2026, month: 1, day: 20 }),
    ]) {
      const days = toKyurekiDays(from, 62);
      days.forEach((day, i) => {
        const date = createSeireki({ year: from.year, month: from.month, day: from.day });
        const expected = toKyureki(fromDayNumber(toDayNumber(date) + i));
        expect(day).toEqual(expected);
      });
    }
  });
});
