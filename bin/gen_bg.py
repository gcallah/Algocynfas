#!/usr/bin/env python3
"""Generate the site's 'algorithmic' background: a random geometric graph
with a highlighted spanning tree (Prim's), in the site palette.

Usage: bin/gen_bg.py [output.svg]   (default: lib/images/algo-bg.svg)
Change the seed below to get a different layout.
"""
import math, os, random, sys
random.seed(7)
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "lib", "images", "algo-bg.svg")
W, H = 1600, 1000
FOREST, CYAN, BLUE, VIOLET, SILVER = "#2f6f45", "#1fa5b8", "#2b5ea7", "#6b4fa0", "#9aa6b2"

# Jittered grid of points so nodes are spread evenly.
step = 110
pts = []
for gy in range(-1, H // step + 2):
    for gx in range(-1, W // step + 2):
        if random.random() < 0.18:
            continue
        pts.append((gx * step + random.uniform(-38, 38) + (gy % 2) * step / 2,
                    gy * step + random.uniform(-38, 38)))
n = len(pts)
d = lambda a, b: math.dist(pts[a], pts[b])

# Edges: connect each node to its 3 nearest neighbours.
edges = set()
for i in range(n):
    for j in sorted(range(n), key=lambda j: d(i, j))[1:4]:
        edges.add((min(i, j), max(i, j)))

# Prim's MST over those edges, from the node nearest the centre.
adj = {i: [] for i in range(n)}
for a, b in edges:
    adj[a].append(b); adj[b].append(a)
start = min(range(n), key=lambda i: math.dist(pts[i], (W / 2, H / 2)))
in_tree, tree, depth = {start}, [], {start: 0}
while True:
    cand = [(d(a, b), a, b) for a in in_tree for b in adj[a] if b not in in_tree]
    if not cand:
        break
    _, a, b = min(cand)
    in_tree.add(b); tree.append((a, b)); depth[b] = depth[a] + 1
tree_set = {(min(a, b), max(a, b)) for a, b in tree}
maxd = max(depth.values()) or 1

def colour(k):
    """Colour by BFS-ish depth from the start: forest -> cyan -> blue -> violet."""
    t = k / maxd
    return FOREST if t < .25 else CYAN if t < .5 else BLUE if t < .75 else VIOLET

out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">',
       f'<g stroke="{SILVER}" stroke-width="1.2" opacity="0.55">']
for a, b in sorted(edges - tree_set):
    (x1, y1), (x2, y2) = pts[a], pts[b]
    out.append(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}"/>')
out.append('</g><g stroke-width="2.4" stroke-linecap="round" opacity="0.8">')
for a, b in tree:
    (x1, y1), (x2, y2) = pts[a], pts[b]
    out.append(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{colour(depth[b])}"/>')
out.append('</g><g>')
for i, (x, y) in enumerate(pts):
    c = colour(depth.get(i, maxd))
    r = 7 if i == start else 4.5
    out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="#fff" stroke="{c}" stroke-width="2"/>')
out.append('</g></svg>')
open(OUT, "w").write("\n".join(out))
print(n, "nodes,", len(edges), "edges,", len(tree), "tree edges")
