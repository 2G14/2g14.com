import { parseQueryNumber } from '#app/lib/date-query.js';
import type { DiceSet, DiceSetSpec } from '#src/domain/dice/dice-set.js';

const DEFAULT_FACES = 6;
const DEFAULT_COUNT = 2;

/** `?faces=&count=` から入力欄の初期値を作る。無いか数でなければ 6 面 2 個にする */
export function initialDiceInput(rawFaces?: string, rawCount?: string): DiceSetSpec {
  return {
    faces: parseQueryNumber(rawFaces) ?? DEFAULT_FACES,
    count: parseQueryNumber(rawCount) ?? DEFAULT_COUNT,
  };
}

export function diceQueryString(dice: DiceSet): string {
  return new URLSearchParams({ faces: String(dice.faces), count: String(dice.count) }).toString();
}
