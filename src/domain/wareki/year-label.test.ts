import { describe, expect, it } from 'vitest';

import { warekiYearLabel } from './year-label.js';

describe('warekiYearLabel', () => {
  it('単一元号の年はその元号だけを返す', () => {
    expect(warekiYearLabel(2025)).toBe('令和7年');
    expect(warekiYearLabel(1990)).toBe('平成2年');
  });

  it('年の途中で改元した年は両方の元号を併記する', () => {
    expect(warekiYearLabel(1989)).toBe('昭和64年 / 平成元年');
    expect(warekiYearLabel(2019)).toBe('平成31年 / 令和元年');
    expect(warekiYearLabel(1912)).toBe('明治45年 / 大正元年');
  });

  it('明治が始まった 1868 年は明治元年のみを返す', () => {
    expect(warekiYearLabel(1868)).toBe('明治元年');
  });

  it('明治以前の年は null を返す', () => {
    expect(warekiYearLabel(1867)).toBeNull();
  });
});
