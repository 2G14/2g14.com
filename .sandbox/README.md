# Docker Sandbox 環境

Claude Code を Docker Sandbox (clone mode) で動かすための template + kit 一式。

## 構成

| ファイル                          | 役割                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `Dockerfile` / `mise-config.toml` | template。`claude-code-minimal` ベースに mise 経由で node 24 / npm / gh を焼き込み、git を apt で最新化 |
| `agent-kit/`                      | sandbox kit(汎用)。YOLO なしの claude 起動定義。**現リリースでは未使用**(下記)                          |
| `project-kit/`                    | mixin kit(このリポ固有)。`mise.jdx.dev` の許可と agentContext を注入                                    |
| `sandbox.sh`                      | build / run のラッパー                                                                                  |

## 初回セットアップ(一度だけ)

```bash
# GitHub トークンを登録(proxy が代理認証。実トークンはサンドボックスに入らない)
sbx secret set -g github

# Anthropic 認証が未登録なら
sbx secret set -g anthropic
```

## 使い方

```bash
.sandbox/sandbox.sh build   # イメージをビルドし sbx ランタイムへロード
.sandbox/sandbox.sh run     # clone mode で起動
```

- 依存はインストールされないため、セッション冒頭に `npm install` を実行する
  (agentContext でエージェントにも指示済み)
- エージェントのコミットはホスト側の `sandbox-<name>` git リモートから取り込める

## YOLO モードについて

sbx は claude を `--dangerously-skip-permissions`(YOLO)付きで起動する。
現状これを宣言的に無効化する手段はない:

- 公式手段は custom sandbox kit(`agent-kit/` がそれ)だが、v0.35 の
  デーモンは built-in エージェントのみ受け付ける(v0.36.0-rc 以降で解禁)
- さらに sandbox kit は OAuth credential 注入が効かない既知バグがある
  ([sbx-releases#242](https://github.com/docker/sbx-releases/issues/242)、
  経緯は [#47](https://github.com/docker/sbx-releases/issues/47))

当面は起動後に `/permissions` で手動切替する。上記が解消されたら
`sandbox.sh` の `cmd_run` を agent-kit 経由の起動に戻す。

## ツールの更新

バージョンは `mise-config.toml` で管理(node はメジャー固定、gh は
ビルド時点の latest で固定)。更新は編集後に `build` を再実行する。
