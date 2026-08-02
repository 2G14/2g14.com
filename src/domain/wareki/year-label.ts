import { createSeireki } from '../date/seireki.js';
import { seirekiToWareki } from './conversion.js';
import { formatWarekiEraYear } from './format.js';

/**
 * 西暦年に対応する和暦年の表示ラベルを返す。
 * 年の途中で改元がある年（1989 年など）は「昭和64年 / 平成元年」のように併記する。
 * 明治以前は null。
 */
export function warekiYearLabel(year: number): string | null {
  const atStart = seirekiToWareki(createSeireki({ year, month: 1, day: 1 }));
  const atEnd = seirekiToWareki(createSeireki({ year, month: 12, day: 31 }));

  if (!atEnd) return null;
  if (!atStart || atStart.era === atEnd.era) return formatWarekiEraYear(atEnd.era, atEnd.year);
  return `${formatWarekiEraYear(atStart.era, atStart.year)} / ${formatWarekiEraYear(atEnd.era, atEnd.year)}`;
}
