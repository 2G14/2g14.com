import { describe, expect, it } from 'vitest';

import { lookupYakudoshi } from './yakudoshi-result.js';

describe('lookupYakudoshi', () => {
  it('生まれ年から男女それぞれの厄年を返す', () => {
    const result = lookupYakudoshi(1985);

    expect(result).toMatchObject({ kind: 'ok', birthYear: 1985 });
    expect(result.kind === 'ok' && result.male.map((p) => p.honyakuAge)).toEqual([25, 42, 61]);
    expect(result.kind === 'ok' && result.female.map((p) => p.honyakuAge)).toEqual([
      19, 33, 37, 61,
    ]);
  });

  it('年が未入力なら empty を返す', () => {
    expect(lookupYakudoshi(null)).toEqual({ kind: 'empty' });
  });

  it('入力欄の範囲(1〜9999)外の年はエラーを返す', () => {
    expect(lookupYakudoshi(0)).toMatchObject({ kind: 'error' });
    expect(lookupYakudoshi(10000)).toMatchObject({ kind: 'error' });
  });
});
