import { describe, expect, it } from 'vitest';

import { parseDateInput, parseSeirekiInput } from './date-input.js';

describe('parseDateInput', () => {
  it('年月日をそのまま日付として返す', () => {
    expect(parseDateInput(2026, 7, 17)).toEqual({
      kind: 'ok',
      date: { year: 2026, month: 7, day: 17 },
    });
  });

  it('年が未入力なら empty を返す', () => {
    expect(parseDateInput(null, 7, 17)).toEqual({ kind: 'empty' });
  });

  it('整数でない値が含まれる場合はエラーを返す', () => {
    expect(parseDateInput(2026, 7.5, 17)).toEqual({
      kind: 'error',
      message: '年・月・日は整数で入力してください。',
    });
  });

  it('月・日が未入力の場合もエラーを返す', () => {
    expect(parseDateInput(2026, null, 17)).toEqual({
      kind: 'error',
      message: '年・月・日は整数で入力してください。',
    });
  });
});

describe('parseSeirekiInput', () => {
  it('実在する日付を西暦の日付として返す', () => {
    expect(parseSeirekiInput(2026, 7, 17)).toMatchObject({
      kind: 'ok',
      seireki: { year: 2026, month: 7, day: 17 },
    });
  });

  it('年が未入力なら empty を返す', () => {
    expect(parseSeirekiInput(null, null, null)).toEqual({ kind: 'empty' });
  });

  it('1 年より前や存在しない日付はエラーを返す', () => {
    expect(parseSeirekiInput(0, 1, 1)).toMatchObject({ kind: 'error' });
    expect(parseSeirekiInput(2026, 2, 30)).toMatchObject({ kind: 'error' });
  });
});
