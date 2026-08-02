import { describe, expect, it } from 'vitest';

import { parseDateInput } from './date-input.js';

describe('parseDateInput', () => {
  it('年月日の文字列を数値として返す', () => {
    expect(parseDateInput('2026', '7', '17')).toEqual({ year: 2026, month: 7, day: 17 });
  });

  it('年が空文字列なら null を返す', () => {
    expect(parseDateInput('', '7', '17')).toBeNull();
  });

  it('整数でない値が含まれる場合はエラーを返す', () => {
    expect(parseDateInput('2026', '7.5', '17')).toEqual({
      error: '年・月・日は整数で入力してください。',
    });
    expect(parseDateInput('abc', '7', '17')).toEqual({
      error: '年・月・日は整数で入力してください。',
    });
  });
});
