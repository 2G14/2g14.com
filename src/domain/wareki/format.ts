import type { Seireki } from '../date/seireki.js';
import type { Wareki } from './wareki.js';

export function formatWarekiYear(year: number): string {
  return year === 1 ? '元年' : `${year}年`;
}

export function formatWarekiEraYear(era: string, year: number): string {
  return `${era}${formatWarekiYear(year)}`;
}

export function formatSeirekiYear(year: number): string {
  return `${year}年`;
}

export function formatMonthDay(month: number, day: number): string {
  return `${month}月${day}日`;
}

export function formatWareki(wareki: Wareki): string {
  return formatWarekiEraYear(wareki.era, wareki.year) + formatMonthDay(wareki.month, wareki.day);
}

export function formatSeireki(seireki: Seireki): string {
  return formatSeirekiYear(seireki.year) + formatMonthDay(seireki.month, seireki.day);
}
