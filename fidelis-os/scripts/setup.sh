#!/usr/bin/env bash
# One-time setup for Fidelis OS.
# Usage (from the fidelis-os folder): bash scripts/setup.sh
# Installs Homebrew (macOS) and Node 20+ if missing, installs dependencies,
# creates .env.local, and builds the local SQLite database.
set -euo pipefail

cd "$(dirname "$0")/.."

say() { printf '\n== %s\n' "$1"; }

node_ok() {
  command -v node >/dev/null 2>&1 || return 1
  local major
  major=$(node -p 'process.versions.node.split(".")[0]')
  [ "$major" -ge 20 ]
}

if [ "$(uname -s)" = "Darwin" ]; then
  if ! command -v brew >/dev/null 2>&1; then
    # Homebrew lands in different places on Apple Silicon and Intel Macs.
    for candidate in /opt/homebrew/bin/brew /usr/local/bin/brew; do
      [ -x "$candidate" ] && eval "$("$candidate" shellenv)" && break
    done
  fi
  if ! command -v brew >/dev/null 2>&1; then
    say "Installing Homebrew (it will ask for your Mac password)"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    for candidate in /opt/homebrew/bin/brew /usr/local/bin/brew; do
      [ -x "$candidate" ] && eval "$("$candidate" shellenv)" && break
    done
  fi
  say "Homebrew: $(brew --version | head -1)"

  if ! node_ok; then
    say "Installing Node 22 with Homebrew"
    brew install node@22
    brew link --overwrite --force node@22
  fi
else
  if ! node_ok; then
    echo "Node 20 or newer is required. Install it from https://nodejs.org and run this again."
    exit 1
  fi
fi

say "Node: $(node -v), npm: $(npm -v)"

say "Installing dependencies"
npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  say "Created .env.local. Paste your ANTHROPIC_API_KEY into it."
else
  say ".env.local already exists. Left unchanged."
fi

say "Building the local database"
npm run db:init

say "Done. Start the app with: npm run dev"
