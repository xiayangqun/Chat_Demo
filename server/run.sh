#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Chat Demo — Server Startup Script
# Builds TypeScript, checks dependencies (Redis, MongoDB),
# initializes database schema, and starts the server.
# ─────────────────────────────────────────────────────────
set -euo pipefail

# ── Colors ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
step()  { echo -e "\n${BOLD}━━━ $1 ━━━${NC}"; }

# ── Resolve project root (script works from any cwd) ────
cd "$(dirname "$0")"
SERVER_DIR="$(pwd)"
PROJECT_DIR="$(dirname "$SERVER_DIR")"

# ── Load MONGODB_URI from .env ──────────────────────────
MONGODB_URI=""
if [ -f .env ]; then
  MONGODB_URI="$(grep -E '^MONGODB_URI=' .env | head -1 | sed 's/^MONGODB_URI=//' | sed "s/^'//; s/'$//" | sed 's/^"//; s/"$//')"
fi
MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017/chat-demo}"
export MONGODB_URI

# ── 0. Kill existing process on port 4000 ────────────────
step "Step 0/4: Check port 4000"
if lsof -ti:4000 &>/dev/null; then
  warn "Port 4000 is in use. Killing existing process..."
  lsof -ti:4000 | xargs kill -9 2>/dev/null || true
  ok "Process on port 4000 killed."
else
  ok "Port 4000 is free."
fi

# ── 1. Build TypeScript ──────────────────────────────────
step "Step 1/4: Build TypeScript"
info "Compiling TypeScript with tsc..."
npm run build
ok "TypeScript compiled successfully (dist/)."

# ── 2. Check Redis Docker container ─────────────────────
step "Step 2/4: Check Redis"

# macOS Docker Desktop may not be in PATH — add its bin directory
DOCKER_BIN="/Applications/Docker.app/Contents/Resources/bin"
if [ -d "$DOCKER_BIN" ] && [[ ":$PATH:" != *":$DOCKER_BIN:"* ]]; then
  export PATH="$DOCKER_BIN:$PATH"
fi

if command -v docker &>/dev/null; then
  if docker ps -q --filter name=^/chat-demo-redis$ --filter status=running | grep -q .; then
    ok "Redis container 'chat-demo-redis' is running."
  elif docker ps -aq --filter name=^/chat-demo-redis$ --filter status=exited | grep -q .; then
    warn "Redis container 'chat-demo-redis' exists but is stopped. Starting..."
    docker start chat-demo-redis
    ok "Redis container started."
  elif docker ps -aq --filter name=^/chat-demo-redis$ | grep -q .; then
    warn "Redis container 'chat-demo-redis' exists but is in an unknown state. Starting..."
    docker start chat-demo-redis
    ok "Redis container started."
  else
    info "Redis container 'chat-demo-redis' not found. Pulling redis:7 and starting..."
    docker pull redis:7
    docker run --name chat-demo-redis -p 6379:6379 -d redis:7
    ok "Redis container pulled and started."
  fi
else
  warn "Docker not found. Skipping Redis container check."
  warn "Make sure Redis is running on localhost:6379."
fi

# ── 3. Check MongoDB connectivity ───────────────────────
step "Step 3/4: Check MongoDB"
if command -v mongosh &>/dev/null; then
  if mongosh --quiet --eval 'db.runCommand({ping:1})' "$MONGODB_URI" &>/dev/null; then
    ok "MongoDB is accessible via mongosh at $MONGODB_URI."
  else
    error "Cannot connect to MongoDB at $MONGODB_URI."
    error "Ensure MongoDB is running (e.g. brew services start mongodb-community)."
    exit 1
  fi
elif pgrep mongod &>/dev/null; then
  warn "mongosh not found, but mongod process is detected. Proceeding..."
  warn "Install mongosh for reliable connectivity checks."
else
  error "MongoDB does not appear to be running."
  error "Install mongosh, or start mongod and retry."
  exit 1
fi

# ── 4. Initialize database schema ───────────────────────
step "Step 4/4: Initialize Database Schema"
info "Running database initialization script..."
"$PROJECT_DIR/scripts/init-database.sh"
ok "Database schema initialized."

# ── Done ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  All systems ready. Starting server...${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exec npm start
