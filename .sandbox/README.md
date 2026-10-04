# Docker Sandbox 環境

Claude Code を Docker Sandbox (clone mode) で、承認プロンプト付きで動かすための kit 一式(kit spec v3)。
起動はリポ直下の `sbxenv.yaml`(sandbox environment file)で行う。

## 構成

| ファイル                | 役割                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `../sbxenv.yaml`        | workload と mixin を clone mode で組み合わせる environment file                                                                   |
| `claude-2g14/`          | workload。`claude-code-minimal` ベースに claude・mise 経由の node / npm / gh・apt の git を入れて起動する。node / npm の版はこのリポに合わせている |
| `project/`              | mixin。このリポの npm 依存をサンドボックスの起動時に入れる                                                                      |

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

ホストの `sbx` のネットワークポリシーは balanced を前提にしている。起動時の `npm ci` は
registry.npmjs.org への通信を使うので、より厳しいポリシーでは失敗する。

Anthropic の OAuth は `sbx secret set` からは開始できず、サンドボックス内の
Claude で `/login` してサインインする。proxy がトークンをホスト側に保存し、
サンドボックス内にはダミー値だけが残る。

gh と GitHub への git 操作に使うトークンを登録する。ドキュメントが案内している方法で、
ホストの gh のログイントークンを渡す(ホストで `gh auth login` 済みであること)。
daemon が既定では 55 分ごとにホストの gh からトークンを取り直す。proxy が送信時に
付けるので、実トークンはサンドボックスに入らない:

```bash
sbx secret set github --command 'gh auth token'
```

- このトークンは、ホストの gh ログインと同じ権限(通常はアカウントのリポジトリ全体)を持つ。
  より絞りたい場合は、このリポジトリだけに限った fine-grained personal access token を
  `sbx secret set github` で登録してもよい
- kit は `/repos/**` への DELETE を拒否しているが、公開範囲の変更やブランチ保護の
  書き換え、force push などは通る。master には GitHub の ruleset で保護をかけておく
- 登録は既定でグローバル(全サンドボックス共通)になる。このサンドボックスだけに
  渡したい場合は `--sandbox <name>` を付ける
- 登録しなくても起動はできる。その場合も `GH_TOKEN` にはダミー値が入るので、
  gh は 401 を返す。サンドボックス内で `gh auth login` しても `GH_TOKEN` が優先されて効かない

ホストの SSH エージェントは既定でサンドボックスに転送され、GitHub への SSH(22番)も
balanced で許可されている。ホストのエージェントに鍵を登録すると、サンドボックスから
その鍵で push でき、トークンの権限を絞っても迂回される。転送を止めるには
`sbx settings set ssh.agentForwardingEnabled false` の後に `sbx daemon restart` する
(全サンドボックスに効く)。

## 使い方

リポ直下で実行する:

```bash
sbx env run
```

初回は作成内容のプランが表示されるので承認する。続いて、kit に Anthropic と GitHub の
認証情報を渡してよいかを確認されるので許可する。この許可(binding)はサービスごとに
ホストの `~/.config/sbx/credentials.yaml` に保存され、ほかのサンドボックスでも使われるので、
すでに許可したことのあるサービスは聞かれない。非対話で起動すると拒否扱いになり、
`no binding authorizes ...` と表示されて認証情報が注入されない。
2回目以降は既存のサンドボックスにアタッチする。削除は `sbx env rm`。

kit はサンドボックスの作成時にビルドされ、変更がなければ再利用される。
`sbx env` は Experimental で、コマンドやファイル形式が変わる可能性がある。

- npm 依存はサンドボックスの起動時に startup フックの `npm ci` で入る。startup は
  エージェントと並行して走るので、フックが実行中なら `/tmp/sbx-npm-ci.running`、
  失敗したら `/tmp/sbx-npm-ci.failed` を置き、エージェントにもその見分け方を伝えている。
  完了すると `node_modules/.sbx-npm-ci-done` を置き、次回以降の起動では何もしない。
  失敗しても起動は続き、原因は `/var/log/sbx-kit-startup.log` に残る
- エージェントのコミットはホスト側の `sandbox-claude-2g14` git リモートから取り込める。
  `.sandbox/` や `sbxenv.yaml` の変更が含まれていたら必ず中身を確認する(サンドボックスの
  権限や通信の許可を広げられるため)
- `ls` のような読み取り専用コマンドは承認なしで実行される。YOLO が外れているかは
  書き込みを伴う操作で確かめる

## ツールの更新

- claude: ビルド時に入れる版を `claude-2g14/claude-2g14.yaml` の `version` 引数で決めている。
  実行中は claude 自身の自動更新で新しい版に上がる
- node / npm: リポ直下の `mise.toml` と `claude-2g14/mise-config.toml` の両方を同じ版にそろえる。
  kit のビルドからは `mise.toml` を参照できないため、2か所に書いている。ずれていると
  初回実行時に mise が `mise.toml` 側の版をダウンロードし直す
- gh: `claude-2g14/mise-config.toml` で管理(ビルド時点の latest)

## kit を変更したとき

kit の変更は、サンドボックスを作り直したときにだけ反映される。作り直すと clone ごと
消えるので、エージェントのコミットを先に取り込んでおく:

```bash
git fetch sandbox-claude-2g14
sbx env rm
sbx env run
```

## sbxenv.yaml の書き方について

`agent` には kit のパスではなく名前(`claude-2g14`)を書き、kit 本体は `kits` に並べている。
environment file のフィールド表では `agent` は「Built-in agent or the name of an agent kit」と
されているが、v3 の workload を `kits` に並べる例はドキュメントに無い。`agent` にパスを
書くと受け付けられない
([docker/sbx-releases#614](https://github.com/docker/sbx-releases/issues/614))。
