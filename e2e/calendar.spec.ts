import { expect, test } from '@playwright/test';

const FROM_SEIREKI = '/contents/wareki/convert-from-seireki';

test('カレンダーボタンで日付ピッカーを開閉できる', async ({ page }) => {
  await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=1`);

  const toggle = page.getByTitle('カレンダーで選択');
  const nextMonth = page.getByRole('button', { name: '次月' });

  await expect(nextMonth).toHaveCount(0);

  await expect(async () => {
    await toggle.click();
    await expect(nextMonth).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await toggle.click();
  await expect(nextMonth).toHaveCount(0);
});

test('カレンダーで日付を選ぶと入力欄と変換結果に反映される', async ({ page }) => {
  await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=1`);

  const toggle = page.getByTitle('カレンダーで選択');
  await expect(async () => {
    await toggle.click();
    await expect(page.getByRole('button', { name: '次月' })).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await page.getByRole('button', { name: '15', exact: true }).click();

  await expect(page.getByRole('spinbutton').nth(2)).toHaveValue('15');
  await expect(page.getByText('令和2年5月15日')).toBeVisible();
});

test('月送りボタンでカレンダーの表示月が変わる', async ({ page }) => {
  await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=1`);

  const toggle = page.getByTitle('カレンダーで選択');
  await expect(async () => {
    await toggle.click();
    await expect(page.getByRole('button', { name: '次月' })).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  const day31 = page.getByRole('button', { name: '31', exact: true });

  await expect(page.getByRole('button', { name: '2020年' })).toBeVisible();
  await expect(day31).toBeVisible();

  // 6月は30日までなので、31日のセルが消えることで表示月の変化を確認する
  await page.getByRole('button', { name: '次月' }).click();
  await expect(day31).toHaveCount(0);

  await page.getByRole('button', { name: '前月' }).click();
  await expect(day31).toBeVisible();
});

test('明治より前へは月送りできない', async ({ page }) => {
  await page.goto(`${FROM_SEIREKI}?year=1868&month=9&day=8`);

  const toggle = page.getByTitle('カレンダーで選択');
  await expect(async () => {
    await toggle.click();
    await expect(page.getByRole('button', { name: '前月' })).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await expect(page.getByRole('button', { name: '前月' })).toBeDisabled();
});
