import type { NoResult } from '#app/lib/result.js';
import {
  createDiceSet,
  type DiceSet,
  isValidDiceCount,
  isValidDiceFaces,
  MAX_DICE_COUNT,
  MAX_FACES,
  MIN_DICE_COUNT,
  MIN_FACES,
} from '#src/domain/dice/dice-set.js';

export type ParsedDiceInput = NoResult | { kind: 'ok'; dice: DiceSet };

export function parseDiceInput(faces: number | null, count: number | null): ParsedDiceInput {
  if (faces === null || count === null) return { kind: 'empty' };
  if (!isValidDiceFaces(faces)) {
    return {
      kind: 'error',
      message: `面数は ${MIN_FACES}〜${MAX_FACES} の整数で入力してください。`,
    };
  }
  if (!isValidDiceCount(count)) {
    return {
      kind: 'error',
      message: `個数は ${MIN_DICE_COUNT}〜${MAX_DICE_COUNT} の整数で入力してください。`,
    };
  }
  return { kind: 'ok', dice: createDiceSet(count, faces) };
}
