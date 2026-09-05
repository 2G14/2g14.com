#!/usr/bin/env bash
# ビジュアルリグレッションの比較を行う(--update で基準スナップショットを更新)。
#
# フォントのレンダリングは OS ごとに変わるため、スナップショットは CI と同じ Linux で
# 生成したものだけを基準とする。ホストで wrangler dev を立て、Playwright 公式イメージの
# コンテナからそこへ接続して撮影する。
set -euo pipefail

cd "$(dirname "$0")/.."

# 既定は比較。引数なしの実行が基準の書き換えにならないようにする
MODE="${1:-check}"
case "$MODE" in
  check | --update) ;;
  *)
    echo "不明な引数: ${MODE}(使い方: $0 [--update])" >&2
    exit 1
    ;;
esac

PORT=8787
PW_VERSION="$(npx playwright --version | sed 's/^Version //')"
IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-noble"

# 既に何かが待ち受けていると、そのサーバーに対して撮影してしまう。
# 既定モードが update なので、古いビルドの画像が基準として残るのが最も怖い
if curl -sf "http://localhost:${PORT}/" > /dev/null 2>&1; then
  echo "ポート ${PORT} は既に使用されています。停止してから実行してください。" >&2
  exit 1
fi

npm run build

# ホットキー(b/d/x)用の raw mode に入らせない。この用途では使えないうえ、
# 端末の状態を壊す・docker と入力を取り合う元になる
npx wrangler dev --port "$PORT" < /dev/null &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

echo "waiting for http://localhost:${PORT} ..."
ready=false
for _ in $(seq 1 60); do
  if ! kill -0 "$SERVER_PID" 2> /dev/null; then
    echo "wrangler dev が起動前に終了しました。" >&2
    exit 1
  fi
  if curl -sf "http://localhost:${PORT}/" > /dev/null; then
    ready=true
    break
  fi
  sleep 1
done

if [ "$ready" != true ]; then
  echo "http://localhost:${PORT} が 60 秒以内に応答しませんでした。" >&2
  exit 1
fi

PW_ARGS=(--project=visual)
if [ "$MODE" = "--update" ]; then
  PW_ARGS+=(--update-snapshots)
fi

# node_modules をそのままマウントしている。コンテナ内で動かすのは pure JS の
# Playwright だけで、esbuild や workerd のような macOS 向け native binary には触れない。
# コンテナ側で npm run build までやりたくなったらこの前提が崩れる
docker run --rm \
  -v "$PWD:/work" -w /work \
  --add-host=host.docker.internal:host-gateway \
  --user "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -e CI=1 \
  -e "E2E_BASE_URL=http://host.docker.internal:${PORT}" \
  "$IMAGE" \
  npx playwright test "${PW_ARGS[@]}"

if [ "$MODE" = "--update" ]; then
  echo "スナップショットを更新しました。差分を確認してコミットしてください。"
fi
