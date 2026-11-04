#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-omarsayedfrn-cmd/MyWeb}"
TAG="${TAG:-apk-latest}"
ASSET_NAME="${ASSET_NAME:-Solver-Platform.apk}"
APK_PATH="${1:-downloads/Solver-Platform.apk}"

if [[ ! -f "$APK_PATH" ]]; then
  echo "APK not found: $APK_PATH" >&2
  echo "Usage: $0 /path/to/app.apk" >&2
  exit 1
fi

if [[ "${APK_PATH##*.}" != "apk" ]]; then
  echo "Not an APK file: $APK_PATH" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required: https://cli.github.com" >&2
  exit 1
fi

gh auth status >/dev/null

UPLOAD_PATH="$APK_PATH"
CLEANUP=""
if [[ "$(basename "$APK_PATH")" != "$ASSET_NAME" ]]; then
  TMP_DIR="$(mktemp -d)"
  CLEANUP="$TMP_DIR"
  cp "$APK_PATH" "$TMP_DIR/$ASSET_NAME"
  UPLOAD_PATH="$TMP_DIR/$ASSET_NAME"
fi

cleanup() {
  if [[ -n "$CLEANUP" ]]; then
    rm -rf "$CLEANUP"
  fi
}
trap cleanup EXIT

echo "Uploading $(basename "$APK_PATH") to $REPO release $TAG ..."

if gh release view "$TAG" --repo "$REPO" >/dev/null 2>&1; then
  gh release upload "$TAG" "$UPLOAD_PATH" --repo "$REPO" --clobber
else
  gh release create "$TAG" "$UPLOAD_PATH" \
    --repo "$REPO" \
    --title "APK - Latest" \
    --notes "أحدث إصدار من تطبيق سولفر (APK) للتحميل المباشر." \
    --latest
fi

echo
echo "Done. Stable download URL:"
echo "https://github.com/$REPO/releases/latest/download/$ASSET_NAME"