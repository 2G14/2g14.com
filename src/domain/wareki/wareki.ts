import { ERAS, type EraName, InvalidEraError } from './era.js';
import { InvalidSeirekiError, isValidDate } from './seireki.js';

const brand = Symbol('Wareki');

export interface Wareki {
  readonly [brand]: unknown;
  readonly era: EraName;
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface WarekiInput {
  readonly era: EraName;
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export class InvalidWarekiError extends Error {
  constructor(message: string = '無効な和暦です') {
    super(message);
    this.name = 'InvalidWarekiError';
    Object.setPrototypeOf(this, InvalidWarekiError.prototype);
  }
}

export function createWareki({ era, year, month, day }: WarekiInput): Wareki {
  if (year < 1) {
    throw new InvalidWarekiError(`元号年は1以上である必要があります: ${year}`);
  }

  const eraEntry = ERAS.find((e) => e.name === era);
  if (!eraEntry) {
    throw new InvalidEraError(`不明な元号です: ${era}`);
  }

  // 元年の場合、元号の開始日より前の月日が指定されているかは
  // 西暦に変換せずとも判定可能なので先にチェックする
  if (year === 1) {
    const start = eraEntry.start;
    if (month < start.month || (month === start.month && day < start.day)) {
      throw new InvalidWarekiError(`${era}${year}年${month}月${day}日は存在しません`);
    }
  }

  const seirekiYear = eraEntry.start.year - 1 + year;
  // 月日自体が有効かは（閏年判定を含めて）西暦年で検証する
  if (!isValidDate(seirekiYear, month, day)) {
    throw new InvalidSeirekiError(`無効な日付: ${seirekiYear}-${month}-${day}`);
  }

  return { era, year, month, day } as Wareki;
}
