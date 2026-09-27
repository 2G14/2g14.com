#!/usr/bin/env bash
set -euo pipefail

SANDBOX_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SANDBOX_DIR")"

cd "$REPO_ROOT"
# docker ドライバの builder(OrbStack の既定)は v3 kit のビルドに必要な OCI 出力ができない
BUILDX_BUILDER=sbx-kit sbx run --clone \
  --kit "$SANDBOX_DIR/project" \
  "$SANDBOX_DIR/claude-2g14" .
