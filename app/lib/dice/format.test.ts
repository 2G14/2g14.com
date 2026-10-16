import { describe, expect, it } from 'vitest';

import { formatFraction, formatPercent } from '#app/lib/dice/format.js';

describe('formatFraction', () => {
  it('既約分数で書く', () => {
    expect(formatFraction(6, 36)).toBe('1/6');
    expect(formatFraction(5, 36)).toBe('5/36');
  });

  it('確率 1 は 1 と書く', () => {
    expect(formatFraction(36, 36)).toBe('1');
  });
});

describe('formatPercent', () => {
  it('小数第 2 位までのパーセントにする', () => {
    expect(formatPercent(1, 36)).toBe('2.78%');
    expect(formatPercent(6, 36)).toBe('16.67%');
    expect(formatPercent(36, 36)).toBe('100%');
  });

  it('0.01% 未満は有効数字 2 桁で書く', () => {
    expect(formatPercent(1, 6 ** 6)).toBe('0.0021%');
    expect(formatPercent(1, 20 ** 10)).toBe('0.0000000000098%');
  });
});
