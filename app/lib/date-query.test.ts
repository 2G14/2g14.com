import { describe, expect, it } from 'vitest';

import { dateQueryString, dateToolUrl } from './date-query.js';

describe('dateQueryString', () => {
  it('年月日をクエリ文字列にする', () => {
    expect(dateQueryString({ year: '2026', month: '7', day: '17' })).toBe(
      'year=2026&month=7&day=17',
    );
  });

  it('元号があれば era を含める', () => {
    expect(dateQueryString({ era: '令和', year: '8', month: '7', day: '17' })).toBe(
      `era=${encodeURIComponent('令和')}&year=8&month=7&day=17`,
    );
  });

  it('月・日が 1 のときは省略する', () => {
    expect(dateQueryString({ year: '2026', month: '1', day: '1' })).toBe('year=2026');
  });

  it('空の値は省略する', () => {
    expect(dateQueryString({ year: '', month: '', day: '' })).toBe('');
  });
});

describe('dateToolUrl', () => {
  it('値があればクエリ付き URL を返す', () => {
    expect(dateToolUrl('/base', { year: '2026', month: '7', day: '17' })).toBe(
      '/base?year=2026&month=7&day=17',
    );
  });

  it('値が null なら base をそのまま返す', () => {
    expect(dateToolUrl('/base', null)).toBe('/base');
  });
});
