#!/usr/bin/env bash
# Run this after creating https://github.com/MarshallBuchner/quitcurve on GitHub
set -euo pipefail

cd "$(dirname "$0")/.."

if ! git remote get-url origin &>/dev/null; then
  git remote add origin https://github.com/MarshallBuchner/quitcurve.git
fi

git branch -M main
git push -u origin main

echo ""
echo "Done! Next: import MarshallBuchner/quitcurve at https://vercel.com/new"
echo "See DEPLOY.md for the full checklist."
