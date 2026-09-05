/// <reference types="vitest/config" />
import build from '@hono/vite-build/cloudflare-workers';
import adapter from '@hono/vite-dev-server/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import honox from 'honox/vite';
import { defineConfig } from 'vite';

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
    // ドメインロジックのテストだけを対象にする。既定の include は全階層を舐めるため、
    // Playwright の e2e/*.spec.ts と .claude/worktrees/ 配下の複製まで拾ってしまう
    include: ['src/**/*.test.ts'],
  },
});
