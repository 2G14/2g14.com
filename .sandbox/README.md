# Docker Sandbox 環境

Claude Code を Docker Sandbox (clone mode) で動かすための template + kit 一式。

## 構成

| ファイル                          | 役割                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Dockerfile` / `mise-config.toml` | template。`claude-code-minimal` ベースに mise 経由で node 24 / npm / gh を焼き込み、git を apt で最新化 |
| `agent-kit/`                      | sandbox kit(汎用)。built-in claude を継承し YOLO なしで起動する                                        |
| `project-kit/`                    | mixin kit(このリポ固有)。`mise.jdx.dev` の許可と agentInstructions を注入                              |
| `sandbox.sh`                      | build / run のラッパー                                                                                  |

## 初回セットアップ(一度だけ)

```bash
# GitHub トークンを登録(proxy が代理認証。実トークンはサンドボックスに入らない)
sbx secret set github

# Anthropic 認証が未登録なら
sbx secret set anthropic
```

## 使い方

```bash
.sandbox/sandbox.sh build   # イメージをビルドし sbx ランタイムへロード
.sandbox/sandbox.sh run     # clone mode で起動
```

- 依存はインストールされないため、セッション冒頭に `npm install` を実行する
  (agentInstructions でエージェントにも指示済み)
- エージェントのコミットはホスト側の `sandbox-<name>` git リモートから取り込める

## YOLO モードについて

sbx の built-in claude は `--dangerously-skip-permissions`(YOLO)付きで
起動するため、`agent-kit/` で `extends: claude` してフラグを差し替えている。
`extends` により OAuth 認証とエージェント設定の生成は built-in のまま継承される。

書き換えで踏みやすい点が2つある:

- kit の `name:` を数字で始めると、`unknown agent ...
  (built-in agents only in this release)` という無関係なエラーで拒否される
- `command` に空配列を置くと未指定として親の YOLO フラグを継承してしまうため、
  非空の引数で上書きする必要がある

## ツールの更新

バージョンは `mise-config.toml` で管理(node はメジャー固定、gh は
ビルド時点の latest で固定)。更新は編集後に `build` を再実行する。
