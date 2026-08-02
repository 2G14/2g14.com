import { describe, expect, it } from 'vitest';

import { etoFromYear, InvalidEtoYearError, JUNISHI, yearsForJunishi } from './eto.js';

describe('etoFromYear', () => {
  it('1984 年は甲子（きのえね）で 60 干支の 1 番', () => {
    const eto = etoFromYear(1984);
    expect(eto.kanji).toBe('甲子');
    expect(eto.reading).toBe('きのえね');
    expect(eto.kanshiNumber).toBe(1);
  });

  it('2025 年は乙巳（きのとみ）で 42 番、十二支は巳（み・へび）', () => {
    const eto = etoFromYear(2025);
    expect(eto.kanji).toBe('乙巳');
    expect(eto.reading).toBe('きのとみ');
    expect(eto.kanshiNumber).toBe(42);
    expect(eto.junishi.kanji).toBe('巳');
    expect(eto.junishi.kana).toBe('み');
    expect(eto.junishi.animal).toBe('へび');
  });

  it('2026 年は丙午（ひのえうま）で 43 番', () => {
    const eto = etoFromYear(2026);
    expect(eto.kanji).toBe('丙午');
    expect(eto.reading).toBe('ひのえうま');
    expect(eto.kanshiNumber).toBe(43);
  });

  it('60 年周期で同じ干支になる', () => {
    expect(etoFromYear(1924).kanji).toBe(etoFromYear(1984).kanji);
    expect(etoFromYear(2044).kanji).toBe(etoFromYear(1984).kanji);
  });

  it('西暦 4 年が甲子 1 番、西暦 3 年が癸亥 60 番', () => {
    expect(etoFromYear(4).kanji).toBe('甲子');
    expect(etoFromYear(4).kanshiNumber).toBe(1);
    expect(etoFromYear(3).kanji).toBe('癸亥');
    expect(etoFromYear(3).kanshiNumber).toBe(60);
  });

  it('0 年以下でも 60 干支の範囲に収まる', () => {
    expect(etoFromYear(0).kanshiNumber).toBeGreaterThanOrEqual(1);
    expect(etoFromYear(0).kanshiNumber).toBeLessThanOrEqual(60);
    expect(etoFromYear(-56).kanji).toBe(etoFromYear(4).kanji);
  });

  it('非整数はエラーになる', () => {
    expect(() => etoFromYear(2025.5)).toThrow(InvalidEtoYearError);
    expect(() => etoFromYear(Number.NaN)).toThrow(InvalidEtoYearError);
  });
});

describe('yearsForJunishi', () => {
  it('巳年を新しい順に列挙する', () => {
    const miIndex = JUNISHI.findIndex((j) => j.kanji === '巳');
    expect(yearsForJunishi(miIndex, 2000, 2026)).toEqual([2025, 2013, 2001]);
  });

  it('範囲外の十二支番号はエラーになる', () => {
    expect(() => yearsForJunishi(-1, 2000, 2026)).toThrow(InvalidEtoYearError);
    expect(() => yearsForJunishi(12, 2000, 2026)).toThrow(InvalidEtoYearError);
  });
});
