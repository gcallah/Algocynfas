#!/bin/sh
# Run the browser tests in tests/browser in headless Chrome.
# Each test drives a page through whole animations (with time sped up) and
# checks the answers, so a full run takes a few minutes.
# Usage: bin/browser_tests.sh [test name ...]   e.g. bin/browser_tests.sh search
# Exits non-zero if any check fails.

cd "$(dirname "$0")/.." || exit 1
BIN="$PWD/bin"

if [ $# -gt 0 ]; then
    tests=""
    for t in "$@"; do tests="$tests tests/browser/test_$t.html"; done
else
    tests=$(ls tests/browser/test_*.html)
fi

failed=0
for t in $tests; do
    echo "== $t"
    # Virtual time lets the animations' timers fire without real waiting.
    out=$("$BIN/chrome.sh" --virtual-time-budget=10000000 --dump-dom "file://$PWD/$t" |
          sed -n '/<pre id="out">/,/<\/pre>/p' |
          sed -e 's/.*<pre id="out">//' -e 's/<\/pre>.*//' \
              -e 's/&gt;/>/g' -e 's/&lt;/</g' -e 's/&amp;/\&/g')
    echo "$out"
    if echo "$out" | grep -q '^FAIL\|^ERROR' || ! echo "$out" | grep -q '^DONE'; then
        failed=1
        echo "!! $t had failures (or didn't finish)"
    fi
done

[ $failed -eq 0 ] && echo "All browser tests passed."
exit $failed
