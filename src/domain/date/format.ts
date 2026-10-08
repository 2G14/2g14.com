import type { Seireki } from './seireki.js';

export function formatSeirekiYear(year: number): string {
  return `${year}年`;
}

export function formatMonthDay(month: number, day: number): string {
  return `${month}月${day}日`;
}

export function formatSeireki(seireki: Seireki): string {
  return formatSeirekiYear(seireki.year) + formatMonthDay(seireki.month, seireki.day);
}
