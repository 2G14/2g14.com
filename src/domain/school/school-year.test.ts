import { describe, expect, it } from 'vitest';

import { createSeireki } from '../date/seireki.js';
import {
  birthDateRangesInSchoolYear,
  elementaryEntryYear,
  gradeOn,
  InvalidSchoolYearError,
  schoolTimeline,
  schoolYearOf,
} from './school-year.js';

const date = (year: number, month: number, day: number) => createSeireki({ year, month, day });

describe('schoolYearOf', () => {
  it('4 月 1 日から翌年 3 月 31 日までを同じ年度とする', () => {
    expect(schoolYearOf(date(2026, 3, 31))).toBe(2025);
    expect(schoolYearOf(date(2026, 4, 1))).toBe(2026);
    expect(schoolYearOf(date(2027, 3, 31))).toBe(2026);
  });
});

describe('elementaryEntryYear', () => {
  it('4 月 1 日生まれまでは、生まれた年の 6 年後に入学する（早生まれ）', () => {
    expect(elementaryEntryYear(date(2019, 1, 1))).toBe(2025);
    expect(elementaryEntryYear(date(2019, 4, 1))).toBe(2025);
  });

  it('4 月 2 日生まれからは、生まれた年の 7 年後に入学する', () => {
    expect(elementaryEntryYear(date(2019, 4, 2))).toBe(2026);
    expect(elementaryEntryYear(date(2019, 12, 31))).toBe(2026);
  });
});

describe('gradeOn', () => {
  const birth = date(2019, 4, 2);

  it('小学校入学の年度は小学1年生', () => {
    expect(gradeOn(birth, date(2026, 4, 1))).toEqual({
      stage: 'elementary',
      stageName: '小学校',
      grade: 1,
      label: '小学1年生',
    });
  });

  it('年度末の 3 月 31 日までは前の学年のまま', () => {
    expect(gradeOn(birth, date(2027, 3, 31))?.label).toBe('小学1年生');
    expect(gradeOn(birth, date(2027, 4, 1))?.label).toBe('小学2年生');
  });

  it('幼稚園は年少・年中・年長と数える', () => {
    expect(gradeOn(birth, date(2023, 4, 1))?.label).toBe('年少');
    expect(gradeOn(birth, date(2024, 4, 1))?.label).toBe('年中');
    expect(gradeOn(birth, date(2025, 4, 1))?.label).toBe('年長');
  });

  it('中学・高校・大学の学年を通しで数える', () => {
    expect(gradeOn(birth, date(2032, 4, 1))?.label).toBe('中学1年生');
    expect(gradeOn(birth, date(2037, 4, 1))?.label).toBe('高校3年生');
    expect(gradeOn(birth, date(2041, 4, 1))?.label).toBe('大学4年生');
  });

  it('幼稚園に入る前と大学を卒業した後は null', () => {
    expect(gradeOn(birth, date(2023, 3, 31))).toBeNull();
    expect(gradeOn(birth, date(2042, 4, 1))).toBeNull();
  });
});

describe('schoolTimeline', () => {
  it('2019 年 4 月 2 日生まれの入学・卒業の年', () => {
    expect(
      schoolTimeline(date(2019, 4, 2)).map((p) => [p.name, p.entryYear, p.graduationYear]),
    ).toEqual([
      ['幼稚園', 2023, 2026],
      ['小学校', 2026, 2032],
      ['中学校', 2032, 2035],
      ['高校', 2035, 2038],
      ['大学', 2038, 2042],
    ]);
  });
});

describe('birthDateRangesInSchoolYear', () => {
  it('年少から大学 4 年まで 19 学年を並べる', () => {
    const rows = birthDateRangesInSchoolYear(2026);

    expect(rows).toHaveLength(19);
    expect(rows[0]?.grade.label).toBe('年少');
    expect(rows.at(-1)?.grade.label).toBe('大学4年生');
  });

  it('2026 年度の小学1年生は 2019 年 4 月 2 日〜2020 年 4 月 1 日生まれ', () => {
    const row = birthDateRangesInSchoolYear(2026).find((r) => r.grade.label === '小学1年生');

    expect(row?.range).toEqual({ from: date(2019, 4, 2), to: date(2020, 4, 1) });
  });

  it('範囲の両端の生年月日は、その年度にその学年になる', () => {
    for (const { grade, range } of birthDateRangesInSchoolYear(2026)) {
      expect(gradeOn(range.from, date(2026, 4, 1))).toEqual(grade);
      expect(gradeOn(range.to, date(2026, 4, 1))).toEqual(grade);
    }
  });

  it('非整数の年度はエラーになる', () => {
    expect(() => birthDateRangesInSchoolYear(Number.NaN)).toThrow(InvalidSchoolYearError);
  });
});
