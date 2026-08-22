#!/usr/bin/env bash
# ビジュアルリグレッションの基準スナップショットを更新する(--check で比較のみ)。
#
# フォントのレンダリングは OS ごとに変わるため、スナップショットは CI と同じ Linux で
# 生成したものだけを基準とする。ホストで wrangler dev を立て、Playwright 公式イメージの
# コンテナからそこへ接続して撮影する。
set -euo pipefail

cd "$(dirname "$0")/.."

MODE="${1:-update}"
PORT=8787
PW_VERSION="$(npx playwright --version | sed 's/^Version //')"
IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-noble"

npm run build

npx wrangler dev --port "$PORT" &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

echo "waiting for http://localhost:${PORT} ..."
for _ in $(seq 1 60); do
  if curl -sf "http://localhost:${PORT}/" >/dev/null; then break; fi
  sleep 1
done

docker run --rm \
  -v "$PWD:/work" -w /work \
  --add-host=host.docker.internal:host-gateway \
  --user "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -e CI=1 \
  -e "E2E_BASE_URL=http://host.docker.internal:${PORT}" \
  "$IMAGE" \
  npx playwright test --project=visual $([ "$MODE" = "--check" ] || echo --update-snapshots)

if [ "$MODE" != "--check" ]; then
  echo "スナップショットを更新しました。差分を確認してコミットしてください。"
fi
