import { describe, expect, it } from 'vitest';

import { dateQueryString, dateToolUrl, parseQueryNumber } from './date-query.js';

describe('parseQueryNumber', () => {
  it('整数の文字列を数値にする', () => {
    expect(parseQueryNumber('2026')).toBe(2026);
  });

  it('クエリに無ければ null を返す', () => {
    expect(parseQueryNumber()).toBeNull();
    expect(parseQueryNumber('')).toBeNull();
  });

  it('整数として読めない値は null を返す', () => {
    expect(parseQueryNumber('abc')).toBeNull();
    expect(parseQueryNumber('7.5')).toBeNull();
  });
});

describe('dateQueryString', () => {
  it('年月日をクエリ文字列にする', () => {
    expect(dateQueryString({ year: 2026, month: 7, day: 17 })).toBe('year=2026&month=7&day=17');
  });

  it('元号があれば era を含める', () => {
    expect(dateQueryString({ era: '令和', year: 8, month: 7, day: 17 })).toBe(
      `era=${encodeURIComponent('令和')}&year=8&month=7&day=17`,
    );
  });

  it('月・日が 1 のときは省略する', () => {
    expect(dateQueryString({ year: 2026, month: 1, day: 1 })).toBe('year=2026');
  });

  it('未入力の値は省略する', () => {
    expect(dateQueryString({ year: null, month: null, day: null })).toBe('');
  });
});

describe('dateToolUrl', () => {
  it('値があればクエリ付き URL を返す', () => {
    expect(dateToolUrl('/base', { year: 2026, month: 7, day: 17 })).toBe(
      '/base?year=2026&month=7&day=17',
    );
  });

  it('値が null なら base をそのまま返す', () => {
    expect(dateToolUrl('/base', null)).toBe('/base');
  });
});
