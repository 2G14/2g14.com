import { createSeireki, type Seireki, type SeirekiInput } from './seireki.js';

const RAW_ERAS = [
  { name: '令和', start: { year: 2019, month: 5, day: 1 } },
  { name: '平成', start: { year: 1989, month: 1, day: 8 } },
  { name: '昭和', start: { year: 1926, month: 12, day: 25 } },
  { name: '大正', start: { year: 1912, month: 7, day: 30 } },
  { name: '明治', start: { year: 1868, month: 9, day: 8 } },
] as const satisfies readonly {
  readonly name: string;
  readonly start: SeirekiInput;
}[];

export interface Era {
  readonly name: string;
  readonly start: Seireki;
  readonly end: Seireki | null;
}

export const ERAS = RAW_ERAS.map((e, i) => ({
  name: e.name,
  start: createSeireki(e.start),
  // biome-ignore lint/style/noNonNullAssertion: 最初の要素以外は必ず前の要素が存在するため、non-null assertionを使用
  end: i > 0 ? createSeireki(RAW_ERAS[i - 1]!.start) : null,
})) satisfies readonly Era[];

export type EraName = Era['name'];

export class InvalidEraError extends Error {
  constructor(message: string = '不明な元号です') {
    super(message);
    this.name = 'InvalidEraError';
    Object.setPrototypeOf(this, InvalidEraError.prototype);
  }
}
