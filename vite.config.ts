import build from '@hono/vite-build/cloudflare-workers';
import adapter from '@hono/vite-dev-server/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import honox from 'honox/vite';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: { input: ['/app/client.ts', '/app/style.css'] },
    }),
    tailwindcss(),
    build(),
  ],
  test: {
    // e2e/ は Playwright が実行する。.claude/worktrees/ は作業用の複製で、
    // 放置すると同じテストが worktree の数だけ多重実行される
    exclude: [...configDefaults.exclude, 'e2e/**', '.claude/**'],
  },
});
