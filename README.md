# 2g14.com

各種ツール・コンテンツを提供する個人サイト。

## Tech Stack

- **Framework**: HonoX (Hono SSR framework) + Vite
- **Runtime**: Cloudflare Workers
- **Styling**: Tailwind CSS v4 + daisyUI
- **Linter/Formatter**: oxlint + oxfmt
- **Testing**: Vitest

## Commands

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # wrangler dev でプレビュー
npm run deploy       # build + wrangler deploy
npm run typecheck    # 型チェック
npm run lint         # リント
npm run format       # フォーマット
npm run test         # テスト (watch mode)
npm run test:e2e     # Playwright で e2e テスト (build + wrangler dev)
npm run test:visual  # ビジュアル比較 (Docker 上で実行)
npm run test:visual:update  # ビジュアル比較の基準スナップショットを更新
```
