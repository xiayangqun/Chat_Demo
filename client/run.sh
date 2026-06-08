#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Chat Demo — Client Startup Script
# Checks dependencies, builds, kills port conflicts, and starts Vite.
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

# ── 0. Kill existing process on port 5173 ────────────────
step "Step 0/4: Check port 5173"
if lsof -ti:5173 &>/dev/null; then
  warn "Port 5173 is in use. Killing existing process..."
  lsof -ti:5173 | xargs kill -9 2>/dev/null || true
  ok "Process on port 5173 killed."
else
  ok "Port 5173 is free."
fi

# ── 1. Check Node.js ────────────────────────────────────
step "Step 1/4: Check Node.js"
if command -v node &>/dev/null; then
  NODE_VERSION="$(node --version)"
  ok "Node.js $NODE_VERSION found."
else
  error "Node.js is not installed."
  error "Install Node.js >= 18 and retry."
  exit 1
fi

# ── 2. Check dependencies ───────────────────────────────
step "Step 2/4: Check dependencies"
if [ ! -d "node_modules" ]; then
  warn "node_modules not found. Installing dependencies..."
  npm install
  ok "Dependencies installed."
else
  ok "node_modules exists. Skipping install."
fi

# ── 3. Build ─────────────────────────────────────────────
step "Step 3/4: Build"
info "Running npm run build..."
npm run build
ok "Build completed."

# ── Done ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Starting Vite dev server...${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exec npm run dev
