#!/bin/bash
# generate-proto-server.sh
# Generates proto files for server only.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

PBJS="${ROOT_DIR}/server/node_modules/.bin/pbjs"
PBTS="${ROOT_DIR}/server/node_modules/.bin/pbts"

if [[ ! -x "$PBJS" ]]; then
  echo "Error: pbjs not found. Run 'npm install' in server/ first." >&2
  exit 1
fi

PROTO="${ROOT_DIR}/proto/chat_realtime.proto"
OUT_DIR="${ROOT_DIR}/proto/generated"

mkdir -p "$OUT_DIR"

"$PBJS" -t static-module -w es6 -o "${OUT_DIR}/chat_realtime.js" "$PROTO"
"$PBTS" -o "${OUT_DIR}/chat_realtime.d.ts" "${OUT_DIR}/chat_realtime.js"

# Fix for Node ESM compat
sed -i '' \
  -e 's|import \* as \$protobuf from "protobufjs/minimal"|import $protobuf from "protobufjs/minimal.js"|' \
  "${OUT_DIR}/chat_realtime.js"

# Fix .d.ts exports
sed -i '' \
  -e 's/^    namespace realtime/    export namespace realtime/' \
  -e 's/^        namespace v1/        export namespace v1/' \
  -e '/^import Long = require/d' \
  "${OUT_DIR}/chat_realtime.d.ts"

# Copy to server only
cp "${OUT_DIR}/chat_realtime.js"   "${ROOT_DIR}/server/src/generated/chat_realtime_pb.js"
cp "${OUT_DIR}/chat_realtime.d.ts" "${ROOT_DIR}/server/src/generated/chat_realtime_pb.d.ts"

echo "✔ Proto codegen complete (server)"
