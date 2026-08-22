import { expect, test, type Page } from '@playwright/test';

// スナップショットはフォントのレンダリングが OS で変わるため、CI と同じ Linux で
// 生成したものだけを基準として管理する。更新は scripts/visual-snapshots.sh
test.skip(
  process.platform !== 'linux',
  'ビジュアル比較は Linux で生成したスナップショットを基準にしている',
);

const PAGES = [
  { name: 'top', path: '/' },
  { name: 'wareki-index', path: '/contents/wareki' },
  {
    name: 'today',
    path: '/contents/wareki/today',
    // 日付表示は毎日変わるため、レイアウトだけを見て中身は隠す
    maskSelector: 'div.flex.flex-col.items-center',
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
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

function screenshotOptions(page: Page, maskSelector: string | undefined) {
  return {
    mask: maskSelector === undefined ? [] : [page.locator(maskSelector)],
    // 文字のアンチエイリアスによる微差を許容する
    maxDiffPixelRatio: 0.01,
  };
}

test.describe('デスクトップ', () => {
  for (const entry of PAGES) {
    test(`${entry.name} の外観`, async ({ page }) => {
      await page.goto(entry.path);
      await settle(page);

      await expect(page).toHaveScreenshot(
        `${entry.name}-desktop.png`,
        screenshotOptions(page, 'maskSelector' in entry ? entry.maskSelector : undefined),
      );
    });
  }
});

test.describe('モバイル', () => {
  // devices[...] は defaultBrowserType を含み describe 内では指定できないため、
  // ビジュアル比較で意味を持つビューポートだけを指定する(Pixel 5 相当)
  test.use({ viewport: { width: 393, height: 851 } });

  for (const entry of PAGES) {
    test(`${entry.name} の外観`, async ({ page }) => {
      await page.goto(entry.path);
      await settle(page);

      await expect(page).toHaveScreenshot(
        `${entry.name}-mobile.png`,
        screenshotOptions(page, 'maskSelector' in entry ? entry.maskSelector : undefined),
      );
    });
  }
});
