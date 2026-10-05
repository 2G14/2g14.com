import { afterAll, beforeAll, expect, test, vi } from 'vitest';

import SeirekiToWarekiConverter from '#app/islands/wareki/seireki-to-wareki-converter.js';
import WarekiToSeirekiConverter from '#app/islands/wareki/wareki-to-seireki-converter.js';

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

test('クエリなしの西暦→和暦は JST の今日を初期値にする', async () => {
  const html = await (<SeirekiToWarekiConverter />).toString();

  expect(html).toContain('9月6日');
});

test('クエリなしの和暦→西暦は JST の今日を初期値にする', async () => {
  const html = await (<WarekiToSeirekiConverter />).toString();

  expect(html).toContain('2026年9月6日');
});
