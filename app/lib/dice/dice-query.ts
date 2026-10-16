import { parseQueryNumber } from '#app/lib/date-query.js';
import { createDiceSet, type DiceSet, InvalidDiceSetError } from '#src/domain/dice/dice-set.js';

const DEFAULT_COUNT = 2;
const DEFAULT_FACES = 6;

/** `?count=&faces=` から初期のサイコロの組を作る。無いか不正なら 6 面 2 個にする */
export function initialDiceSet(rawCount?: string, rawFaces?: string): DiceSet {
  try {
    return createDiceSet(
      parseQueryNumber(rawCount) ?? DEFAULT_COUNT,
      parseQueryNumber(rawFaces) ?? DEFAULT_FACES,
    );
  } catch (error) {
    if (error instanceof InvalidDiceSetError) return createDiceSet(DEFAULT_COUNT, DEFAULT_FACES);
    throw error;
  }
}

export function diceQueryString(dice: DiceSet): string {
  return new URLSearchParams({ count: String(dice.count), faces: String(dice.faces) }).toString();
}
