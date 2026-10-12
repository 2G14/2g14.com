import { describe, expect, it } from 'vitest';

import { addDays, dayOfWeek, diffDays, fromDayNumber, toDayNumber } from './day-count.js';
import { createSeireki } from './seireki.js';

const d = (year: number, month: number, day: number) => createSeireki({ year, month, day });

describe('toDayNumber', () => {
  it('エポック 1970-01-01 は 0', () => {
    expect(toDayNumber(d(1970, 1, 1))).toBe(0);
  });

  it('エポック翌日は 1、前日は -1', () => {
    expect(toDayNumber(d(1970, 1, 2))).toBe(1);
    expect(toDayNumber(d(1969, 12, 31))).toBe(-1);
  });
});

describe('diffDays', () => {
  it('同日は 0、翌日は 1', () => {
    expect(diffDays(d(2025, 7, 17), d(2025, 7, 17))).toBe(0);
    expect(diffDays(d(2025, 7, 17), d(2025, 7, 18))).toBe(1);
  });

  it('閏年は 2/28 から 3/1 まで 2 日、平年は 1 日', () => {
    expect(diffDays(d(2024, 2, 28), d(2024, 3, 1))).toBe(2);
    expect(diffDays(d(2023, 2, 28), d(2023, 3, 1))).toBe(1);
  });

  it('1900 年は 100 年例外で平年、2000 年は 400 年例外で閏年', () => {
    expect(diffDays(d(1900, 2, 28), d(1900, 3, 1))).toBe(1);
    expect(diffDays(d(2000, 2, 28), d(2000, 3, 1))).toBe(2);
  });

  it('長期間の既知値: 2000-01-01 から 2024-01-01 は 8766 日', () => {
    expect(diffDays(d(2000, 1, 1), d(2024, 1, 1))).toBe(8766);
  });

  it('逆方向は負数になる', () => {
    expect(diffDays(d(2025, 1, 2), d(2025, 1, 1))).toBe(-1);
  });
});

describe('dayOfWeek', () => {
  it('曜日を 0(日)〜6(土) で返す', () => {
    expect(dayOfWeek(d(1970, 1, 1))).toBe(4);
    expect(dayOfWeek(d(2026, 10, 7))).toBe(3);
  });

  it('エポックより前や 100 年未満の年でも求まる', () => {
    expect(dayOfWeek(d(1969, 12, 28))).toBe(0);
    expect(dayOfWeek(d(1, 1, 1))).toBe(1);
  });
});

describe('fromDayNumber', () => {
  it('0 は 1970-01-01、-1 は 1969-12-31', () => {
    expect(fromDayNumber(0)).toEqual(d(1970, 1, 1));
    expect(fromDayNumber(-1)).toEqual(d(1969, 12, 31));
  });

  it('toDayNumber の逆変換になる', () => {
    for (const date of [
      d(1, 1, 1),
      d(1600, 2, 29),
      d(1900, 3, 1),
      d(2000, 2, 29),
      d(9999, 12, 31),
    ]) {
      expect(fromDayNumber(toDayNumber(date))).toEqual(date);
    }
  });
});

describe('addDays', () => {
  it('月末・年末をまたいで日を進める', () => {
    expect(addDays(d(2026, 1, 31), 1)).toEqual(d(2026, 2, 1));
    expect(addDays(d(2026, 12, 31), 1)).toEqual(d(2027, 1, 1));
  });

  it('閏年の 2 月 29 日を数える', () => {
    expect(addDays(d(2024, 2, 28), 1)).toEqual(d(2024, 2, 29));
    expect(addDays(d(2023, 2, 28), 1)).toEqual(d(2023, 3, 1));
  });

  it('負の日数で日をさかのぼる', () => {
    expect(addDays(d(2026, 3, 1), -1)).toEqual(d(2026, 2, 28));
    expect(addDays(d(2026, 10, 12), -100)).toEqual(d(2026, 7, 4));
  });
});
