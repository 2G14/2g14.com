import { afterAll, beforeAll, expect, test, vi } from 'vitest';

import SeirekiToWarekiConverter from '#app/islands/seireki-to-wareki-converter.js';
import WarekiToSeirekiConverter from '#app/islands/wareki-to-seireki-converter.js';
import { todayInJST } from '#src/lib/date.js';

// Workers は UTC で動くため、JST の 00:00〜09:00 は UTC ではまだ前日にあたる
const JST_EARLY_MORNING = new Date('2026-09-05T19:00:00Z');
const ORIGINAL_TZ = process.env['TZ'];

beforeAll(() => {
  process.env['TZ'] = 'UTC';
  vi.useFakeTimers();
  vi.setSystemTime(JST_EARLY_MORNING);
});

afterAll(() => {
  vi.useRealTimers();
  // process.env への代入は文字列化されるため、未設定だった場合は "undefined" が入る
  if (ORIGINAL_TZ === undefined) {
    delete process.env['TZ'];
  } else {
    process.env['TZ'] = ORIGINAL_TZ;
  }
});

// islands は素の new Date() を使うため、TZ=UTC では JST の前日を初期値にする。
// issue #27 が直るとここが落ちるので、そのとき期待値を todayInJST() 側へ入れ替える。
// test.fails ではなく正で書くのは、import や描画が壊れた場合も検知するため
test('クエリなしの西暦→和暦は UTC の今日を初期値にしてしまう', async () => {
  const jst = todayInJST();

  const html = await (<SeirekiToWarekiConverter />).toString();

  expect(html).toContain('9月5日');
  expect(html).not.toContain(`${jst.month}月${jst.day}日`);
});

test('クエリなしの和暦→西暦は UTC の今日を初期値にしてしまう', async () => {
  const jst = todayInJST();

  const html = await (<WarekiToSeirekiConverter />).toString();

  expect(html).toContain('2026年9月5日');
  expect(html).not.toContain(`${jst.year}年${jst.month}月${jst.day}日`);
});
