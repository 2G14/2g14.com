import type { Kyureki } from './kyureki.js';

export interface Rokuyo {
  readonly name: string;
  readonly reading: string;
}

/** 旧暦の (月 + 日) を 6 で割った余りの順に並べる */
const ROKUYO_BY_REMAINDER = [
  { name: '大安', reading: 'たいあん' },
  { name: '赤口', reading: 'しゃっこう' },
  { name: '先勝', reading: 'せんしょう' },
  { name: '友引', reading: 'ともびき' },
  { name: '先負', reading: 'せんぶ' },
  { name: '仏滅', reading: 'ぶつめつ' },
] as const satisfies readonly Rokuyo[];

/**
 * 六曜は旧暦の月日で決まる。各月の 1 日を、1 月・7 月は先勝、2 月・8 月は友引…と
 * 順にずらして始め、以降は日ごとに順に巡る。閏月は前の月と同じ扱いになる。
 */
export function rokuyoOf(kyureki: Kyureki): Rokuyo {
  return ROKUYO_BY_REMAINDER[(kyureki.month + kyureki.day) % 6]!;
}
