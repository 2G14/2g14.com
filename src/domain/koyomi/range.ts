/**
 * 暦の計算に対応する年の範囲。ΔT の近似式（1900〜2150 年）に収まり、
 * 前年の冬至を使う旧暦の計算も範囲内で完結するようにする。
 */
export const KOYOMI_MIN_YEAR = 1901;
export const KOYOMI_MAX_YEAR = 2100;

export class OutOfKoyomiRangeError extends Error {
  constructor(message: string = `${KOYOMI_MIN_YEAR}〜${KOYOMI_MAX_YEAR} 年の範囲外です`) {
    super(message);
    this.name = 'OutOfKoyomiRangeError';
    Object.setPrototypeOf(this, OutOfKoyomiRangeError.prototype);
  }
}

export function assertKoyomiYear(year: number): void {
  if (!Number.isInteger(year) || year < KOYOMI_MIN_YEAR || year > KOYOMI_MAX_YEAR) {
    throw new OutOfKoyomiRangeError(
      `年は ${KOYOMI_MIN_YEAR}〜${KOYOMI_MAX_YEAR} の範囲である必要があります: ${year}`,
    );
  }
}
