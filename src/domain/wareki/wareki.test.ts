import { describe, expect, it } from 'vitest';

import { createWareki, InvalidWarekiError } from './wareki.js';

describe('wareki', () => {
  it('createWareki: 正常に作成できる', () => {
    const w = createWareki({ era: '令和', year: 1, month: 5, day: 1 });
    expect(w).toEqual({ era: '令和', year: 1, month: 5, day: 1 });
  });

  it('createWareki: 元号年が1未満はエラー', () => {
    expect(() => createWareki({ era: '令和', year: 0, month: 1, day: 1 })).toThrow(
      InvalidWarekiError,
    );
  });

  it('createWareki: 元号開始日より前はエラーになる', () => {
    // 令和1年4月30日は存在しない
    expect(() => createWareki({ era: '令和', year: 1, month: 4, day: 30 })).toThrow(
      InvalidWarekiError,
    );
  });
});
