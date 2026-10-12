import { describe, expect, it } from 'vitest';

import {
  formatMonthDay,
  formatSeireki,
  formatSeirekiWithWeekday,
  formatSeirekiYear,
} from './format.js';
import { createSeireki } from './seireki.js';

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

describe('formatSeireki', () => {
  it('西暦の年月日を表記する', () => {
    expect(formatSeireki(createSeireki({ year: 2026, month: 7, day: 17 }))).toBe('2026年7月17日');
  });
});

describe('formatSeirekiWithWeekday', () => {
  it('西暦の年月日に曜日を添える', () => {
    expect(formatSeirekiWithWeekday(createSeireki({ year: 2026, month: 10, day: 12 }))).toBe(
      '2026年10月12日（月）',
    );
    expect(formatSeirekiWithWeekday(createSeireki({ year: 2026, month: 10, day: 18 }))).toBe(
      '2026年10月18日（日）',
    );
  });
});
