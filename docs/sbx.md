# sbx で Claude Code を使う

Docker Sandbox(`sbx`)の中で Claude Code を動かすときの手順のまとめ。kit の構成や
設定の理由は [`.sandbox/README.md`](../.sandbox/README.md) を参照。

## 起動

リポ直下で実行する:

```bash
git switch master && git pull origin master
npm run sbx
```

実行するたびに新しい名前(例: `claude-2g14-1010-153045`)で独立したサンドボックスが作られ、
Claude が起動する。サンドボックスごとに専用の clone があるので、ターミナルを分けて
`npm run sbx` すれば、互いに影響せず並列に作業できる。名前は起動時に `sandbox: …` と表示される。

kit と `sbxenv.yaml` は手元のファイルが使われるので、先に master を最新にしておく。

### 既存のサンドボックスに戻る

名前を渡す。名前を忘れたら `sbx ls` で確認する:

```bash
npm run sbx -- claude-2g14-1010-153045
```

名前を間違えると、その名前で新しいサンドボックスが作られる(作成内容のプランが表示されるので、
承認せずに止めればよい)。

### 初回だけ必要なこと

1. 作成内容のプランが表示されるので承認する(新しいサンドボックスを作るたびに表示される)
2. Anthropic と GitHub の認証情報を kit に渡してよいか聞かれるので許可する
   (一度許可したサービスは次から聞かれない)
3. Claude が起動したら `/login` でサインインする
4. gh を使うなら、ホスト側で GitHub のトークンを登録する(全サンドボックス共通で一度だけ):

   ```bash
   sbx secret set github --command 'gh auth token'
   ```

## 終了

Claude を終了すればよい。サンドボックスと中の clone は残り、名前を渡して `npm run sbx` すれば戻れる。

## エージェントのコミットを取り込む

サンドボックスごとに、ホスト側に `sandbox-<名前>` という git リモートができる:

```bash
git fetch sandbox-claude-2g14-1010-153045
git switch -c <ブランチ名> sandbox-claude-2g14-1010-153045/<ブランチ名>
```

`.sandbox/` や `sbxenv.yaml` の変更が含まれていたら、取り込む前に必ず中身を確認する。

## 片付ける

作業が終わったサンドボックスは、コミットを取り込んでから削除する。削除すると clone ごと消える:

```bash
sbx ls
sbx env rm --name claude-2g14-1010-153045
```

## kit を変更したとき

kit の変更は、新しく作るサンドボックスにだけ反映される。既存のサンドボックスには反映されないので、
必要なら上の手順で片付けてから `npm run sbx` で作り直す。

## 困ったとき

```bash
sbx ls        # サンドボックスの一覧と状態
sbx diagnose  # インストールや daemon の問題を調べる
```

- gh が 401 を返す: 初回の 4 のトークン登録がされていない
- 認証情報が注入されない(`no binding authorizes ...`): 非対話で起動して許可が拒否扱いになった。
  ターミナルから起動し直して許可する
- `npm run sbx` を使わずに `sbx env run` すると、`sbxenv.yaml` で固定した名前(`claude-2g14`)の
  1つのサンドボックスに毎回入る。並列にはならない
