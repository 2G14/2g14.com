import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', title: '2g14.com', heading: '2g14.com' },
  { path: '/contents/wareki', title: '和暦ツール', heading: '和暦ツール' },
  {
    path: '/contents/wareki/today',
    title: '本日の和暦 - 今日の日付を和暦で表示',
    heading: '本日の和暦',
  },
  {
    path: '/contents/wareki/comparison-table',
    title: '和暦/西暦 対比表 - 元号別の年号一覧',
    heading: '和暦/西暦 対比表',
  },
  {
    path: '/contents/wareki/convert-from-seireki',
    title: '西暦→和暦 変換 - 西暦の日付を和暦に変換',
    heading: '西暦→和暦 変換',
  },
  {
    path: '/contents/wareki/convert-to-seireki',
    title: '和暦→西暦 変換 - 和暦の日付を西暦に変換',
    heading: '和暦→西暦 変換',
  },
] as const;

for (const { path, title, heading } of PAGES) {
  test(`${path} が 200 を返し、タイトルと見出しが表示される`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  });
}

test('HTML シェルが lang="ja" で描画される', async ({ page }) => {
  await page.goto('/contents/wareki');

  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
});

test('存在しないパスが 404 を返す', async ({ page }) => {
  const response = await page.goto('/no-such-page');

  expect(response?.status()).toBe(404);
});

const WAREKI_LINKS = [
  { label: '本日の和暦', path: '/contents/wareki/today' },
  { label: '和暦/西暦 対比表', path: '/contents/wareki/comparison-table' },
  { label: '西暦→和暦 変換', path: '/contents/wareki/convert-from-seireki' },
  { label: '和暦→西暦 変換', path: '/contents/wareki/convert-to-seireki' },
] as const;

for (const { label, path } of WAREKI_LINKS) {
  test(`和暦ツールの一覧から「${label}」へ遷移できる`, async ({ page }) => {
    await page.goto('/contents/wareki');

    await page.getByRole('link', { name: label }).click();

    await expect(page).toHaveURL(new RegExp(`${path}$`, 'u'));
  });
}

test('コンテンツページに description と canonical が出力される', async ({ page }) => {
  await page.goto('/contents/wareki/today');

  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /今日の日付を和暦/u,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/contents\/wareki\/today$/u,
  );
});
