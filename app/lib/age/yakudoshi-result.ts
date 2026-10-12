import { type YakudoshiPeriod, yakudoshiForBirthYear } from '#src/domain/age/yakudoshi.js';

import type { NoResult } from '../result.js';
import { parseYearInput } from '../year-input.js';

export type YakudoshiResult =
  | NoResult
  | { kind: 'ok'; birthYear: number; male: YakudoshiPeriod[]; female: YakudoshiPeriod[] };

export function lookupYakudoshi(birthYear: number | null): YakudoshiResult {
  const parsed = parseYearInput(birthYear);
  if (parsed.kind !== 'ok') return parsed;

  return {
    kind: 'ok',
    birthYear: parsed.year,
    male: yakudoshiForBirthYear(parsed.year, 'male'),
    female: yakudoshiForBirthYear(parsed.year, 'female'),
  };
}
