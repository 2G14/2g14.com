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
```

Anthropic の OAuth は `sbx secret set` からは開始できず、サンドボックス内の
Claude で `/login` してサインインする。proxy がトークンをホスト側に保存し、
サンドボックス内にはダミー値だけが残る。

初回の `run` では、agent-kit に Anthropic の認証情報を渡してよいかを
確認するプロンプトが出るので許可する。非対話で起動すると拒否扱いになり、
`no binding authorizes anthropic` と表示されて認証情報が注入されない。

sbx は built-in claude 用に `defaultMode: bypassPermissions` の設定を
シードするが、起動フラグの `--permission-mode manual` が優先される。
`ls` のような読み取り専用コマンドは manual でも承認なしで実行される。

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
起動する。`agent-kit/` はこれを外すための kit で、公式の
[claude-safe の例](https://docs.docker.com/ai/sandboxes/customize/kit-examples/)
に自作 template の `image` を足しただけの構成になっている。
`extends` により OAuth 認証とエージェント設定の生成は built-in から継承される。

## ツールの更新

バージョンは `mise-config.toml` で管理(node はメジャー固定、gh は
ビルド時点の latest で固定)。更新は編集後に `build` を再実行する。
