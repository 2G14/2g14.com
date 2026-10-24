#!/bin/sh
# 引数なしなら新しい名前で独立したサンドボックスを作り、名前を渡すとそのサンドボックスに戻る。
# 名前を分単位にすると、同じ分に起動した2つが同じサンドボックスに入るので秒まで含める
set -eu
cd "$(dirname "$0")/.."
name="${1:-claude-2g14-$(date +%m%d-%H%M%S)}"
echo "sandbox: $name"
exec sbx env run --name "$name"
