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
    include: ['src/**/*.test.ts', 'app/**/*.test.{ts,tsx}'],
  },
});
