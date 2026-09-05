import { defineConfig, devices } from '@playwright/test';

const LOCAL_URL = 'http://localhost:8787';

// E2E_BASE_URL を渡すと、Cloudflare のプレビュー環境など任意のデプロイ先に対して
// 同じスペックをそのまま実行できる(指定時はローカルサーバーを起動しない)
const externalBaseURL = process.env['E2E_BASE_URL'];
const isCI = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: externalBaseURL ?? LOCAL_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /visual\.spec\.ts/u,
    },
    {
      // ビジュアル比較はフォントのレンダリング差を避けるため Playwright 公式イメージ上で
      // 実行する。スナップショットの更新は scripts/visual-snapshots.sh
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /visual\.spec\.ts/u,
      // 撮り直しても差分は変わらないため、失敗時に 2 回撮らない
      retries: 0,
    },
  ],
  // exactOptionalPropertyTypes 下では webServer に undefined を代入できないため、
  // キー自体を生やさない形で分岐する
  ...(externalBaseURL === undefined
    ? {
        webServer: {
          // ビルド成果物を配信するため、事前に npm run build が済んでいる必要がある
          command: 'npm run preview -- --port 8787',
          url: LOCAL_URL,
          // 直前の npm run build の成果物ではなく、立てっぱなしの別プロセスに対して
          // テストしてしまうのを防ぐ(scripts/visual-snapshots.sh と方針を揃える)
          reuseExistingServer: false,
          timeout: 120_000,
          env: { WRANGLER_SEND_METRICS: 'false' },
        },
      }
    : {}),
});
