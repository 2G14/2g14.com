import { describe, expect, it } from 'vitest';

import { compareSeirekis, createSeireki, InvalidSeirekiError } from './seireki.js';

describe('seireki', () => {
  it('createSeireki: 正常な日付を作成できる（閏年を含む）', () => {
    const d1 = createSeireki({ year: 2020, month: 2, day: 29 });
    expect(d1).toEqual({ year: 2020, month: 2, day: 29 });

    const d2 = createSeireki({ year: 2000, month: 2, day: 29 });
    expect(d2).toEqual({ year: 2000, month: 2, day: 29 });
  });

  it('createSeireki: 無効な月はエラー', () => {
    expect(() => createSeireki({ year: 2020, month: 13, day: 1 })).toThrow(InvalidSeirekiError);
  });

  it('createSeireki: 月の日数を超える日はエラー', () => {
    expect(() => createSeireki({ year: 2021, month: 4, day: 31 })).toThrow(InvalidSeirekiError);
  });

  it('createSeireki: 閏年でない年の2月29日はエラー', () => {
    expect(() => createSeireki({ year: 2019, month: 2, day: 29 })).toThrow(InvalidSeirekiError);
  });

  it('compareSeirekis: 正しい順序を返す', () => {
    const a = createSeireki({ year: 2020, month: 1, day: 1 });
    const b = createSeireki({ year: 2020, month: 1, day: 2 });
    const c = createSeireki({ year: 2021, month: 1, day: 1 });

    expect(compareSeirekis(a, b)).toBeLessThan(0);
    expect(compareSeirekis(b, a)).toBeGreaterThan(0);
    expect(compareSeirekis(a, a)).toBe(0);
    expect(compareSeirekis(b, c)).toBeLessThan(0);
  });
});
