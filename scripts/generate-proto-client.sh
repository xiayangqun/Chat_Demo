#!/bin/bash
# generate-proto-client.sh
# Copies existing proto-generated files to client.
# Proto generation requires server/node_modules (pbjs/pbts),
# so run this AFTER server has been built at least once.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

OUT_DIR="${ROOT_DIR}/proto/generated"

if [[ ! -f "${OUT_DIR}/chat_realtime.js" ]]; then
  echo "Error: Proto files not generated yet. Run server build first." >&2
  exit 1
fi

cp "${OUT_DIR}/chat_realtime.js"   "${ROOT_DIR}/client/src/generated/chat_realtime_pb.js"
cp "${OUT_DIR}/chat_realtime.d.ts" "${ROOT_DIR}/client/src/generated/chat_realtime_pb.d.ts"

echo "✔ Proto codegen complete (client)"
