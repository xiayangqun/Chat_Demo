#!/bin/bash
# generate-proto.sh
#
# Generates static JavaScript + TypeScript declaration files from
# proto/chat_realtime.proto using protobufjs-cli (pbjs / pbts).
#
# Output:
#   proto/generated/chat_realtime.js   — static ES6 module (canonical)
#   proto/generated/chat_realtime.d.ts — TypeScript declarations
#   server/src/generated/chat_realtime_pb.js   — copy for server build
#   server/src/generated/chat_realtime_pb.d.ts — copy for server build
#   client/src/generated/chat_realtime_pb.js   — copy for client build
#   client/src/generated/chat_realtime_pb.d.ts — copy for client build
#
# Usage:
#   ./scripts/generate-proto.sh
#   npm run generate-proto        (from server/ or client/)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Locate pbjs / pbts — prefer server's local install
PBJS="${ROOT_DIR}/server/node_modules/.bin/pbjs"
PBTS="${ROOT_DIR}/server/node_modules/.bin/pbts"

if [[ ! -x "$PBJS" ]]; then
  echo "Error: pbjs not found. Run 'npm install' in server/ first." >&2
  exit 1
fi

PROTO="${ROOT_DIR}/proto/chat_realtime.proto"
OUT_DIR="${ROOT_DIR}/proto/generated"

# ── 1. Generate canonical output ─────────────────────────────────────────
mkdir -p "$OUT_DIR"

echo "Generating static JS module from ${PROTO}..."
"$PBJS" -t static-module -w es6 \
  -o "${OUT_DIR}/chat_realtime.js" \
  "$PROTO"

echo "Generating TypeScript declarations..."
"$PBTS" \
  -o "${OUT_DIR}/chat_realtime.d.ts" \
  "${OUT_DIR}/chat_realtime.js"

# ── 2. Fix generated JS for Node ESM compat ─────────────────────────────
# pbjs generates `import * as $protobuf from "protobufjs/minimal"` —
# but protobufjs/minimal is CJS, and Node ESM namespace import doesn't
# expose `roots`. Change to default import + add .js extension.
sed -i '' \
  -e 's|import \* as \$protobuf from "protobufjs/minimal"|import $protobuf from "protobufjs/minimal.js"|' \
  "${OUT_DIR}/chat_realtime.js"

# ── 3. Fix .d.ts: export inner namespaces + remove unused Long import ───
# pbts generates `namespace realtime` / `namespace v1` without `export`,
# making them inaccessible from external imports.  Add `export` so the
# wrapper files can access `chat.realtime.v1.*`.
sed -i '' \
  -e 's/^    namespace realtime/    export namespace realtime/' \
  -e 's/^        namespace v1/        export namespace v1/' \
  -e '/^import Long = require/d' \
  "${OUT_DIR}/chat_realtime.d.ts"

# ── 3. Copy into server ─────────────────────────────────────────────────
cp "${OUT_DIR}/chat_realtime.js"   "${ROOT_DIR}/server/src/generated/chat_realtime_pb.js"
cp "${OUT_DIR}/chat_realtime.d.ts" "${ROOT_DIR}/server/src/generated/chat_realtime_pb.d.ts"

# ── 3. Copy into client ─────────────────────────────────────────────────
cp "${OUT_DIR}/chat_realtime.js"   "${ROOT_DIR}/client/src/generated/chat_realtime_pb.js"
cp "${OUT_DIR}/chat_realtime.d.ts" "${ROOT_DIR}/client/src/generated/chat_realtime_pb.d.ts"

echo "✔ Proto static codegen complete"
echo "  proto/generated/chat_realtime.{js,d.ts}"
echo "  server/src/generated/chat_realtime_pb.{js,d.ts}"
echo "  client/src/generated/chat_realtime_pb.{js,d.ts}"
