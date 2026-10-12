import type { Seireki } from '#src/domain/date/seireki.js';
import {
  type Grade,
  gradeOn,
  type SchoolPeriod,
  schoolTimeline,
} from '#src/domain/school/school-year.js';

import { parseSeirekiInput } from '../date-input.js';
import type { NoResult } from '../result.js';

export type SchoolYearResult =
  | NoResult
  | { kind: 'ok'; birth: Seireki; grade: Grade | null; timeline: SchoolPeriod[] };

export function calculateSchoolYearResult(
  year: number | null,
  month: number | null,
  day: number | null,
  today: Seireki,
): SchoolYearResult {
  const parsed = parseSeirekiInput(year, month, day);
  if (parsed.kind !== 'ok') return parsed;

  const birth = parsed.seireki;
  return { kind: 'ok', birth, grade: gradeOn(birth, today), timeline: schoolTimeline(birth) };
}
