#!/usr/bin/env bash
# Publish QuitCurve check-in reminders from CodeCademyProjects → MarshallBuchner/quitcurve
# Run on your Mac:
#   bash publish-reminders-to-quitcurve.sh
set -euo pipefail

QUITCURVE_DIR="${QUITCURVE_DIR:-$HOME/quitcurve}"
TMP_DIR="$(mktemp -d)"
SOURCE_REPO="https://github.com/MarshallBuchner/CodeCademyProjects.git"
SOURCE_BRANCH="cursor/check-in-reminders-cbbd"

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo "→ Cloning reminder branch…"
git clone --depth 1 --branch "$SOURCE_BRANCH" "$SOURCE_REPO" "$TMP_DIR/src"

if [[ ! -d "$QUITCURVE_DIR/.git" ]]; then
  echo "ERROR: $QUITCURVE_DIR is not a git repo."
  echo "Clone it first: git clone https://github.com/MarshallBuchner/quitcurve.git ~/quitcurve"
  exit 1
fi

echo "→ Copying reminder files into $QUITCURVE_DIR…"
SRC="$TMP_DIR/src/quitcurve"
cd "$QUITCURVE_DIR"
git fetch origin
git checkout main
git pull origin main
git checkout -B cursor/check-in-reminders-cbbd

mkdir -p src/lib/reminders src/app/api/cron/reminders src/app/reminders supabase

cp "$SRC/src/lib/reminders/"*.ts src/lib/reminders/
cp "$SRC/src/app/api/cron/reminders/route.ts" src/app/api/cron/reminders/
cp "$SRC/src/app/reminders/page.tsx" src/app/reminders/
cp "$SRC/src/components/ReminderSettingsForm.tsx" src/components/
cp "$SRC/src/components/Dashboard.tsx" src/components/
cp "$SRC/src/app/privacy/page.tsx" src/app/privacy/
cp "$SRC/src/app/sitemap.ts" src/app/
cp "$SRC/supabase/reminders.sql" supabase/
cp "$SRC/vercel.json" .
cp "$SRC/REMINDERS.md" .
cp "$SRC/SETUP.md" .
cp "$SRC/README.md" .
cp "$SRC/.env.example" .
# keep .gitignore env.example exception if present
if [[ -f "$SRC/.gitignore" ]]; then
  cp "$SRC/.gitignore" .
fi

git add -A
git add -f .env.example 2>/dev/null || true
git commit -m "Add daily check-in reminders (Resend email + optional Twilio SMS)" || {
  echo "Nothing new to commit (files may already be present)."
}

echo "→ Pushing branch to MarshallBuchner/quitcurve…"
git push -u origin cursor/check-in-reminders-cbbd

echo ""
echo "✅ Pushed. Next:"
echo "  1. Open a PR (or merge) into main on github.com/MarshallBuchner/quitcurve"
echo "  2. Or: git checkout main && git merge cursor/check-in-reminders-cbbd && git push"
echo "  3. Supabase SQL Editor → run supabase/reminders.sql"
echo "  4. Vercel env vars (see REMINDERS.md) → Redeploy"
echo "  5. quitcurve.app/reminders → enable email"
