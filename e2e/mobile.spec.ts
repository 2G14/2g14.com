import { devices, expect, test, type Page } from '@playwright/test';

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

  // サイドバーの目次は hidden md:block でモバイルでは出ない
  await expect(page.locator('aside')).toBeHidden();
  await expect(tocToggle(page)).toBeVisible();
});

test('対比表のドロワーを開いて元号セクションへ移動できる', async ({ page }) => {
  await page.goto('/contents/wareki/comparison-table');

  await tocToggle(page).click();

  const drawer = page.getByRole('heading', { level: 2, name: '目次' });
  await expect(drawer).toBeVisible();

  await page.getByRole('link', { name: '昭和' }).last().click();

  await expect.poll(() => decodeURIComponent(page.url())).toContain('#昭和');
});

test('モバイル幅でも西暦→和暦の変換が操作できる', async ({ page }) => {
  await page.goto('/contents/wareki/convert-from-seireki?year=2020&month=5&day=15');

  await expect(page.getByText('令和2年5月15日')).toBeVisible();

  const year = page.getByRole('spinbutton').nth(0);
  await expect(async () => {
    await year.fill('1990');
    await expect(page.getByText('平成2年5月15日')).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
});

test('モバイル幅でもカレンダーから日付を選べる', async ({ page }) => {
  await page.goto('/contents/wareki/convert-from-seireki?year=2020&month=5&day=15');

  const toggle = page.getByTitle('カレンダーで選択');
  await expect(async () => {
    await toggle.click();
    await expect(page.getByRole('button', { name: '次月' })).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await page.getByRole('button', { name: '20', exact: true }).click();

  await expect(page.getByText('令和2年5月20日')).toBeVisible();
});
