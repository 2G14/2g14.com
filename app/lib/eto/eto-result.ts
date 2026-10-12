import { etoFromYear, JUNISHI, type Kanshi, yearsForJunishi } from '#src/domain/eto/eto.js';

import type { NoResult } from '../result.js';
import { MAX_YEAR, MIN_YEAR, parseYearInput } from '../year-input.js';

const NEIGHBOR_RANGE = 24;

export type EtoResult =
  | NoResult
  | { kind: 'ok'; year: number; eto: Kanshi; sameJunishiYears: number[] };

export function lookupEto(input: number | null): EtoResult {
  const parsed = parseYearInput(input);
  if (parsed.kind !== 'ok') return parsed;
  const { year } = parsed;

  const eto = etoFromYear(year);
  const junishiIndex = JUNISHI.findIndex((j) => j.kanji === eto.junishi.kanji);
  return {
    kind: 'ok',
    year,
    eto,
    sameJunishiYears: yearsForJunishi(
      junishiIndex,
      Math.max(year - NEIGHBOR_RANGE, MIN_YEAR),
      Math.min(year + NEIGHBOR_RANGE, MAX_YEAR),
    ),
  };
}
