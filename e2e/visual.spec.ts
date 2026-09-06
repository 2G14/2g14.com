import { devices, expect, test, type Page } from '@playwright/test';

// スナップショットはフォントのレンダリングが OS で変わるため、CI と同じ Linux で
// 生成したものだけを基準として管理する。更新は scripts/visual-snapshots.sh
test.skip(
  process.platform !== 'linux',
  'ビジュアル比較は Linux で生成したスナップショットを基準にしている',
);

const { defaultBrowserType: _defaultBrowserType, ...pixel5 } = devices['Pixel 5'];

const PAGES = [
  { name: 'top', path: '/' },
  { name: 'wareki-index', path: '/contents/wareki' },
  {
    name: 'today',
    path: '/contents/wareki/today',
    // 日付そのものは毎日変わるため隠す。visibility で文字を消したうえで
    // mask で領域を塗る。visibility だけだと白地に溶けて大きさの変化が写らず、
    // mask だけだと line-height からはみ出したグリフが矩形の外に残る。
    // クラスで指すとマークアップ変更で対象から外れ、翌日に落ちる
    hideSelectors: [
      '[data-testid="today-wareki-year"]',
      '[data-testid="today-wareki-date"]',
      '[data-testid="today-seireki"]',
    ],
  },
  {
    name: 'comparison-table',
    // 令和は現在年まで行が伸びるため、確定済みの元号に絞る
    path: '/contents/wareki/comparison-table?era=%E5%B9%B3%E6%88%90',
  },
  {
    name: 'convert-from-seireki',
    path: '/contents/wareki/convert-from-seireki?year=2020&month=5&day=15',
  },
  {
    name: 'convert-to-seireki',
    path: '/contents/wareki/convert-to-seireki?era=%E5%B9%B3%E6%88%90&year=10&month=5&day=1',
  },
] as const;

async function settle(page: Page) {
  // toHaveScreenshot 自体が連続フレームの安定まで待つため、フォントの読み込みだけ待てばよい
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

const SCREENSHOT_OPTIONS = {
  // 折り返し以下も比較したいので全体を撮る。日付に依存する行数は
  // クエリで確定させてあるため高さは安定する
  fullPage: true,
  // 生成と比較を同じイメージ上で行うためレンダリングは再現する。
  // 割合で許容すると見出し 1 つ分の変化を見逃すので、実ピクセル数で絞る
  maxDiffPixels: 100,
} as const;

async function hide(page: Page, selectors: readonly string[]) {
  if (selectors.length === 0) return;

  await page.addStyleTag({
    content: selectors.map((selector) => `${selector} { visibility: hidden; }`).join('\n'),
  });
}

function definePageSnapshots(suffix: 'desktop' | 'mobile') {
  for (const entry of PAGES) {
    test(`${entry.name} の外観`, async ({ page }) => {
      await page.goto(entry.path);
      await settle(page);
      const hidden = 'hideSelectors' in entry ? entry.hideSelectors : [];
      await hide(page, hidden);

      await expect(page).toHaveScreenshot(`${entry.name}-${suffix}.png`, {
        ...SCREENSHOT_OPTIONS,
        mask: hidden.map((selector) => page.locator(selector)),
      });
    });
  }
}

test.describe('デスクトップ', () => {
  definePageSnapshots('desktop');
});

test.describe('モバイル', () => {
  // defaultBrowserType だけは describe 内で指定できないため除いている。
  // isMobile / hasTouch が欠けると (hover: hover) や (pointer: coarse) が実機と逆に評価される
  test.use(pixel5);

  definePageSnapshots('mobile');
});
