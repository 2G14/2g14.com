import { assert, describe, expect, it } from 'vitest';

import { seirekiToWareki, warekiToSeireki } from './conversion.js';
import type { EraName } from './era.js';
import { createSeireki, type SeirekiInput } from './seireki.js';
import { createWareki, InvalidWarekiError } from './wareki.js';

const ERAS: ReadonlyArray<{
  name: EraName;
  start: SeirekiInput;
}> = [
  { name: '令和', start: { year: 2019, month: 5, day: 1 } },
  { name: '平成', start: { year: 1989, month: 1, day: 8 } },
  { name: '昭和', start: { year: 1926, month: 12, day: 25 } },
  { name: '大正', start: { year: 1912, month: 7, day: 30 } },
  { name: '明治', start: { year: 1868, month: 9, day: 8 } },
];

describe('conversion (warekiToSeireki / seirekiToWareki)', () => {
  it('warekiToSeireki: 各元号の開始日は有効', () => {
    for (const era of ERAS) {
      const w = createWareki({
        era: era.name,
        year: 1,
        month: era.start.month,
        day: era.start.day,
      });
      const s = warekiToSeireki(w);
      expect(s).toEqual(createSeireki(era.start));
    }
  });

  it('warekiToSeireki: 開始日の直前日は無効', () => {
    const prevOf = (start: { year: number; month: number; day: number }) => {
      let y = start.year;
      let m = start.month;
      let d = start.day - 1;
      if (d >= 1) return { year: y, month: m, day: d };
      m = m - 1;
      if (m < 1) {
        y = y - 1;
        m = 12;
      }
      const isLeap = (yr: number) => (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0;
      const daysInMonth = (yr: number, mo: number) =>
        [31, isLeap(yr) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo - 1] ?? 31;
      d = daysInMonth(y, m);
      return { year: y, month: m, day: d };
    };

    for (const era of ERAS) {
      const prev = prevOf(era.start);
      try {
        createSeireki(prev);
      } catch {
        continue;
      }
      expect(() =>
        createWareki({
          era: era.name,
          year: prev.year - (prev.year - 1),
          month: prev.month,
          day: prev.day,
        }),
      ).toThrow(InvalidWarekiError);
    }
  });

  it('seirekiToWareki: 最も新しい元号が優先される', () => {
    const date = createSeireki({ year: 2019, month: 5, day: 1 });
    const w = seirekiToWareki(date);
    expect(w).toEqual({ era: '令和', year: 1, month: 5, day: 1 });
  });

  it('seirekiToWareki: 明治以前は null', () => {
    const d = createSeireki({ year: 1868, month: 9, day: 7 });
    expect(seirekiToWareki(d)).toBeNull();
  });

  it('seirekiToWareki: 開始日の前日は古い元号にマップされる', () => {
    /**
     * 各元号の開始日の「前日」を定義する定数（明治は除外）
     */
    const PREV_STARTS: ReadonlyArray<{
      name: EraName;
      prevEra: EraName;
      prev: SeirekiInput;
    }> = [
      {
        name: '令和',
        prevEra: '平成',
        prev: { year: 2019, month: 4, day: 30 },
      },
      { name: '平成', prevEra: '昭和', prev: { year: 1989, month: 1, day: 7 } },
      {
        name: '昭和',
        prevEra: '大正',
        prev: { year: 1926, month: 12, day: 24 },
      },
      {
        name: '大正',
        prevEra: '明治',
        prev: { year: 1912, month: 7, day: 29 },
      },
    ];

    for (const c of PREV_STARTS) {
      const date = createSeireki(c.prev);
      const mapped = seirekiToWareki(date);

      expect(mapped).not.toBeNull();
      assert(mapped);

      const eraDef = ERAS.find((e) => e.name === c.prevEra);
      assert(eraDef, `era definition not found for ${c.prevEra}`);
      const expectedYear = date.year - eraDef.start.year + 1;
      expect(mapped).toEqual({
        era: c.prevEra,
        year: expectedYear,
        month: date.month,
        day: date.day,
      });
    }
  });
});
