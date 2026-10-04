import { afterEach, describe, expect, it, vi } from 'vitest';

import { replaceUrlQuery } from './url.js';

function stubLocation(pathname: string) {
  const replaceState = vi.fn();
  vi.stubGlobal('window', { location: { pathname } });
  vi.stubGlobal('history', { replaceState });
  return replaceState;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('replaceUrlQuery', () => {
  it('クエリ文字列を現在のパスに付けて置き換える', () => {
    const replaceState = stubLocation('/contents/wareki/convert-to-seireki');

    replaceUrlQuery('year=2026&month=7');

    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/contents/wareki/convert-to-seireki?year=2026&month=7',
    );
  });

  it('クエリが空なら ? を付けない', () => {
    const replaceState = stubLocation('/contents/wareki/convert-to-seireki');

    replaceUrlQuery('');

    expect(replaceState).toHaveBeenCalledWith(null, '', '/contents/wareki/convert-to-seireki');
  });
});
