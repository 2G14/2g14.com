import { describe, expect, it } from 'vitest';
import { ERAS } from './era.js';

describe('ERAS', () => {
  it('降順ソートされていること', () => {
    // 比較用の連続数値 (YYYYMMDD) を作るヘルパー
    const keyOf = (e: { start: { year: number; month: number; day: number } }) =>
      e.start.year * 10000 + e.start.month * 100 + e.start.day;

    // ERAS をコピーして降順でソートした結果と元の ERAS を比較する
    const sorted = [...ERAS].sort((a, b) => keyOf(b) - keyOf(a));
    expect(sorted).toEqual(ERAS);
  });
});
