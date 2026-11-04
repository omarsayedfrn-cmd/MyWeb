#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-$(date +%Y%m%d%H%M)}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

perl -pi -e "s{(/assets/(?:style\\.css|nav\\.js|typing\\.js))\\?v=[0-9A-Za-z._-]+}{\$1?v=$VERSION}g" ./*.html

echo "Asset version set to: $VERSION"
grep -rhoE '/assets/(style\.css|nav\.js|typing\.js)\?v=[0-9A-Za-z._-]+' ./*.html | sort -u