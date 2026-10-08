const brand = Symbol('Seireki');

export interface Seireki {
  readonly [brand]: unknown;
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface SeirekiInput {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export class InvalidSeirekiError extends Error {
  constructor(message: string = '無効な日付です') {
    super(message);
    this.name = 'InvalidSeirekiError';
    Object.setPrototypeOf(this, InvalidSeirekiError.prototype);
  }
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (days === undefined) throw new InvalidSeirekiError(`想定外の月: ${month}`);
  return days;
}

export function isValidDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  return day >= 1 && day <= daysInMonth(year, month);
}

/** 日本でグレゴリオ暦が施行された日（明治5年12月3日が明治6年1月1日になった） */
export const GREGORIAN_START_IN_JAPAN: SeirekiInput = { year: 1873, month: 1, day: 1 };

export function createSeireki({ year, month, day }: SeirekiInput): Seireki {
  if (!isValidDate(year, month, day)) {
    throw new InvalidSeirekiError(`無効な日付: ${year}-${month}-${day}`);
  }
  return { year, month, day } as Seireki;
}

export function compareSeirekis(a: Seireki, b: Seireki): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}
