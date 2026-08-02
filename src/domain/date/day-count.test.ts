import { describe, expect, it } from 'vitest';

import { diffDays, toDayNumber } from './day-count.js';
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
