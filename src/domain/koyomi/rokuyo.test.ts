import { describe, expect, it } from 'vitest';

import { createSeireki } from '../date/seireki.js';
import { toKyureki } from './kyureki.js';
import { rokuyoOf } from './rokuyo.js';

const rokuyo = (year: number, month: number, day: number) =>
  rokuyoOf(toKyureki(createSeireki({ year, month, day }))).name;

describe('rokuyoOf', () => {
  it('旧暦 1 月 1 日は先勝', () => {
    expect(rokuyo(2026, 2, 17)).toBe('先勝');
  });

  it('月が替わると順番が飛ぶ', () => {
    // 2026-10-10 は旧暦 8 月 30 日、10-11 は 9 月 1 日
    expect(rokuyo(2026, 10, 10)).toBe('先勝');
    expect(rokuyo(2026, 10, 11)).toBe('先負');
  });

  it('2026 年 10 月の六曜', () => {
    const october = Array.from({ length: 31 }, (_, i) => rokuyo(2026, 10, i + 1));

    expect(october.slice(0, 14)).toEqual([
      '仏滅',
      '大安',
      '赤口',
      '先勝',
      '友引',
      '先負',
      '仏滅',
      '大安',
      '赤口',
      '先勝',
      '先負',
      '仏滅',
      '大安',
      '赤口',
    ]);
    expect(october.at(-1)).toBe('大安');
  });
});
