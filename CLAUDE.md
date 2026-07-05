# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

2g14.com — 各種ツール・コンテンツを提供する個人サイト。HonoX + Cloudflare Workers で SSR/SPA ハイブリッド構成。

## Commands

```bash
npm run dev          # 開発サーバー起動 (Vite)
npm run build        # プロダクションビルド (client → server の2段階)
npm run preview      # wrangler dev でビルド済みアセットをプレビュー
npm run deploy       # build + wrangler deploy
npm run typecheck    # tsc --noEmit
npm run lint         # oxlint
npm run lint:fix     # oxlint --fix
npm run format       # oxfmt --write .
npm run format:check # oxfmt --check .
npm run test         # vitest (watch mode)
npx vitest run       # テスト1回実行
npx vitest run src/domain/wareki/era.test.ts  # 単一ファイルテスト
```

## Architecture

### Tech Stack

- **Framework**: HonoX (Hono SSR framework) + Vite
- **Runtime**: Cloudflare Workers
- **Styling**: Tailwind CSS v4 + daisyUI
- **Linter/Formatter**: oxlint + oxfmt (スペースインデント、シングルクォート、行幅100)
- **Testing**: Vitest
- **JSX**: Hono JSX (`jsxImportSource: "hono/jsx"`)

### Directory Structure

- `app/` — HonoX アプリケーション層（ルーティング・レンダリング）
  - `routes/` — ファイルベースルーティング（HonoX 規約）
  - `server.ts` — Hono アプリエントリポイント
  - `client.ts` — クライアントサイド hydration
  - `style.css` — Tailwind エントリポイント + テーマ変数
- `src/` — ドメインロジック（フレームワーク非依存）
- パスエイリアス: `package.json` の `imports` フィールドで定義（`#src/` → `./src/`, `#app/` → `./app/`）

## Conventions

- ルート追加は `app/routes/` 配下にファイルを置く（HonoX ファイルベースルーティング）
- ドメインロジックは `src/domain/` に置き、HonoX/Hono に依存させない
- テストファイルは対象ファイルと同じディレクトリに `*.test.ts` で配置
- `lang="ja"` が `_renderer.tsx` で設定済み
- ドメインモデルでは Branded types を使いファクトリ関数経由でバリデーション済みオブジェクトを保証する
