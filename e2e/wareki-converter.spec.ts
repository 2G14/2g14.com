import { expect, test } from '@playwright/test';

import { actUntil, dateInputs, fillUntil } from './helpers.js';

const FROM_SEIREKI = '/contents/wareki/convert-from-seireki';
const TO_SEIREKI = '/contents/wareki/convert-to-seireki';

test.describe('西暦→和暦 変換', () => {
  test('クエリで渡した日付が入力欄と変換結果に反映される', async ({ page }) => {
    await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=1`);

    const { year, month, day } = dateInputs(page);
    await expect(year).toHaveValue('2020');
    await expect(month).toHaveValue('5');
    await expect(day).toHaveValue('1');
    await expect(page.getByText('令和2年5月1日')).toBeVisible();
  });

  test('年を入力し直すと変換結果が更新される', async ({ page }) => {
    await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=1`);

    const { year } = dateInputs(page);
    await fillUntil(year, '1990', page.getByText('平成2年5月1日'));
  });

  test('入力の変更に追随して URL のクエリが書き換わる', async ({ page }) => {
    await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=1`);

    const { year } = dateInputs(page);
    await fillUntil(year, '1990', page.getByText('平成2年5月1日'));

    await expect(page).toHaveURL(/year=1990/u);
    await expect(page).toHaveURL(/month=5/u);
  });

  test('明治より前の日付でエラーが表示される', async ({ page }) => {
    await page.goto(`${FROM_SEIREKI}?year=1800&month=1&day=1`);

    await expect(page.getByRole('alert')).toHaveText('明治以前の日付は変換できません。');
  });

  test('逆変換リンクから和暦→西暦へ変換結果を引き継いで遷移できる', async ({ page }) => {
    // 月/日が 1 のときクエリが省略され、遷移先が「今日」を初期値にしてしまうため
    // 往復が壊れる(https://github.com/2G14/2g14.com/issues/25)。ここでは 15 日で確認する
    await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=15`);
    await expect(page.getByText('令和2年5月15日')).toBeVisible();

    await page.getByRole('link', { name: '逆変換' }).click();

    await expect(page).toHaveURL(new RegExp(`${TO_SEIREKI}\\?`, 'u'));
    await expect(page.getByRole('combobox', { name: '元号' })).toHaveValue('令和');
    const { year, month, day } = dateInputs(page);
    await expect(year).toHaveValue('2');
    await expect(month).toHaveValue('5');
    await expect(day).toHaveValue('15');
    await expect(page.getByText('2020年5月15日')).toBeVisible();
  });
});

test.describe('和暦→西暦 変換', () => {
  test('クエリで渡した和暦が入力欄と変換結果に反映される', async ({ page }) => {
    await page.goto(`${TO_SEIREKI}?era=${encodeURIComponent('平成')}&year=1&month=1&day=8`);

    await expect(page.getByRole('combobox', { name: '元号' })).toHaveValue('平成');
    await expect(page.getByText('1989年1月8日')).toBeVisible();
  });

  test('元号を切り替えると変換結果が更新される', async ({ page }) => {
    await page.goto(`${TO_SEIREKI}?era=${encodeURIComponent('平成')}&year=10&month=5&day=1`);
    await expect(page.getByText('1998年5月1日')).toBeVisible();

    await actUntil(
      () => page.getByRole('combobox', { name: '元号' }).selectOption('昭和'),
      page.getByText('1935年5月1日'),
    );
  });

  test('入力の変更に追随して URL のクエリが書き換わる', async ({ page }) => {
    await page.goto(`${TO_SEIREKI}?era=${encodeURIComponent('平成')}&year=10&month=5&day=1`);

    await fillUntil(dateInputs(page).year, '20', page.getByText('2008年5月1日'));

    await expect(page).toHaveURL(/year=20/u);
    await expect(page).toHaveURL(new RegExp(`era=${encodeURIComponent('平成')}`, 'u'));
  });

  test('逆変換リンクから西暦→和暦へ変換結果を引き継いで遷移できる', async ({ page }) => {
    await page.goto(`${TO_SEIREKI}?era=${encodeURIComponent('平成')}&year=10&month=5&day=15`);
    await expect(page.getByText('1998年5月15日')).toBeVisible();

    await page.getByRole('link', { name: '逆変換' }).click();

    await expect(page).toHaveURL(new RegExp(`${FROM_SEIREKI}\\?`, 'u'));
    const { year, month, day } = dateInputs(page);
    await expect(year).toHaveValue('1998');
    await expect(month).toHaveValue('5');
    await expect(day).toHaveValue('15');
    await expect(page.getByText('平成10年5月15日')).toBeVisible();
  });

  test('その元号に存在しない日付でエラーが表示される', async ({ page }) => {
    // 令和は 2019-05-01 開始で、令和1年1月1日は存在しない
    await page.goto(`${TO_SEIREKI}?era=${encodeURIComponent('令和')}&year=1&month=1&day=1`);

    await expect(page.getByRole('alert')).toContainText('令和');
  });
});

test('月/日が 1 でも逆変換の往復で日付が保たれる', async ({ page }) => {
  // #25 が直るまで失敗する。修正されると「予期せず成功した」で落ちるので気づける
  test.fail();

  await page.goto(`${FROM_SEIREKI}?year=2020&month=1&day=1`);
  await expect(page.getByText('令和2年1月1日')).toBeVisible();

  await page.getByRole('link', { name: '逆変換' }).click();

  await expect(page.getByText('2020年1月1日')).toBeVisible();
});

test.describe('JavaScript 無効時', () => {
  test.use({ javaScriptEnabled: false });

  test('SSR だけで変換結果が表示される', async ({ page }) => {
    await page.goto(`${FROM_SEIREKI}?year=2020&month=5&day=1`);

    await expect(page.getByText('令和2年5月1日')).toBeVisible();
  });

  test('SSR だけで和暦→西暦の変換結果が表示される', async ({ page }) => {
    await page.goto(`${TO_SEIREKI}?era=${encodeURIComponent('平成')}&year=1&month=1&day=8`);

    await expect(page.getByText('1989年1月8日')).toBeVisible();
  });
});
