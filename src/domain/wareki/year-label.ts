import { ERAS } from './era.js';
import { formatWarekiEraYear } from './format.js';

/**
 * 西暦年に対応する和暦年の表示ラベルを返す。
 * 年の途中で改元がある年（1989 年など）は「昭和64年 / 平成元年」のように併記する。
 * 年単位の対応なので、日付の変換ができない明治5年以前も返す。明治以前は null。
 */
export function warekiYearLabel(year: number): string | null {
  const labels = ERAS.filter((era) => era.start.year <= year && (!era.end || year <= era.end.year))
    .toReversed()
    .map((era) => formatWarekiEraYear(era.name, year - era.start.year + 1));

  return labels.length > 0 ? labels.join(' / ') : null;
}
