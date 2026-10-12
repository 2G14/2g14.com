import { describe, expect, it } from 'vitest';

import { createSeireki } from '#src/domain/date/seireki.js';

import { calculateSchoolYearResult } from './school-year-result.js';

const TODAY = createSeireki({ year: 2026, month: 10, day: 12 });

describe('calculateSchoolYearResult', () => {
  it('生年月日から今日の学年と入学・卒業の年を返す', () => {
    const result = calculateSchoolYearResult(2019, 4, 2, TODAY);

    expect(result).toMatchObject({ kind: 'ok', grade: { label: '小学1年生' } });
    expect(result.kind === 'ok' && result.timeline[1]).toMatchObject({
      name: '小学校',
      entryYear: 2026,
      graduationYear: 2032,
    });
  });

  it('在学期間の外なら学年は null', () => {
    expect(calculateSchoolYearResult(1990, 1, 1, TODAY)).toMatchObject({
      kind: 'ok',
      grade: null,
    });
  });

  it('年が未入力なら empty を返す', () => {
    expect(calculateSchoolYearResult(null, null, null, TODAY)).toEqual({ kind: 'empty' });
  });

  it('1 年より前や存在しない日付はエラーを返す', () => {
    expect(calculateSchoolYearResult(0, 1, 1, TODAY)).toMatchObject({ kind: 'error' });
    expect(calculateSchoolYearResult(2019, 2, 30, TODAY)).toMatchObject({ kind: 'error' });
  });
});
