# Docker Sandbox 環境

Claude Code を Docker Sandbox (clone mode) で、承認プロンプト付きで動かすための kit 一式(kit spec v3)。
起動はリポ直下の `sbxenv.yaml`(sandbox environment file)で行う。

## 構成

| ファイル                | 役割                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `../sbxenv.yaml`        | workload と mixin を clone mode で組み合わせる environment file                                                                   |
| `claude-2g14/`          | workload。`claude-code-minimal` ベースに claude・mise 経由の node / npm / gh・apt の git を入れて起動する。node / npm の版はこのリポに合わせている |
| `project/`              | mixin。このリポ固有のエージェント向け指示だけを加える                                                                           |

`claude-2g14/` は公式の
[examples/claude](https://github.com/docker/sandbox-kit-spec/tree/main/examples/claude)
を基にしている。差分は YOLO モードを外したこと(起動時に `--dangerously-skip-permissions`
を渡さず、`bypassPermissions` の設定もシードしない)と、Dockerfile のベースとツール導入、
そのツールが使う通信と認証の許可だけ。GitHub 部分は
[examples/gh](https://github.com/docker/sandbox-kit-spec/tree/main/examples/gh) と同じ。

## 初回セットアップ(一度だけ)

v3 kit は `sbx` の中で buildx によってビルドされ、OCI 形式で出力される。Docker の
イメージ保存方式が従来の overlay2 のままだと、既定の builder(docker ドライバ)では
`OCI exporter is not supported for the docker driver` で失敗する。OrbStack や
Docker Desktop の設定で containerd image store を有効にしておく。

Anthropic の OAuth は `sbx secret set` からは開始できず、サンドボックス内の
Claude で `/login` してサインインする。proxy がトークンをホスト側に保存し、
サンドボックス内にはダミー値だけが残る。

gh と GitHub への git 操作に使うトークンを登録する。proxy が送信時に差し替えるので、
実トークンはサンドボックスに入らない。登録しなくても起動はできる:

```bash
sbx secret set github
```

## 使い方

リポ直下で実行する:

```bash
sbx env run
```

初回は作成内容のプランが表示されるので承認する。kit に Anthropic と GitHub の
認証情報を渡してよいかも確認されるので許可する。非対話で起動すると拒否扱いになり、
`no binding authorizes ...` と表示されて認証情報が注入されない。
2回目以降は既存のサンドボックスにアタッチする。削除は `sbx env rm`。

kit はサンドボックスの作成時にビルドされ、変更がなければ再利用される。
`sbx env` は Experimental で、コマンドやファイル形式が変わる可能性がある。

- 依存はインストールされないため、セッション冒頭に `npm install` を実行する
  (mixin のコンテキストでエージェントにも指示している)
- エージェントのコミットはホスト側の `sandbox-<name>` git リモートから取り込める
- `ls` のような読み取り専用コマンドは承認なしで実行される。YOLO が外れているかは
  書き込みを伴う操作で確かめる

## ツールの更新

- claude: `claude-2g14/claude-2g14.yaml` の `version` 引数で固定している
- node / npm: リポ直下の `mise.toml` と `claude-2g14/mise-config.toml` の両方を同じ版にそろえる。
  kit のビルドからは `mise.toml` を参照できないため、2か所に書いている。ずれていると
  初回実行時に mise が `mise.toml` 側の版をダウンロードし直す
- gh: `claude-2g14/mise-config.toml` で管理(ビルド時点の latest)
