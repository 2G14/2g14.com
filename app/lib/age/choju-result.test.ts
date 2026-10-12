import { describe, expect, it } from 'vitest';

import { lookupChoju } from './choju-result.js';

describe('lookupChoju', () => {
  it('生まれ年から長寿祝いを迎える年を返す', () => {
    const result = lookupChoju(1966);

    expect(result).toMatchObject({ kind: 'ok', birthYear: 1966 });
    expect(result.kind === 'ok' && result.years[0]).toMatchObject({
      choju: { name: '還暦' },
      kazoedoshiYear: 2026,
      fullAgeYear: 2026,
    });
  });

  it('年が未入力なら empty を返す', () => {
    expect(lookupChoju(null)).toEqual({ kind: 'empty' });
  });

  it('入力欄の範囲(1〜9999)外の年はエラーを返す', () => {
    expect(lookupChoju(0)).toMatchObject({ kind: 'error' });
    expect(lookupChoju(10000)).toMatchObject({ kind: 'error' });
  });
});
