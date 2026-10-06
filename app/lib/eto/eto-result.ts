import { etoFromYear, JUNISHI, type Kanshi, yearsForJunishi } from '#src/domain/eto/eto.js';

import type { NoResult } from '../result.js';

const NEIGHBOR_RANGE = 24;

export type EtoResult =
  | NoResult
  | { kind: 'ok'; year: number; eto: Kanshi; sameJunishiYears: number[] };

export function lookupEto(year: number | null): EtoResult {
  if (year === null) return { kind: 'empty' };
  if (!Number.isInteger(year)) return { kind: 'error', message: '年は整数で入力してください。' };

  const eto = etoFromYear(year);
  const junishiIndex = JUNISHI.findIndex((j) => j.kanji === eto.junishi.kanji);
  return {
    kind: 'ok',
    year,
    eto,
    sameJunishiYears: yearsForJunishi(junishiIndex, year - NEIGHBOR_RANGE, year + NEIGHBOR_RANGE),
  };
}
