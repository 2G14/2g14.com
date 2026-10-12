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

  it('どちらかが未入力、または入力の途中なら empty を返す', () => {
    expect(calculateDaysBetween(v(2026, 10, 12), v(null, null, null))).toEqual({ kind: 'empty' });
    expect(calculateDaysBetween(v(2026, 10, 12), v(2026, null, null))).toEqual({ kind: 'empty' });
    expect(calculateDaysBetween(v(2026, null, 12), v(2026, 12, 25))).toEqual({ kind: 'empty' });
  });

  it('1〜9999 年の範囲外の年はどちらの日付かを添えてエラーを返す', () => {
    expect(calculateDaysBetween(v(1e308, 1, 1), v(1e308, 1, 2))).toMatchObject({
      kind: 'error',
      message: expect.stringMatching(/^開始日: 年は 1〜9999/u),
    });
    expect(calculateDaysBetween(v(2026, 1, 1), v(10000, 1, 1))).toMatchObject({
      kind: 'error',
      message: expect.stringMatching(/^終了日: 年は 1〜9999/u),
    });
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

  it('基準日が 1〜9999 年の範囲外なら、基準日のエラーを返す', () => {
    expect(calculateDateAfter(v(10000, 1, 1), -1)).toMatchObject({
      kind: 'error',
      message: expect.stringMatching(/^基準日: 年は 1〜9999/u),
    });
  });

  it('基準日が入力の途中なら empty を返す', () => {
    expect(calculateDateAfter(v(2026, null, null), 100)).toEqual({ kind: 'empty' });
  });

  it('結果が 1〜9999 年を超えるとエラーを返す', () => {
    expect(calculateDateAfter(v(9999, 12, 31), 1)).toMatchObject({ kind: 'error' });
    expect(calculateDateAfter(v(1, 1, 1), -1)).toMatchObject({ kind: 'error' });
  });

  it('範囲を大きく超える日数も、例外にせずエラーを返す', () => {
    expect(calculateDateAfter(v(2026, 10, 12), 1.7e23)).toMatchObject({ kind: 'error' });
    expect(calculateDateAfter(v(2026, 10, 12), -1.7e23)).toMatchObject({ kind: 'error' });
  });

  it('範囲の端の日付ちょうどまでは計算できる', () => {
    expect(calculateDateAfter(v(9999, 12, 30), 1)).toMatchObject({
      kind: 'ok',
      date: { year: 9999, month: 12, day: 31 },
    });
    expect(calculateDateAfter(v(1, 1, 2), -1)).toMatchObject({
      kind: 'ok',
      date: { year: 1, month: 1, day: 1 },
    });
  });
});
