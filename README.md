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
```

## Docker Sandbox

Claude Code を Docker Sandbox で動かす設定がリポ直下の `sbxenv.yaml` と `.sandbox/` にある。
使い方は [.sandbox/README.md](.sandbox/README.md) を参照。
