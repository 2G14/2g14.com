import { describe, expect, it } from 'vitest';

import { parseKoyomiYear, parseMonth, shiftMonth, shiftYear } from './koyomi-query.js';

describe('parseKoyomiYear', () => {
  it('対応範囲（1901〜2100）の年はそのまま返す', () => {
    expect(parseKoyomiYear('1901', 2026)).toBe(1901);
    expect(parseKoyomiYear('2100', 2026)).toBe(2100);
  });

  it('未指定・範囲外・読めない値は fallback を返す', () => {
    expect(parseKoyomiYear(undefined, 2026)).toBe(2026);
    expect(parseKoyomiYear('1900', 2026)).toBe(2026);
    expect(parseKoyomiYear('abc', 2026)).toBe(2026);
  });
});

describe('parseMonth', () => {
  it('1〜12 の月はそのまま返し、それ以外は fallback を返す', () => {
    expect(parseMonth('12', 10)).toBe(12);
    expect(parseMonth('13', 10)).toBe(10);
    expect(parseMonth(undefined, 10)).toBe(10);
  });
});

describe('shiftMonth', () => {
  it('年をまたいで前後の月に移る', () => {
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
  });

  it('対応範囲を出るなら null', () => {
    expect(shiftMonth({ year: 1901, month: 1 }, -1)).toBeNull();
    expect(shiftMonth({ year: 2100, month: 12 }, 1)).toBeNull();
  });
});

describe('shiftYear', () => {
  it('前後の年に移り、対応範囲を出るなら null', () => {
    expect(shiftYear(2026, 1)).toBe(2027);
    expect(shiftYear(1901, -1)).toBeNull();
    expect(shiftYear(2100, 1)).toBeNull();
  });
});
