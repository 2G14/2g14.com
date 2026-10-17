import { parseQueryNumber } from '#app/lib/date-query.js';
import type { DiceSet, DiceSetSpec } from '#src/domain/dice/dice-set.js';

const DEFAULT_FACES = 6;
const DEFAULT_COUNT = 2;

/** URL のクエリの値（無ければ undefined） */
export type DiceQuery = { readonly [K in keyof DiceSetSpec]?: string | undefined };

/** `?faces=&count=` から入力欄の初期値を作る。無いか数でなければ 6 面 2 個にする */
export function initialDiceInput({ faces, count }: DiceQuery): DiceSetSpec {
  return {
    faces: parseQueryNumber(faces) ?? DEFAULT_FACES,
    count: parseQueryNumber(count) ?? DEFAULT_COUNT,
  };
}

export function diceQueryString(dice: DiceSet): string {
  return new URLSearchParams({ faces: String(dice.faces), count: String(dice.count) }).toString();
}
