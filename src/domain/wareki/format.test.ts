import { describe, expect, it } from 'vitest';

import {
  formatMonthDay,
  formatSeireki,
  formatSeirekiYear,
  formatWareki,
  formatWarekiEraYear,
  formatWarekiYear,
} from './format.js';
import { createSeireki } from './seireki.js';
import { createWareki } from './wareki.js';

describe('formatWarekiYear', () => {
  it('1年は元年と表記する', () => {
    expect(formatWarekiYear(1)).toBe('元年');
  });

  it('2年以降はそのまま表記する', () => {
    expect(formatWarekiYear(8)).toBe('8年');
  });
});

describe('formatWarekiEraYear', () => {
  it('元号と年をつなげる', () => {
    expect(formatWarekiEraYear('令和', 8)).toBe('令和8年');
    expect(formatWarekiEraYear('令和', 1)).toBe('令和元年');
  });
});

describe('formatSeirekiYear', () => {
  it('西暦の年を表記する', () => {
    expect(formatSeirekiYear(2026)).toBe('2026年');
  });
});

describe('formatMonthDay', () => {
  it('月日を表記する', () => {
    expect(formatMonthDay(7, 17)).toBe('7月17日');
  });
});

describe('formatWareki', () => {
  it('元号・年・月日を通して表記する', () => {
    expect(formatWareki(createWareki({ era: '令和', year: 8, month: 7, day: 17 }))).toBe(
      '令和8年7月17日',
    );
  });

  it('元年も元年として表記する', () => {
    expect(formatWareki(createWareki({ era: '令和', year: 1, month: 7, day: 17 }))).toBe(
      '令和元年7月17日',
    );
  });
});

describe('formatSeireki', () => {
  it('西暦の年月日を表記する', () => {
    expect(formatSeireki(createSeireki({ year: 2026, month: 7, day: 17 }))).toBe('2026年7月17日');
  });
});
