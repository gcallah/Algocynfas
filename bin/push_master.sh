#!/bin/sh
# Push the current commit straight to master (this repo doesn't use branches
# or pull requests). Refuses if master has moved on and this isn't a
# fast-forward; pull or rebase first in that case.
# Usage: bin/push_master.sh

git fetch -q origin || exit 1
if ! git merge-base --is-ancestor origin/master HEAD; then
    echo "push_master.sh: origin/master has commits you don't have; pull first." >&2
    exit 1
fi
git push origin HEAD:master
