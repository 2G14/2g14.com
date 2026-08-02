import { diffDays } from '../date/day-count.js';
import { compareSeirekis, createSeireki, isValidDate, type Seireki } from '../date/seireki.js';

export class InvalidBirthDateError extends Error {
  constructor(message: string = '無効な生年月日です') {
    super(message);
    this.name = 'InvalidBirthDateError';
    Object.setPrototypeOf(this, InvalidBirthDateError.prototype);
  }
}

function assertNotFuture(birth: Seireki, today: Seireki): void {
  if (compareSeirekis(birth, today) > 0) {
    throw new InvalidBirthDateError(
      `生年月日が未来の日付です: ${birth.year}-${birth.month}-${birth.day}`,
    );
  }
}

// 2/29 生まれの誕生日は、平年では 3/1 として扱う（加齢日と次の誕生日を一貫させる）
function birthdayInYear(birth: Seireki, year: number): Seireki {
  if (isValidDate(year, birth.month, birth.day)) {
    return createSeireki({ year, month: birth.month, day: birth.day });
  }
  return createSeireki({ year, month: 3, day: 1 });
}

/**
 * 満年齢。誕生日当日に加齢する（法律上の誕生日前日満了主義は採らない）。
 */
export function calculateFullAge(birth: Seireki, today: Seireki): number {
  assertNotFuture(birth, today);

  const age = today.year - birth.year;
  const birthdayThisYear = birthdayInYear(birth, today.year);
  return compareSeirekis(today, birthdayThisYear) >= 0 ? age : age - 1;
}

/**
 * 数え年。生まれた年を 1 歳とし、1 月 1 日に加齢する。
 */
export function calculateKazoedoshi(birth: Seireki, today: Seireki): number {
  assertNotFuture(birth, today);

  return today.year - birth.year + 1;
}

export interface NextBirthday {
  readonly date: Seireki;
  readonly daysUntil: number;
  readonly turningAge: number;
}

/**
 * 次の誕生日。今日が誕生日の場合は daysUntil = 0 で当日を返す。
 */
export function nextBirthday(birth: Seireki, today: Seireki): NextBirthday {
  assertNotFuture(birth, today);

  const birthdayThisYear = birthdayInYear(birth, today.year);
  const date =
    compareSeirekis(today, birthdayThisYear) <= 0
      ? birthdayThisYear
      : birthdayInYear(birth, today.year + 1);

  return {
    date,
    daysUntil: diffDays(today, date),
    turningAge: date.year - birth.year,
  };
}

export function daysSinceBirth(birth: Seireki, today: Seireki): number {
  assertNotFuture(birth, today);

  return diffDays(birth, today);
}

export function weeksSinceBirth(birth: Seireki, today: Seireki): number {
  return Math.floor(daysSinceBirth(birth, today) / 7);
}

/**
 * 生後ヶ月数（暦月ベース）。当月の「日」が生まれた日に達していなければ 1 ヶ月引く。
 */
export function monthsSinceBirth(birth: Seireki, today: Seireki): number {
  assertNotFuture(birth, today);

  const months = (today.year - birth.year) * 12 + (today.month - birth.month);
  return today.day < birth.day ? months - 1 : months;
}
