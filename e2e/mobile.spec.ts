import { devices, expect, test, type Page } from '@playwright/test';

import { dateInputs, fillUntil, openCalendar } from './helpers.js';

test.use({ ...devices['Pixel 5'] });

const PATHS = [
  '/',
  '/contents/wareki',
  '/contents/wareki/today',
  '/contents/wareki/comparison-table',
  '/contents/wareki/convert-from-seireki?year=2020&month=5&day=15',
  '/contents/wareki/convert-to-seireki?era=%E5%B9%B3%E6%88%90&year=10&month=5&day=1',
] as const;

for (const path of PATHS) {
  test(`${path} がモバイル幅で横スクロールしない`, async ({ page }) => {
    await page.goto(path);

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(overflows).toBe(false);
  });
}

// ドロワーの開閉は daisyUI 流に <label for> + checkbox で組まれており、
// label は button role を持たないためテキストで取る
const tocToggle = (page: Page) => page.getByRole('banner').getByText('目次');

test('対比表の目次がドロワーに収まり、サイドバーは表示されない', async ({ page }) => {
  await page.goto('/contents/wareki/comparison-table');

  // サイドバーの目次は hidden md:block でモバイルでは出ない。
  // toBeHidden は要素そのものが無くても通るため、存在も併せて確かめる
  await expect(page.locator('aside')).toHaveCount(1);
  await expect(page.locator('aside')).toBeHidden();
  await expect(tocToggle(page)).toBeVisible();
});

test('対比表のドロワーを開いて元号セクションへ移動できる', async ({ page }) => {
  await page.goto('/contents/wareki/comparison-table');

  const drawer = page.getByRole('heading', { level: 2, name: '目次' });
  await expect(drawer).toHaveCount(0);

  await tocToggle(page).click();

  await expect(drawer).toBeVisible();

  await page.getByRole('link', { name: '昭和' }).last().click();

  await expect.poll(() => decodeURIComponent(page.url())).toContain('#昭和');
});

test('モバイル幅でも西暦→和暦の変換が操作できる', async ({ page }) => {
  await page.goto('/contents/wareki/convert-from-seireki?year=2020&month=5&day=15');

  await expect(page.getByText('令和2年5月15日')).toBeVisible();

  await fillUntil(dateInputs(page).year, '1990', page.getByText('平成2年5月15日'));
});

test('モバイル幅でもカレンダーから日付を選べる', async ({ page }) => {
  await page.goto('/contents/wareki/convert-from-seireki?year=2020&month=5&day=15');

  await openCalendar(page);

  await page.getByRole('button', { name: '20', exact: true }).click();

  await expect(page.getByText('令和2年5月20日')).toBeVisible();
});
