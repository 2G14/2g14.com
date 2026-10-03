## 2g14.com の npm 依存

サンドボックスの起動時に `npm ci` を実行している。`node_modules/.package-lock.json`
は npm がインストール完了時に書くファイルで、これが無ければ `npm ci` が失敗している。
原因は `/var/log/sbx-kit-startup.log` に残っている。
