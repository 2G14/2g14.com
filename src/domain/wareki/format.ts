import type { Seireki } from './seireki.js';
import type { Wareki } from './wareki.js';

export function formatWarekiYear(year: number): string {
  return year === 1 ? '元年' : `${year}年`;
}

export function formatWarekiEraYear(era: string, year: number): string {
  return `${era}${formatWarekiYear(year)}`;
}

export function formatMonthDay(month: number, day: number): string {
  return `${month}月${day}日`;
}

export function formatWareki(wareki: Wareki): string {
  return formatWarekiEraYear(wareki.era, wareki.year) + formatMonthDay(wareki.month, wareki.day);
}

export function formatSeireki(seireki: Seireki): string {
  return `${seireki.year}年${formatMonthDay(seireki.month, seireki.day)}`;
}
