## 2g14.com の npm 依存

サンドボックスの起動時に startup フックが `npm ci` を実行している。startup は
エージェントと並行して走るので、次の目印で状態を見分ける。

- `/tmp/sbx-npm-ci.running`: 実行中。終わるまで待つ(自分で `npm ci` を走らせると衝突する)
- `/tmp/sbx-npm-ci.failed`: 失敗した。原因は `/var/log/sbx-kit-startup.log` にある。
  原因を確かめてから `npm ci` を実行する
- どちらも無く `node_modules/.sbx-npm-ci-done` がある: 完了している
