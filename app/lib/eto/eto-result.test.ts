import { describe, expect, it } from 'vitest';

import { lookupEto } from './eto-result.js';

describe('lookupEto', () => {
  it('西暦年の干支と前後 24 年の同じ十二支の年を返す', () => {
    const result = lookupEto(2026);

    expect(result).toMatchObject({ kind: 'ok', year: 2026, eto: { kanji: '丙午' } });
    expect(result.kind === 'ok' && result.sameJunishiYears).toEqual([2050, 2038, 2026, 2014, 2002]);
  });

  it('年が未入力なら empty を返す', () => {
    expect(lookupEto(null)).toEqual({ kind: 'empty' });
  });

  it('入力欄の範囲(1〜9999)外の年はエラーを返す', () => {
    expect(lookupEto(0)).toMatchObject({ kind: 'error' });
    expect(lookupEto(10000)).toMatchObject({ kind: 'error' });
    expect(lookupEto(1e21)).toMatchObject({ kind: 'error' });
  });

  it('整数でない年はエラーを返す', () => {
    expect(lookupEto(2026.5)).toMatchObject({ kind: 'error' });
  });
});
