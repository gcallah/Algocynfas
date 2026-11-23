#!/bin/sh
# Take a screenshot of a page, at desktop or phone width.
# Usage: bin/screenshot.sh page.html [width] [output.png]
#   bin/screenshot.sh sort.html            # 1280px wide, saved as sort.png
#   bin/screenshot.sh sort.html 375        # phone width
# Headless Chrome won't go narrower than 500px, so narrow widths are shot
# by framing the page in an iframe of that width.

page=${1:?usage: bin/screenshot.sh page.html [width] [output.png]}
width=${2:-1280}
out=${3:-$(basename "$page" .html).png}
# The output path is relative to where you ran the script; the page is
# relative to the repository root.
case "$out" in /*) ;; *) out="$PWD/$out" ;; esac
cd "$(dirname "$0")/.." || exit 1
height=1000

if [ "$width" -lt 500 ]; then
    frame=$(mktemp -t shotXXXXXX).html
    echo "<body style='margin:0'><iframe src='file://$PWD/$page' style='width:${width}px;height:${height}px;border:0'></iframe></body>" > "$frame"
    url="file://$frame"
    winwidth=500
else
    url="file://$PWD/$page"
    winwidth=$width
fi

bin/chrome.sh --window-size="$winwidth,$height" --virtual-time-budget=3000 \
    --screenshot="$out" "$url"
[ -n "$frame" ] && rm -f "$frame"
echo "Saved $out"
