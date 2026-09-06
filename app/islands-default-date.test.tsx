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
  process.env['TZ'] = ORIGINAL_TZ;
});

// islands は素の new Date() を使っており、修正されると成功して落ちる(issue #27)
test.fails('クエリなしの西暦→和暦は JST の今日を初期値にする', async () => {
  const { month, day } = todayInJST();

  const html = await (<SeirekiToWarekiConverter />).toString();

  expect(html).toContain(`${month}月${day}日`);
});

test.fails('クエリなしの和暦→西暦は JST の今日を初期値にする', async () => {
  const { year, month, day } = todayInJST();

  const html = await (<WarekiToSeirekiConverter />).toString();

  expect(html).toContain(`${year}年${month}月${day}日`);
});
