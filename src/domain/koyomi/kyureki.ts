import { fromDayNumber, toDayNumber } from '../date/day-count.js';
import { createSeireki, type Seireki } from '../date/seireki.js';
import { newMoonIndexOnOrBefore, newMoonJde } from './moon.js';
import { assertKoyomiYear } from './range.js';
import { solarLongitudeTime } from './sun.js';
import { jdeToJstDayNumber, jstNoonJde } from './time.js';

const brand = Symbol('Kyureki');

/** 天保暦の置閏法による旧暦（太陰太陽暦）の日付 */
export interface Kyureki {
  readonly [brand]: unknown;
  readonly year: number;
  readonly month: number;
  readonly day: number;
  /** 閏月 */
  readonly leap: boolean;
}

/** 朔（新月）の日を 1 日とする月の始まりの日（日本時間の通算日番号） */
function monthStartDay(k: number): number {
  return jdeToJstDayNumber(newMoonJde(k));
}

/** dayNumber の日を含む月の朔の番号 */
function monthIndexOf(dayNumber: number, nearJde: number): number {
  let k = newMoonIndexOnOrBefore(nearJde);
  while (monthStartDay(k + 1) <= dayNumber) k++;
  while (monthStartDay(k) > dayNumber) k--;
  return k;
}

function winterSolsticeJde(year: number): number {
  return solarLongitudeTime(270, jstNoonJde(createSeireki({ year, month: 12, day: 22 })));
}

/**
 * 冬至を含む月を 11 月とし、次の冬至を含む月までが 13 か月ある年は、
 * 11 月の後で最初に中気を含まない月を閏月にする。
 * 中気のない月で一律に閏月を置く方法は 2033 年に月の名前が決まらなくなるため採らない
 * （日本カレンダー暦文化振興協会の見解に沿って 2033 年は閏 11 月になる）。
 */
export function toKyureki(date: Seireki): Kyureki {
  assertKoyomiYear(date.year);

  const dayNumber = toDayNumber(date);
  const k = monthIndexOf(dayNumber, jstNoonJde(date));

  // date の月より前（またはその月）にある、直近の冬至を含む月を探す
  let solsticeYear = date.year;
  let solsticeJde = winterSolsticeJde(solsticeYear);
  let k11 = monthIndexOf(jdeToJstDayNumber(solsticeJde), solsticeJde);
  if (k11 > k) {
    solsticeYear -= 1;
    solsticeJde = winterSolsticeJde(solsticeYear);
    k11 = monthIndexOf(jdeToJstDayNumber(solsticeJde), solsticeJde);
  }
  const nextSolsticeJde = winterSolsticeJde(solsticeYear + 1);
  const monthCount = monthIndexOf(jdeToJstDayNumber(nextSolsticeJde), nextSolsticeJde) - k11;

  // 冬至から次の冬至までの中気（黄経 30 度ごと）の日
  const chukiDays: number[] = [];
  let jde = solsticeJde;
  for (let i = 0; i < 12; i++) {
    chukiDays.push(jdeToJstDayNumber(jde));
    jde = solarLongitudeTime((270 + (i + 1) * 30) % 360, jde + 30.4);
  }
  const hasChuki = (index: number) => {
    const start = monthStartDay(index);
    const end = monthStartDay(index + 1);
    return chukiDays.some((d) => start <= d && d < end);
  };

  let month = 11;
  let year = solsticeYear;
  let leap = false;
  let leapPlaced = monthCount === 12;
  for (let index = k11 + 1; index <= k; index++) {
    if (!leapPlaced && !hasChuki(index)) {
      leapPlaced = true;
      leap = true;
      continue;
    }
    leap = false;
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return { year, month, day: dayNumber - monthStartDay(k) + 1, leap } as Kyureki;
}

/**
 * from から count 日分の旧暦の日付。
 * 1 日ずつ toKyureki を呼ぶと重いため、月が替わる日（朔の日）だけ計算し直す。
 */
export function toKyurekiDays(from: Seireki, count: number): Kyureki[] {
  const days: Kyureki[] = [];
  let dayNumber = toDayNumber(from);
  let current = toKyureki(from);
  let nextMonthStart = monthStartDay(monthIndexOf(dayNumber, jstNoonJde(from)) + 1);

  for (let i = 0; i < count; i++, dayNumber++) {
    if (i > 0 && dayNumber === nextMonthStart) {
      const date = fromDayNumber(dayNumber);
      current = toKyureki(date);
      nextMonthStart = monthStartDay(monthIndexOf(dayNumber, jstNoonJde(date)) + 1);
    } else if (i > 0) {
      current = { ...current, day: current.day + 1 };
    }
    days.push(current);
  }
  return days;
}
