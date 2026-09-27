# Docker Sandbox 環境

Claude Code を Docker Sandbox (clone mode) で、承認プロンプト付きで動かすための kit 一式(kit spec v3)。

## 構成

| ファイル       | 役割                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `claude-2g14/` | workload。`claude-code-minimal` ベースに claude・mise 経由の node / npm / gh・apt の git を入れて起動する。ほかのリポでも使える |
| `project/`     | mixin。このリポ固有のエージェント向け指示だけを加える                                                                           |
| `sandbox.sh`   | 起動用のラッパー                                                                                                                |

`claude-2g14/` は公式の
[examples/claude](https://github.com/docker/sandbox-kit-spec/tree/main/examples/claude)
を基にしている。差分は YOLO モードを外したこと(起動時に `--dangerously-skip-permissions`
を渡さず、`bypassPermissions` の設定もシードしない)と、Dockerfile のベースとツール導入、
そのツールが使う通信の許可だけ。

## 初回セットアップ(一度だけ)

v3 kit のビルドには OCI 形式で出力できる buildx builder が要る。OrbStack の既定
builder(docker ドライバ)はこれができないので、専用の builder を作る:

```bash
docker buildx create --name sbx-kit --driver docker-container
```

既定の builder は変えないので、他の Docker ビルドには影響しない。
`sandbox.sh` が `BUILDX_BUILDER=sbx-kit` を指定して使う。

Anthropic の OAuth は `sbx secret set` からは開始できず、サンドボックス内の
Claude で `/login` してサインインする。proxy がトークンをホスト側に保存し、
サンドボックス内にはダミー値だけが残る。

初回の `run` では、kit に Anthropic の認証情報を渡してよいかを確認する
プロンプトが出るので許可する。非対話で起動すると拒否扱いになり、
`no binding authorizes anthropic` と表示されて認証情報が注入されない。

## 使い方

```bash
.sandbox/sandbox.sh
```

kit は `sbx run` の中でビルドされ、変更がなければ再利用される。

- 依存はインストールされないため、セッション冒頭に `npm install` を実行する
  (mixin のコンテキストでエージェントにも指示している)
- エージェントのコミットはホスト側の `sandbox-<name>` git リモートから取り込める
- `ls` のような読み取り専用コマンドは承認なしで実行される。YOLO が外れているかは
  書き込みを伴う操作で確かめる

## ツールの更新

- claude: `claude-2g14/claude-2g14.yaml` の `version` 引数で固定している
- node / gh: `claude-2g14/mise-config.toml` で管理(node はメジャー固定、gh は
  ビルド時点の latest)。ただしリポ直下の `mise.toml` が版を固定している場合は
  そちらが優先され、初回実行時にその版がインストールされる
