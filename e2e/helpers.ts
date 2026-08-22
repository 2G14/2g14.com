import { expect, type Locator, type Page } from '@playwright/test';

// hydration の完了を知る手段がないため、島が反応するまでの猶予として使う
const HYDRATION_TIMEOUT = 15_000;

/**
 * hydration 完了前の操作は island の state に届かないため、
 * 期待する表示が現れるまで操作をやり直す
 */
export async function actUntil(act: () => Promise<unknown>, expected: Locator): Promise<void> {
  await expect(async () => {
    await act();
    await expect(expected).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: HYDRATION_TIMEOUT });
}

export async function fillUntil(input: Locator, value: string, expected: Locator): Promise<void> {
  await actUntil(() => input.fill(value), expected);
}

interface DateInputs {
  year: Locator;
  month: Locator;
  day: Locator;
}

/** 日付ピッカーを開く。開閉に使うトグルを返す */
export async function openCalendar(page: Page): Promise<Locator> {
  const toggle = page.getByRole('button', { name: 'カレンダーで選択' });

  await actUntil(() => toggle.click(), page.getByRole('button', { name: '次月' }));

  return toggle;
}

export function dateInputs(page: Page): DateInputs {
  const inputs = page.getByRole('spinbutton');
  return { year: inputs.nth(0), month: inputs.nth(1), day: inputs.nth(2) };
}
