import { describe, expect, it } from 'vitest';

import { diceQueryString, initialDiceInput } from '#app/lib/dice/dice-query.js';
import { createDiceSet } from '#src/domain/dice/dice-set.js';

describe('initialDiceInput', () => {
  it('クエリの面数と個数を初期値にする', () => {
    expect(initialDiceInput({ faces: '100', count: '3' })).toEqual({ faces: 100, count: 3 });
  });

  it('クエリが無いか数でなければ 6 面 2 個', () => {
    expect(initialDiceInput({})).toEqual({ faces: 6, count: 2 });
    expect(initialDiceInput({ faces: 'abc', count: '1.5' })).toEqual({ faces: 6, count: 2 });
  });

  it('範囲外でも数ならそのまま残し、入力欄でエラーを見せる', () => {
    expect(initialDiceInput({ faces: '1000', count: '0' })).toEqual({ faces: 1000, count: 0 });
  });
});

describe('diceQueryString', () => {
  it('面数と個数のクエリにする', () => {
    expect(diceQueryString(createDiceSet({ count: 3, faces: 8 }))).toBe('faces=8&count=3');
  });
});
