#!/bin/sh
# Rebuild lib/images/og-image.png (the 1200x630 picture shown when a link to
# the site is shared) from lib/images/og-source.html.
# Usage: bin/og_image.sh

cd "$(dirname "$0")/.." || exit 1
bin/chrome.sh --screenshot="$PWD/lib/images/og-image.png" --window-size=1200,630 \
    --virtual-time-budget=5000 "file://$PWD/lib/images/og-source.html"
ls -l lib/images/og-image.png
