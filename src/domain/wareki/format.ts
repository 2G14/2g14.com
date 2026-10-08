import { formatMonthDay } from '../date/format.js';
import type { Wareki } from './wareki.js';

export function formatWarekiYear(year: number): string {
  return year === 1 ? '元年' : `${year}年`;
}

export function formatWarekiEraYear(era: string, year: number): string {
  return `${era}${formatWarekiYear(year)}`;
}

export function formatWareki(wareki: Wareki): string {
  return formatWarekiEraYear(wareki.era, wareki.year) + formatMonthDay(wareki.month, wareki.day);
}
