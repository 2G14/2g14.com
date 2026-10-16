import { describe, expect, it } from 'vitest';

import { parseDiceInput } from '#app/lib/dice/dice-input.js';

describe('parseDiceInput', () => {
  it('面数と個数からサイコロの組を作る', () => {
    const result = parseDiceInput(100, 3);
    expect(result.kind === 'ok' && result.dice).toMatchObject({ faces: 100, count: 3 });
  });

  it('どちらかが空なら empty', () => {
    expect(parseDiceInput(null, 2)).toEqual({ kind: 'empty' });
    expect(parseDiceInput(6, null)).toEqual({ kind: 'empty' });
  });

  it.each([
    [1, 2, '面数は 2〜100 の整数で入力してください。'],
    [101, 2, '面数は 2〜100 の整数で入力してください。'],
    [6.5, 2, '面数は 2〜100 の整数で入力してください。'],
    [6, 0, '個数は 1〜100 の整数で入力してください。'],
    [6, 101, '個数は 1〜100 の整数で入力してください。'],
  ])('面数 %s・個数 %s はエラー', (faces, count, message) => {
    expect(parseDiceInput(faces, count)).toEqual({ kind: 'error', message });
  });
});
