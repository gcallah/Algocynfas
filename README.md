# Algocynfas
A project to animate Javascript algorithms using the HTML5 canvas element.

## Working on the site

- Pages in `html_src/*.ptml` are built into `.html` with `make local`, which
  pulls in the snippets in `templates/`. Other `.html` pages are edited directly.
- `bin/` holds the scripts used regularly: a local server, browser tests,
  screenshots, HTML checks and pushing to master. See [bin/README.md](bin/README.md).
