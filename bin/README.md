# bin

Scripts for building, checking and publishing the site. Run them from anywhere;
they find the repository root themselves.

| Script | What it does |
|---|---|
| `serve.sh [port]` | Serve the site at http://localhost:8000 for local viewing. |
| `browser_tests.sh [name ...]` | Run the tests in `tests/browser` in headless Chrome. They drive the visualization pages through whole runs and check the answers, e.g. `bin/browser_tests.sh search`. Takes a few minutes for all of them. |
| `screenshot.sh page.html [width] [out.png]` | Screenshot a page at desktop or phone width (e.g. `375`). |
| `check_html.sh [-v]` | Check the `.ptml` sources and hand-written pages with `html_checker.py`. `-v` also shows warnings. |
| `push_master.sh` | Push the current commit to `master`, refusing if it isn't a fast-forward. |
| `chrome.sh` | Headless Chrome with the flags the other scripts need. Set `CHROME` to use another browser binary. |
| `gen_bg.py [out.svg]` | Regenerate the site's background image, `lib/images/algo-bg.svg`. |

Used by the makefile (`make local` rebuilds pages from `html_src/*.ptml` and `templates/`):

| Script | What it does |
|---|---|
| `html_include.awk` | Expands `<!--include file.txt -->` lines from `$TEMPLATE_DIR`. |
| `html_checker.py` | Checks HTML tag nesting and flags stray `<` or `>`. Uses `html_content_spec.py`. |

`html_include.awk`, `html_checker.py` and `html_content_spec.py` came from
[gcallah/utils](https://github.com/gcallah/utils). This repository no longer uses
that submodule, so these copies can be changed here freely.
