import { describe, expect, it } from 'vitest';

import { diceQueryString, initialDiceSet } from '#app/lib/dice/dice-query.js';

describe('initialDiceSet', () => {
  it('クエリの個数と面数で作る', () => {
    expect(initialDiceSet('3', '20')).toMatchObject({ count: 3, faces: 20 });
  });

  it('クエリが無ければ 6 面 2 個', () => {
    expect(initialDiceSet()).toMatchObject({ count: 2, faces: 6 });
  });

  it.each([
    ['0', '6'],
    ['11', '6'],
    ['2', '7'],
    ['abc', '6'],
  ])('不正な count=%s faces=%s なら 6 面 2 個', (count, faces) => {
    expect(initialDiceSet(count, faces)).toMatchObject({ count: 2, faces: 6 });
  });
});

describe('diceQueryString', () => {
  it('個数と面数のクエリにする', () => {
    expect(diceQueryString(initialDiceSet('3', '8'))).toBe('count=3&faces=8');
  });
});
