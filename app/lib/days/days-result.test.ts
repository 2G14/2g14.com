import { describe, expect, it } from 'vitest';

import { calculateDateAfter, calculateDaysBetween } from './days-result.js';

const v = (year: number | null, month: number | null, day: number | null) => ({ year, month, day });

describe('calculateDaysBetween', () => {
  it('開始日から終了日までの日数を返す', () => {
    expect(calculateDaysBetween(v(2026, 10, 12), v(2026, 12, 25))).toMatchObject({
      kind: 'ok',
      days: 74,
    });
  });

  it('終了日が開始日より前なら負の日数を返す', () => {
    expect(calculateDaysBetween(v(2026, 10, 12), v(2026, 10, 1))).toMatchObject({
      kind: 'ok',
      days: -11,
    });
  });

  it('どちらかが未入力なら empty を返す', () => {
    expect(calculateDaysBetween(v(2026, 10, 12), v(null, null, null))).toEqual({ kind: 'empty' });
  });

  it('不正な日付はどちらの日付かを添えてエラーを返す', () => {
    expect(calculateDaysBetween(v(2026, 2, 30), v(2026, 3, 1))).toMatchObject({
      kind: 'error',
      message: expect.stringMatching(/^開始日: /u),
    });
    expect(calculateDaysBetween(v(2026, 3, 1), v(2026, 13, 1))).toMatchObject({
      kind: 'error',
      message: expect.stringMatching(/^終了日: /u),
    });
  });
});

describe('calculateDateAfter', () => {
  it('基準日から指定した日数後の日付を返す', () => {
    expect(calculateDateAfter(v(2026, 10, 12), 100)).toMatchObject({
      kind: 'ok',
      date: { year: 2027, month: 1, day: 20 },
    });
  });

  it('負の日数なら前の日付を返す', () => {
    expect(calculateDateAfter(v(2026, 10, 12), -100)).toMatchObject({
      kind: 'ok',
      date: { year: 2026, month: 7, day: 4 },
    });
  });

  it('日数が未入力なら empty、整数でなければエラーを返す', () => {
    expect(calculateDateAfter(v(2026, 10, 12), null)).toEqual({ kind: 'empty' });
    expect(calculateDateAfter(v(2026, 10, 12), 1.5)).toMatchObject({ kind: 'error' });
  });

  it('結果が 1〜9999 年を超えるとエラーを返す', () => {
    expect(calculateDateAfter(v(9999, 12, 31), 1)).toMatchObject({ kind: 'error' });
    expect(calculateDateAfter(v(1, 1, 1), -1)).toMatchObject({ kind: 'error' });
  });
});
