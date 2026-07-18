import { ERAS, InvalidEraError } from './era.js';
import { compareSeirekis, createSeireki, type Seireki } from './seireki.js';
import { createWareki, type Wareki } from './wareki.js';

/**
 * 和暦 -> 西暦
 */
export function warekiToSeireki(wareki: Wareki): Seireki {
  const era = ERAS.find((e) => e.name === wareki.era);
  if (!era) throw new InvalidEraError(`不明な元号です: ${wareki.era}`);

  const year = era.start.year - 1 + wareki.year;
  const date = createSeireki({ year, month: wareki.month, day: wareki.day });

  return date;
}

/**
 * 西暦 -> 和暦
 */
export function seirekiToWareki(date: Seireki): Wareki | null {
  for (const era of ERAS) {
    if (compareSeirekis(date, era.start) >= 0) {
      return createWareki({
        era: era.name,
        year: date.year - (era.start.year - 1),
        month: date.month,
        day: date.day,
      });
    }
  }
  // 明治以前はnull
  return null;
}
