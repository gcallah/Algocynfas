#!/bin/sh
# Run headless Chrome with the flags the other scripts need (file:// pages
# may load each other). Set CHROME to use a different browser binary.
# Usage: bin/chrome.sh [chrome flags...]

if [ -z "$CHROME" ]; then
    for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
             google-chrome google-chrome-stable chromium chromium-browser; do
        if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then
            CHROME="$c"
            break
        fi
    done
fi
if [ -z "$CHROME" ]; then
    echo "chrome.sh: can't find Chrome; set CHROME to its path." >&2
    exit 1
fi

exec "$CHROME" --headless=new --allow-file-access-from-files --disable-web-security \
    --hide-scrollbars "$@" 2>/dev/null
