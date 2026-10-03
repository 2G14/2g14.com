#!/usr/bin/env bash
set -euo pipefail

SANDBOX_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SANDBOX_DIR")"
MISE_CONFIG="$SANDBOX_DIR/claude-2g14/mise-config.toml"

cd "$REPO_ROOT"

if missing="$(grep -vxF -f "$MISE_CONFIG" mise.toml)"; then
  echo "mise.toml の次の行が $MISE_CONFIG にありません:" >&2
  echo "$missing" >&2
  exit 1
fi

# docker ドライバの builder(OrbStack の既定)は v3 kit のビルドに必要な OCI 出力ができない
BUILDX_BUILDER=sbx-kit sbx run --clone \
  --kit "$SANDBOX_DIR/project" \
  "$SANDBOX_DIR/claude-2g14" .
