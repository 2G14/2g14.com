import { describe, expect, it } from 'vitest';

import { parseYearInput } from './year-input.js';

describe('parseYearInput', () => {
  it('入力欄の範囲(1〜9999)の整数はそのまま返す', () => {
    expect(parseYearInput(1)).toEqual({ kind: 'ok', year: 1 });
    expect(parseYearInput(9999)).toEqual({ kind: 'ok', year: 9999 });
  });

  it('未入力なら empty を返す', () => {
    expect(parseYearInput(null)).toEqual({ kind: 'empty' });
  });

  it('非整数や範囲外の年はエラーを返す', () => {
    expect(parseYearInput(2026.5)).toMatchObject({ kind: 'error' });
    expect(parseYearInput(0)).toMatchObject({ kind: 'error' });
    expect(parseYearInput(10000)).toMatchObject({ kind: 'error' });
  });
});
