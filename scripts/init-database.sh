#!/usr/bin/env bash
set -euo pipefail

MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017/chat-demo}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v mongosh >/dev/null 2>&1; then
  echo "mongosh is required. Install MongoDB Shell first." >&2
  exit 1
fi

mongosh "$MONGODB_URI" "$SCRIPT_DIR/init-database.mongosh.js"
