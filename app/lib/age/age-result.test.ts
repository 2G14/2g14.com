import { describe, expect, it } from 'vitest';

import { createSeireki } from '#src/domain/date/seireki.js';

import { calculateAgeResult } from './age-result.js';

const TODAY = createSeireki({ year: 2026, month: 10, day: 6 });

describe('calculateAgeResult', () => {
  it('生年月日から年齢・和暦・干支をまとめて返す', () => {
    const result = calculateAgeResult(1990, 5, 1, TODAY);

    expect(result).toMatchObject({
      kind: 'ok',
      fullAge: 36,
      kazoedoshi: 37,
      japaneseCalendar: {
        wareki: { era: '平成', year: 2, month: 5, day: 1 },
        eto: { kanji: '庚午' },
      },
    });
  });

  it('年が未入力なら empty を返す', () => {
    expect(calculateAgeResult(null, null, null, TODAY)).toEqual({ kind: 'empty' });
  });

  it('月や日が欠けていればエラーを返す', () => {
    expect(calculateAgeResult(1990, null, 1, TODAY)).toMatchObject({ kind: 'error' });
  });

  it('存在しない日付はエラーを返す', () => {
    expect(calculateAgeResult(1990, 2, 30, TODAY)).toMatchObject({ kind: 'error' });
  });

  it('未来の生年月日はエラーを返す', () => {
    expect(calculateAgeResult(2026, 10, 7, TODAY)).toMatchObject({ kind: 'error' });
  });

  it('日本でグレゴリオ暦が施行された 1873-01-01 より前も年齢は計算し、和暦と干支は出さない', () => {
    expect(calculateAgeResult(1872, 12, 31, TODAY)).toMatchObject({
      kind: 'ok',
      fullAge: 153,
      japaneseCalendar: null,
    });
    expect(calculateAgeResult(1873, 1, 1, TODAY)).toMatchObject({
      kind: 'ok',
      japaneseCalendar: { wareki: { era: '明治', year: 6 } },
    });
  });

  it('1582 年より前もグレゴリオ暦をさかのぼって計算する', () => {
    expect(calculateAgeResult(1, 1, 1, TODAY)).toMatchObject({ kind: 'ok', fullAge: 2025 });
  });
});
