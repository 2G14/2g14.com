import { type ChojuYears, chojuYearsForBirthYear } from '#src/domain/age/choju.js';

import type { NoResult } from '../result.js';
import { parseYearInput } from '../year-input.js';

export type ChojuResult = NoResult | { kind: 'ok'; birthYear: number; years: ChojuYears[] };

export function lookupChoju(birthYear: number | null): ChojuResult {
  const parsed = parseYearInput(birthYear);
  if (parsed.kind !== 'ok') return parsed;

  return { kind: 'ok', birthYear: parsed.year, years: chojuYearsForBirthYear(parsed.year) };
}
