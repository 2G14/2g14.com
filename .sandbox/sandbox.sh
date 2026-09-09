#!/usr/bin/env bash
set -euo pipefail

SANDBOX_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SANDBOX_DIR")"
IMAGE_TAG='2g14-sandbox:latest'

usage() {
  cat <<'EOF'
Usage: .sandbox/sandbox.sh <command>

Commands:
  build   template イメージをビルドして sbx ランタイムへロードする
  run     サンドボックスを clone mode で起動する(YOLO なし)
EOF
}

cmd_build() {
  # --pull なしだとベースが古いまま残り、同梱 claude が新しい起動フラグを拒否する
  docker build --pull -t "$IMAGE_TAG" "$SANDBOX_DIR"
  # sbx のランタイムは docker daemon と別なので tar 経由でロードする
  local tmpdir tar
  tmpdir="$(mktemp -d -t 2g14-sandbox)"
  tar="$tmpdir/template.tar"
  trap 'rm -rf "$tmpdir"' RETURN
  docker image save "$IMAGE_TAG" -o "$tar"
  sbx template load "$tar"
}

cmd_run() {
  cd "$REPO_ROOT"
  sbx run --clone \
    --kit "$SANDBOX_DIR/agent-kit" \
    --kit "$SANDBOX_DIR/project-kit" \
    claude-2g14 .
}

case "${1:-}" in
  build) cmd_build ;;
  run) cmd_run ;;
  *) usage; exit 1 ;;
esac
