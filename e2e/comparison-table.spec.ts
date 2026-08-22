import { expect, test } from '@playwright/test';

const PATH = '/contents/wareki/comparison-table';
const ALL_ERAS = ['令和', '平成', '昭和', '大正', '明治'] as const;

test('クエリなしで全元号のセクションが表示される', async ({ page }) => {
  await page.goto(PATH);

  for (const era of ALL_ERAS) {
    await expect(page.getByRole('heading', { level: 2, name: era })).toBeVisible();
  }
});

test('元号を漢字・かな・英語・略称のいずれで指定しても同じ元号に絞り込まれる', async ({ page }) => {
  for (const param of ['平成', 'へいせい', 'Heisei', 'H']) {
    await page.goto(`${PATH}?era=${encodeURIComponent(param)}`);

    await expect(page.getByRole('heading', { level: 2, name: '平成' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: '令和' })).toHaveCount(0);
  }
});

test('絞り込んだ元号の対比表に開始年と終了年の行が並ぶ', async ({ page }) => {
  await page.goto(`${PATH}?era=${encodeURIComponent('平成')}`);

  const table = page.getByRole('table');

  const rowOf = (seireki: string) =>
    table.getByRole('row').filter({ has: page.getByRole('cell', { name: seireki, exact: true }) });

  // 平成は 1989-01-08 開始、令和の開始年 2019 までを含む
  await expect(rowOf('1989年').getByRole('cell').first()).toHaveText('1年');
  await expect(rowOf('2019年').getByRole('cell').first()).toHaveText('31年');
});

test('未知の元号を指定すると絞り込みなしのページへリダイレクトされる', async ({ page }) => {
  await page.goto(`${PATH}?era=unknown-era`);

  await expect(page).toHaveURL(new RegExp(`${PATH}$`, 'u'));
  await expect(page.getByRole('heading', { level: 2, name: '令和' })).toBeVisible();
});

test('目次のリンクから元号セクションへアンカー移動できる', async ({ page }) => {
  await page.goto(PATH);

  await page.getByRole('link', { name: '昭和' }).first().click();

  // ハッシュは percent-encoding されるため、デコードして比較する
  await expect.poll(() => decodeURIComponent(page.url())).toContain('#昭和');
});
