#!/usr/bin/env bash
# Publish today's QuitCurve work (reminders + puff pacing + Big Q icon)
# from CodeCademyProjects → MarshallBuchner/quitcurve
#
# On your Mac:
#   curl -fsSL https://raw.githubusercontent.com/MarshallBuchner/CodeCademyProjects/cursor/brand-q-app-icon-cbbd/quitcurve/scripts/publish-today-to-quitcurve.sh | bash
#
# Or if you already have this file:
#   bash publish-today-to-quitcurve.sh
set -euo pipefail

QUITCURVE_DIR="${QUITCURVE_DIR:-$HOME/quitcurve}"
TMP_DIR="$(mktemp -d)"
SOURCE_REPO="https://github.com/MarshallBuchner/CodeCademyProjects.git"
# brand-q branch tip includes reminders + pacing + Big Q
SOURCE_BRANCH="cursor/brand-q-app-icon-cbbd"
PUSH_BRANCH="cursor/today-features-cbbd"

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo "→ Cloning $SOURCE_BRANCH (reminders + pacing + Big Q)…"
git clone --depth 1 --branch "$SOURCE_BRANCH" "$SOURCE_REPO" "$TMP_DIR/src"

if [[ ! -d "$QUITCURVE_DIR/.git" ]]; then
  echo "ERROR: $QUITCURVE_DIR is not a git repo."
  echo "Clone it first: git clone https://github.com/MarshallBuchner/quitcurve.git ~/quitcurve"
  exit 1
fi

SRC="$TMP_DIR/src/quitcurve"
cd "$QUITCURVE_DIR"
git fetch origin
git checkout main
git pull origin main
git checkout -B "$PUSH_BRANCH"

echo "→ Syncing app files into $QUITCURVE_DIR…"
# Copy source tree but skip node_modules / .next / local env
rsync -a --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env*.local' \
  "$SRC/" ./

# Ensure brand assets + icons landed
mkdir -p public/brand src/app
test -f public/brand/quitcurve-q.png || cp -f "$SRC/public/brand/quitcurve-q.png" public/brand/ 2>/dev/null || true

git add -A
git add -f .env.example 2>/dev/null || true

if git diff --cached --quiet; then
  echo "Nothing new to commit (files may already match)."
else
  git commit -m "Ship today's QuitCurve: reminders, puff pacing, Big Q brand icon"
fi

echo "→ Pushing $PUSH_BRANCH to MarshallBuchner/quitcurve…"
git push -u origin "$PUSH_BRANCH"

echo ""
echo "✅ Pushed. Finish on main:"
echo "  cd ~/quitcurve"
echo "  git checkout main && git merge $PUSH_BRANCH && git push"
echo ""
echo "Then in Supabase SQL Editor (if not already):"
echo "  • supabase/reminders.sql"
echo "  • supabase/puff_logs.sql"
echo ""
echo "Vercel: add reminder env vars if needed (REMINDERS.md) → Redeploy"
echo "iPhone: remove old home-screen icon, re-Add to Home Screen for Big Q"
