import { createSeireki, type Seireki } from '../date/seireki.js';
import { assertKoyomiYear } from './range.js';
import { solarLongitudeTime } from './sun.js';
import { jdeToJstDate, jstNoonJde } from './time.js';

interface Sekki {
  readonly name: string;
  readonly reading: string;
  /** 太陽黄経（度） */
  readonly longitude: number;
  /** 中気（黄経が 30 度の倍数）。旧暦の月の名前を決める */
  readonly chuki: boolean;
}

/** 1 月の小寒から 12 月の冬至まで、暦の上で現れる順に並べる */
const SEKKI_LIST = [
  { name: '小寒', reading: 'しょうかん', longitude: 285, chuki: false },
  { name: '大寒', reading: 'だいかん', longitude: 300, chuki: true },
  { name: '立春', reading: 'りっしゅん', longitude: 315, chuki: false },
  { name: '雨水', reading: 'うすい', longitude: 330, chuki: true },
  { name: '啓蟄', reading: 'けいちつ', longitude: 345, chuki: false },
  { name: '春分', reading: 'しゅんぶん', longitude: 0, chuki: true },
  { name: '清明', reading: 'せいめい', longitude: 15, chuki: false },
  { name: '穀雨', reading: 'こくう', longitude: 30, chuki: true },
  { name: '立夏', reading: 'りっか', longitude: 45, chuki: false },
  { name: '小満', reading: 'しょうまん', longitude: 60, chuki: true },
  { name: '芒種', reading: 'ぼうしゅ', longitude: 75, chuki: false },
  { name: '夏至', reading: 'げし', longitude: 90, chuki: true },
  { name: '小暑', reading: 'しょうしょ', longitude: 105, chuki: false },
  { name: '大暑', reading: 'たいしょ', longitude: 120, chuki: true },
  { name: '立秋', reading: 'りっしゅう', longitude: 135, chuki: false },
  { name: '処暑', reading: 'しょしょ', longitude: 150, chuki: true },
  { name: '白露', reading: 'はくろ', longitude: 165, chuki: false },
  { name: '秋分', reading: 'しゅうぶん', longitude: 180, chuki: true },
  { name: '寒露', reading: 'かんろ', longitude: 195, chuki: false },
  { name: '霜降', reading: 'そうこう', longitude: 210, chuki: true },
  { name: '立冬', reading: 'りっとう', longitude: 225, chuki: false },
  { name: '小雪', reading: 'しょうせつ', longitude: 240, chuki: true },
  { name: '大雪', reading: 'たいせつ', longitude: 255, chuki: false },
  { name: '冬至', reading: 'とうじ', longitude: 270, chuki: true },
] as const satisfies readonly Sekki[];

export interface SekkiDate {
  readonly sekki: Sekki;
  /** 日本時間での日付 */
  readonly date: Seireki;
}

// 節気は毎月 2 つずつ、おおむね 5 日前後と 20 日前後に来るので、そこから探す
function sekkiDate(year: number, index: number): SekkiDate {
  const sekki = SEKKI_LIST[index]!;
  const near = createSeireki({
    year,
    month: Math.floor(index / 2) + 1,
    day: index % 2 === 0 ? 5 : 20,
  });
  return { sekki, date: jdeToJstDate(solarLongitudeTime(sekki.longitude, jstNoonJde(near))) };
}

/**
 * 二十四節気の日付（日本時間）を、その年の 1 月から順に返す。
 */
export function sekkiOfYear(year: number): SekkiDate[] {
  assertKoyomiYear(year);
  return SEKKI_LIST.map((_, i) => sekkiDate(year, i));
}

/**
 * その月にある 2 つの節気（月の前半の節と後半の中気）の日付。
 * 月のカレンダーで 1 年分の 24 回の探索をしないで済むようにする。
 */
export function sekkiOfMonth(year: number, month: number): SekkiDate[] {
  assertKoyomiYear(year);
  return [sekkiDate(year, (month - 1) * 2), sekkiDate(year, (month - 1) * 2 + 1)];
}
