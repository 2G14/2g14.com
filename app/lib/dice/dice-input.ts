import type { NoResult } from '#app/lib/result.js';
import {
  createDiceSet,
  type DiceSet,
  MAX_DICE_COUNT,
  MAX_FACES,
  MIN_FACES,
} from '#src/domain/dice/dice-set.js';

export type ParsedDiceInput = NoResult | { kind: 'ok'; dice: DiceSet };

function isIntegerInRange(n: number, min: number, max: number): boolean {
  return Number.isInteger(n) && n >= min && n <= max;
}

export function parseDiceInput(faces: number | null, count: number | null): ParsedDiceInput {
  if (faces === null || count === null) return { kind: 'empty' };
  if (!isIntegerInRange(faces, MIN_FACES, MAX_FACES)) {
    return {
      kind: 'error',
      message: `面数は ${MIN_FACES}〜${MAX_FACES} の整数で入力してください。`,
    };
  }
  if (!isIntegerInRange(count, 1, MAX_DICE_COUNT)) {
    return { kind: 'error', message: `個数は 1〜${MAX_DICE_COUNT} の整数で入力してください。` };
  }
  return { kind: 'ok', dice: createDiceSet(count, faces) };
}
