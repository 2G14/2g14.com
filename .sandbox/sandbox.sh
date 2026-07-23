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
  docker build -t "$IMAGE_TAG" "$SANDBOX_DIR"
  # sbx のランタイムは docker daemon と別なので tar 経由でロードする
  local tmpdir tar
  tmpdir="$(mktemp -d -t 2g14-sandbox)"
  tar="$tmpdir/template.tar"
  trap 'rm -rf "$tmpdir"' RETURN
  docker image save "$IMAGE_TAG" -o "$tar"
  sbx template load "$tar"
}

# agent-kit(YOLO 無効化)は v0.35 のデーモンが custom agent kit を拒否するため未使用。
# sbx-releases issue #47 / #242 の解消後に組み込む。
cmd_run() {
  cd "$REPO_ROOT"
  sbx run --clone \
    -t docker.io/library/2g14-sandbox:latest \
    --kit "$SANDBOX_DIR/project-kit" \
    claude .
}

case "${1:-}" in
  build) cmd_build ;;
  run) cmd_run ;;
  *) usage; exit 1 ;;
esac
