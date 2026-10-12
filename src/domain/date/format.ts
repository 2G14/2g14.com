import { dayOfWeek } from './day-count.js';
import type { Seireki } from './seireki.js';

/** dayOfWeek の値（0 = 日曜 … 6 = 土曜）の順に並べた曜日 */
export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const;

export function formatSeirekiYear(year: number): string {
  return `${year}年`;
}

export function formatMonthDay(month: number, day: number): string {
  return `${month}月${day}日`;
}

export function formatSeireki(seireki: Seireki): string {
  return formatSeirekiYear(seireki.year) + formatMonthDay(seireki.month, seireki.day);
}

/** 例: 2026年10月12日（月） */
export function formatSeirekiWithWeekday(seireki: Seireki): string {
  return `${formatSeireki(seireki)}（${WEEKDAY_LABELS[dayOfWeek(seireki)]}）`;
}
