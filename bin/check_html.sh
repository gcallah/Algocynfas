#!/bin/sh
# Check the HTML of the page sources (html_src/*.ptml) and the hand-written
# pages with bin/html_checker.py. Shows errors only, unless -v is given.
# Usage: bin/check_html.sh [-v]
# Exits non-zero if any file has errors.

cd "$(dirname "$0")/.." || exit 1
status=0
for f in html_src/*.ptml *.html; do
    # Generated pages are checked through their .ptml sources instead.
    [ -f "html_src/$(basename "$f" .html).ptml" ] && [ "${f%.html}" != "$f" ] && continue
    result=$(python3 bin/html_checker.py "$f") || status=1
    [ "$1" = "-v" ] || result=$(echo "$result" | grep '^ERROR')
    if [ -n "$result" ]; then
        echo "== $f"
        echo "$result"
    fi
done
exit $status
