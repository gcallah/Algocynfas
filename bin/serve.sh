#!/bin/sh
# Serve the site locally at http://localhost:8000 (or the port given).
# Usage: bin/serve.sh [port]
cd "$(dirname "$0")/.." || exit 1
port=${1:-8000}
echo "Serving on http://localhost:$port  (Ctrl-C to stop)"
exec python3 -m http.server "$port"
