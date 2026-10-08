import {
  calculateFullAge,
  calculateKazoedoshi,
  daysSinceBirth,
  monthsSinceBirth,
  type NextBirthday,
  nextBirthday,
  weeksSinceBirth,
} from '#src/domain/age/age.js';
import {
  compareSeirekis,
  createSeireki,
  GREGORIAN_START_IN_JAPAN,
  type Seireki,
} from '#src/domain/date/seireki.js';
import { etoFromYear, type Kanshi } from '#src/domain/eto/eto.js';
import { seirekiToWareki } from '#src/domain/wareki/conversion.js';
import type { Wareki } from '#src/domain/wareki/wareki.js';

import { parseDateInput } from '../date-input.js';
import type { NoResult } from '../result.js';

interface AgeSummary {
  birth: Seireki;
  fullAge: number;
  kazoedoshi: number;
  next: NextBirthday;
  days: number;
  weeks: number;
  months: number;
  /** 1873 年より前は null */
  japaneseCalendar: { wareki: Wareki; eto: Kanshi } | null;
}

// 入力欄の下限に合わせる。西暦 0 年や紀元前はグレゴリオ暦の年番号として扱わない
const MIN_YEAR = 1;

export type AgeResult = NoResult | ({ kind: 'ok' } & AgeSummary);

export function calculateAgeResult(
  year: number | null,
  month: number | null,
  day: number | null,
  today: Seireki,
): AgeResult {
  const parsed = parseDateInput(year, month, day);
  if (parsed.kind !== 'ok') return parsed;
  if (parsed.date.year < MIN_YEAR) {
    return { kind: 'error', message: `年は${MIN_YEAR}以上で入力してください。` };
  }

  try {
    const birth = createSeireki(parsed.date);
    const wareki = seirekiToWareki(birth);
    // それより前の日本は旧暦で、和暦の月日も干支が切り替わる正月もグレゴリオ暦と合わない
    const usesJapaneseGregorian =
      compareSeirekis(birth, createSeireki(GREGORIAN_START_IN_JAPAN)) >= 0;

    return {
      kind: 'ok',
      birth,
      fullAge: calculateFullAge(birth, today),
      kazoedoshi: calculateKazoedoshi(birth, today),
      next: nextBirthday(birth, today),
      days: daysSinceBirth(birth, today),
      weeks: weeksSinceBirth(birth, today),
      months: monthsSinceBirth(birth, today),
      japaneseCalendar:
        usesJapaneseGregorian && wareki ? { wareki, eto: etoFromYear(birth.year) } : null,
    };
  } catch (e) {
    if (e instanceof Error) return { kind: 'error', message: e.message };
    return { kind: 'error', message: '計算中にエラーが発生しました。' };
  }
}
