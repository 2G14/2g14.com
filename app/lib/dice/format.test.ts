import { describe, expect, it } from 'vitest';

import { formatFraction, formatPercent, formatWays } from '#app/lib/dice/format.js';

describe('formatPercent', () => {
  it('小数第 2 位までのパーセントにする', () => {
    expect(formatPercent(1n, 36n)).toBe('2.78%');
    expect(formatPercent(6n, 36n)).toBe('16.67%');
    expect(formatPercent(36n, 36n)).toBe('100%');
  });

  it('0.01% 未満は有効数字 2 桁で書く', () => {
    expect(formatPercent(1n, 6n ** 6n)).toBe('0.0021%');
  });

  it('0% と 100% はちょうど 0 と 1 のときだけ', () => {
    expect(formatPercent(0n, 36n)).toBe('0%');
    expect(formatPercent(36n, 36n)).toBe('100%');
  });

  it('丸めると 100% になる確率は、100% との差が分かる桁まで書く', () => {
    const total = 6n ** 100n;
    expect(formatPercent(total - 5n ** 100n, total)).toBe('99.9999988%');
    expect(formatPercent(99_996n, 100_000n)).toBe('99.996%');
  });

  it('100% との差が 0.000001% 未満なら差を指数で書く', () => {
    expect(formatPercent(10n ** 200n - 1n, 10n ** 200n)).toBe('100% − 1.0×10⁻¹⁹⁸%');
  });

  it('0.000001% 未満は指数で書く', () => {
    expect(formatPercent(1n, 20n ** 10n)).toBe('9.8×10⁻¹²%');
    expect(formatPercent(1n, 10n ** 200n)).toBe('1.0×10⁻¹⁹⁸%');
  });
});

describe('formatFraction', () => {
  it('既約分数で書く', () => {
    expect(formatFraction(6n, 36n)).toBe('1/6');
    expect(formatFraction(5n, 36n)).toBe('5/36');
  });

  it('確率 1 は 1 と書く', () => {
    expect(formatFraction(36n, 36n)).toBe('1');
  });

  it('総数が 12 桁を超えると、約分すれば短くなる場合も書かない', () => {
    expect(formatFraction(1n, 10n ** 12n)).toBeNull();
    expect(formatFraction(10n ** 12n / 2n, 10n ** 12n)).toBeNull();
    expect(formatFraction(1n, 10n ** 11n)).toBe('1/100000000000');
  });
});

describe('formatWays', () => {
  it('15 桁までは桁区切りで書く', () => {
    expect(formatWays(1296n)).toBe('1,296');
    expect(formatWays(10n ** 14n)).toBe('100,000,000,000,000');
  });

  it('16 桁以上は指数で書く', () => {
    expect(formatWays(10n ** 200n)).toBe('1.0×10²⁰⁰');
  });

  it('桁数の上限を指定できる', () => {
    expect(formatWays(12_345_678n, 8)).toBe('12,345,678');
    expect(formatWays(123_456_789n, 8)).toBe('1.2×10⁸');
  });
});
