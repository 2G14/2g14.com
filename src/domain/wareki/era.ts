import { createSeireki, type Seireki } from './seireki.js';

export const ERAS = [
  {
    name: '令和',
    start: createSeireki({ year: 2019, month: 5, day: 1 }),
  },
  {
    name: '平成',
    start: createSeireki({ year: 1989, month: 1, day: 8 }),
  },
  {
    name: '昭和',
    start: createSeireki({ year: 1926, month: 12, day: 25 }),
  },
  {
    name: '大正',
    start: createSeireki({ year: 1912, month: 7, day: 30 }),
  },
  {
    name: '明治',
    start: createSeireki({ year: 1868, month: 9, day: 8 }),
  },
] as const satisfies readonly {
  readonly name: string;
  readonly start: Seireki;
}[];

export type Era = (typeof ERAS)[number];

export type EraName = Era['name'];

export class InvalidEraError extends Error {
  constructor(message: string = '不明な元号です') {
    super(message);
    this.name = 'InvalidEraError';
    Object.setPrototypeOf(this, InvalidEraError.prototype);
  }
}
