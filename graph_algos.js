/**
 * graph_algos.js: graph algorithms animated on the sigma graphs built by graph.js.
 *   - Breadth-first search            (CLRS 22.2)
 *   - Depth-first search              (CLRS 22.3)
 *   - Topological sort                (CLRS 22.4)
 *   - Strongly connected components   (CLRS 22.5)
 *   - Bellman-Ford                    (CLRS 24.1)
 *   - Dijkstra                        (CLRS 24.3)
 * Vertices are named a, b, c, ... and stored as indices 0, 1, 2, ...
 * The page must define GRAPH_CONTAINER and WEIGHTED, and may define ALLOW_NEGATIVE_WEIGHTS.
 */

// Globals graph.js expects.
let inputType = "num";
let dir = 0;
let weight = 0;
let Graph = null;
let animeRunning = false;

// Colours (site palette). White/gray/black are the CLRS vertex colours.
const V_WHITE = '#b8c2cc';      // undiscovered
const V_GRAY = '#1fa5b8';       // discovered, not finished
const V_BLACK = '#2f6f45';      // finished
const V_CURRENT = '#b23a5a';    // the vertex u being processed
const E_PLAIN = '#9aa6b2';
const E_EXAMINE = '#2b5ea7';    // the edge being looked at
const E_TREE = '#6b4fa0';       // tree / shortest-path edges
const E_BAD = '#b23a5a';        // back edge that makes a cycle, or a negative cycle
const COMPONENT_COLORS = ['#2f6f45', '#1fa5b8', '#6b4fa0', '#d98b2b', '#2b5ea7',
                          '#b23a5a', '#7a9a2e', '#8c6d46'];

class Stopped extends Error {}
class GraphError extends Error {}

const vname = (i) => letterNumConvert(i);

// ---------- Reading the input and drawing the graph ----------

// Parse the inputs into {n, directed, edges: [{id, u, v, w}], adj}.
function readGraph() {
  var n = parseInt(getHTML("nodeNum").value);
  if (!(n >= 1 && n <= 16)) {
    noticeErr("Please enter a number of vertices from 1 to 16.", "nodeNum");
    return null;
  }
  correctErr("nodeNum");
  var directed = getHTML("graphType").value === "dir";
  var text = getHTML("edges").value.trim();
  var ids = text === "" ? [] : splitInput(text, true).filter((s) => s !== "");
  var weights = WEIGHTED ? splitInput(getHTML("weights").value, true).filter((s) => s !== "") : [];
  if (WEIGHTED && weights.length !== ids.length) {
    noticeErr("Please give exactly one weight per edge (" + ids.length + " edges, " +
              weights.length + " weights).", "weights");
    return null;
  }
  var edges = [], seen = new Set();
  for (var i = 0; i < ids.length; i++) {
    var parts = ids[i].split("-");
    var u = letterNumConvert(parts[0]), v = letterNumConvert(parts[1]);
    if (parts.length !== 2 || u === undefined || v === undefined || u >= n || v >= n) {
      noticeErr("\"" + ids[i] + "\" is not an edge between two of the vertices a.." +
                vname(n - 1) + ". Write edges like a-b, b-c.", "edges");
      return null;
    }
    if (u === v) {
      noticeErr("Self-loops like " + ids[i] + " aren't supported.", "edges");
      return null;
    }
    var key = directed ? ids[i] : [Math.min(u, v), Math.max(u, v)].join("-");
    // Weighted edges in both directions would draw their weights on top of each other.
    if (seen.has(key) || (directed && WEIGHTED && seen.has(parts[1] + "-" + parts[0]))) {
      noticeErr("Edge " + ids[i] + " is given twice" +
                (directed && WEIGHTED ? " (or in both directions, which can't be drawn clearly)" : "") +
                ".", "edges");
      return null;
    }
    seen.add(key);
    var w = 1;
    if (WEIGHTED) {
      if (!/^-?\d+$/.test(weights[i])) {
        noticeErr("Weight \"" + weights[i] + "\" is not a whole number.", "weights");
        return null;
      }
      w = parseInt(weights[i]);
      if (w < 0 && !negativeWeightsAllowed()) {
        noticeErr("Negative weights aren't allowed here.", "weights");
        return null;
      }
    }
    edges.push({id: ids[i], u: u, v: v, w: w});
  }
  correctErr("edges");
  if (WEIGHTED) correctErr("weights");
  return {n: n, directed: directed, edges: edges, adj: adjacency(n, edges, directed)};
}

// Adjacency lists, each sorted by vertex name so runs match the CLRS figures.
function adjacency(n, edges, directed) {
  var adj = [];
  for (var i = 0; i < n; i++) adj.push([]);
  for (var e of edges) {
    adj[e.u].push({v: e.v, w: e.w, id: e.id});
    if (!directed) adj[e.v].push({v: e.u, w: e.w, id: e.id});
  }
  for (var list of adj) list.sort((x, y) => x.v - y.v);
  return adj;
}

// The transpose G^T: every edge reversed (CLRS 22.5).
function transpose(g) {
  return adjacency(g.n, g.edges.map((e) => ({id: e.id, u: e.v, v: e.u, w: e.w})), true);
}

// Read the inputs and draw a fresh graph (which also clears colours from a previous run).
function drawGraph() {
  getHTML("result").textContent = "";
  var g = readGraph();
  if (g === null) return null;
  dir = g.directed ? 1 : 0;
  weight = WEIGHTED ? 1 : 0;
  Graph = null;
  createGraph(g.edges.length > 0, GRAPH_CONTAINER);
  if (Graph === null || Graph.sigma === null) return null;
  placeVertices(g);
  Graph.sigma.settings({minEdgeSize: 1.5, maxEdgeSize: 4, defaultLabelSize: 15,
                        edgeLabelSize: 'fixed', defaultEdgeLabelSize: 15});
  g.edgeColor = {};
  g.plainSize = g.directed ? 2 : 1;   // directed edges need room for an arrowhead
  for (var e of g.edges) setEdge(g, e.id, E_PLAIN, g.plainSize);
  for (var i = 0; i < g.n; i++) setVertex(i, V_WHITE, "");
  refresh();
  getHTML("result").textContent = "";
  setStatus("");
  return g;
}

// Sample graphs can supply CLRS-style positions; they apply only while the
// vertex count and edges are still exactly the sample's.
let sampleLayout = null;   // {key, pos: [[x, y], ...]}

function layoutKey() {
  return getHTML("nodeNum").value.trim() + "|" + getHTML("edges").value.replace(/\s/g, "");
}

// Put the vertices on a circle, where no edge can pass through another vertex
// (graph.js's fixed layouts put some vertices in a straight line), or use the
// sample's own layout.
function placeVertices(g) {
  var pos = sampleLayout && sampleLayout.key === layoutKey() ? sampleLayout.pos : null;
  var radius = 190;
  for (var i = 0; i < g.n; i++) {
    var node = Graph.sigma.graph.nodes(String(i));
    if (pos) {
      [node.x, node.y] = pos[i];
    } else if (g.n === 1) {
      node.x = node.y = 0;
    } else {
      var angle = 2 * Math.PI * i / g.n;
      node.x = Math.round(radius * 1.3 * Math.sin(angle));
      node.y = Math.round(-radius * Math.cos(angle));
    }
  }
}

// Positions for a CLRS-style grid: rows of vertex names, e.g. ["abcd", "efgh"].
// A space leaves a gap, e.g. [" bc", "a  ", " de"].
function gridLayout(rows) {
  var pos = [];
  rows.forEach((row, r) => {
    for (var c = 0; c < row.length; c++) {
      if (row[c] === " ") continue;
      pos[letterNumConvert(row[c])] = [(c - (row.length - 1) / 2) * 150,
                                       (r - (rows.length - 1) / 2) * 200];
    }
  });
  return pos;
}

function setVertex(i, color, note = null) {
  var node = Graph.sigma.graph.nodes(String(i));
  node.color = color;
  if (note !== null) node.label = note === "" ? vname(i) : vname(i) + "  " + note;
}

// Colour an edge and remember the colour, so a temporary highlight can be undone.
function setEdge(g, id, color, size = 1) {
  var edge = Graph.sigma.graph.edges(id);
  edge.color = color;
  edge.size = size;
  g.edgeColor[id] = [color, size];
}

function flashEdge(id) {
  var edge = Graph.sigma.graph.edges(id);
  edge.color = E_EXAMINE;
  edge.size = 3;
}

function unflashEdge(g, id) {
  var edge = Graph.sigma.graph.edges(id);
  [edge.color, edge.size] = g.edgeColor[id];
}

function refresh() {
  Graph.sigma.refresh();
}

// Redraw and pause; abandon the run if the user pressed Stop.
async function step(status = null) {
  if (!animeRunning) throw new Stopped();
  if (status !== null) setStatus(status);
  refresh();
  await new Promise((resolve) => setTimeout(resolve, check_and_Delay()));
  if (!animeRunning) throw new Stopped();
}

function readStart(g) {
  var s = letterNumConvert(getHTML("start").value.trim());
  if (s === undefined || s >= g.n) {
    noticeErr("The source vertex must be one of a.." + vname(g.n - 1) + ".", "start");
    return null;
  }
  correctErr("start");
  return s;
}

const showDist = (d) => d === Infinity ? "∞" : String(d);

function pathTo(pi, s, v) {
  var path = [];
  for (var x = v; x !== null; x = pi[x]) path.unshift(vname(x));
  return path.join(" → ");
}

function distanceReport(g, s, d, pi) {
  var lines = [];
  for (var v = 0; v < g.n; v++) {
    lines.push(vname(v) + ": d = " + showDist(d[v]) +
               (d[v] === Infinity ? "  (unreachable from " + vname(s) + ")"
                                  : "  path " + pathTo(pi, s, v)));
  }
  return lines.join("\n");
}

// Run fn(g) on a freshly drawn graph, handling Run/Stop and errors.
async function runAlgorithm(fn) {
  var g = drawGraph();
  if (g === null) return;
  var runButton = getHTML("run-button");
  runButton.disabled = true;
  animeRunning = true;
  try {
    getHTML("result").textContent = await fn(g);
    refresh();
  } catch (e) {
    if (e instanceof Stopped) {
      setStatus("Stopped.");
    } else if (e instanceof GraphError) {
      refresh();
      getHTML("result").textContent = e.message;
    } else {
      throw e;
    }
  } finally {
    animeRunning = false;
    runButton.disabled = false;
  }
}

// ---------- Breadth-first search (CLRS 22.2) ----------

async function bfs(g, s) {
  var color = [], d = [], pi = [];
  for (var u = 0; u < g.n; u++) {                    // for each vertex u in G.V - {s}
    color[u] = "WHITE";                              //   u.color = WHITE
    d[u] = Infinity;                                 //   u.d = ∞
    pi[u] = null;                                    //   u.π = NIL
    setVertex(u, V_WHITE, "∞");
  }
  color[s] = "GRAY";                                 // s.color = GRAY
  d[s] = 0;                                          // s.d = 0
  setVertex(s, V_GRAY, "0");
  var Q = [s];                                       // Q = Ø; ENQUEUE(Q, s)
  var showQ = () => "Q = [" + Q.map(vname).join(", ") + "]";
  await step("Start at " + vname(s) + ". " + showQ());
  while (Q.length > 0) {                             // while Q ≠ Ø
    var u = Q.shift();                               //   u = DEQUEUE(Q)
    setVertex(u, V_CURRENT);
    await step("u = DEQUEUE(Q) = " + vname(u) + ". " + showQ());
    for (var e of g.adj[u]) {                        //   for each v in G.Adj[u]
      var v = e.v;
      flashEdge(e.id);
      await step("Look at edge " + vname(u) + "–" + vname(v) + ": " + vname(v) + " is " +
                 color[v].toLowerCase() + ".");
      if (color[v] === "WHITE") {                    //     if v.color == WHITE
        color[v] = "GRAY";                           //       v.color = GRAY
        d[v] = d[u] + 1;                             //       v.d = u.d + 1
        pi[v] = u;                                   //       v.π = u
        Q.push(v);                                   //       ENQUEUE(Q, v)
        setVertex(v, V_GRAY, String(d[v]));
        setEdge(g, e.id, E_TREE, 3);
        await step("Discover " + vname(v) + " with d = " + d[v] + ". " + showQ());
      } else {
        unflashEdge(g, e.id);
      }
    }
    color[u] = "BLACK";                              //   u.color = BLACK
    setVertex(u, V_BLACK);
    await step(vname(u) + " is finished. " + showQ());
  }
  setStatus("Q is empty: done. Purple edges form the breadth-first tree.");
  return distanceReport(g, s, d, pi);
}

// ---------- Depth-first search (CLRS 22.3) ----------
// hooks.order:      the order in which DFS tries vertices as roots
// hooks.adj:        adjacency lists to search (G, or G^T for SCC)
// hooks.onBackEdge: called on a back edge (topological sort uses this to report a cycle)
// hooks.onFinish:   called when a vertex is finished
// hooks.onRoot:     called when a new depth-first tree is started
// hooks.colorFor:   colour for finished vertices and tree edges (SCC colours by tree)

async function dfs(g, hooks = {}) {
  var adj = hooks.adj || g.adj;
  var order = hooks.order || [...Array(g.n).keys()];
  var color = [], pi = [], d = [], f = [];
  var time = 0;
  for (var u = 0; u < g.n; u++) {                    // for each vertex u in G.V
    color[u] = "WHITE";                              //   u.color = WHITE
    pi[u] = null;                                    //   u.π = NIL
    setVertex(u, V_WHITE, "");
  }
  var treeColor = () => hooks.colorFor ? hooks.colorFor() : E_TREE;

  async function visit(u) {                          // DFS-VISIT(G, u)
    time = time + 1;                                 //   time = time + 1
    d[u] = time;                                     //   u.d = time
    color[u] = "GRAY";                               //   u.color = GRAY
    setVertex(u, V_CURRENT, d[u] + "/");
    await step("Discover " + vname(u) + " at time " + time + ".");
    setVertex(u, V_GRAY);
    for (var e of adj[u]) {                          //   for each v in G.Adj[u]
      var v = e.v;
      flashEdge(e.id);
      await step("Explore edge " + vname(u) + "→" + vname(v) + ": " + vname(v) + " is " +
                 color[v].toLowerCase() + ".");
      if (color[v] === "WHITE") {                    //     if v.color == WHITE
        pi[v] = u;                                   //       v.π = u
        setEdge(g, e.id, treeColor(), 3);
        await visit(v);                              //       DFS-VISIT(G, v)
        setVertex(u, V_CURRENT);
        await step("Back at " + vname(u) + ".");
        setVertex(u, V_GRAY);
      } else if (color[v] === "GRAY" && (g.directed || pi[u] !== v)) {
        if (hooks.onBackEdge) {
          setEdge(g, e.id, E_BAD, 3);
          await hooks.onBackEdge(u, v);
        }
        unflashEdge(g, e.id);
      } else {
        unflashEdge(g, e.id);
      }
    }
    color[u] = "BLACK";                              //   u.color = BLACK
    time = time + 1;                                 //   time = time + 1
    f[u] = time;                                     //   u.f = time
    setVertex(u, hooks.colorFor ? hooks.colorFor() : V_BLACK, d[u] + "/" + f[u]);
    if (hooks.onFinish) hooks.onFinish(u);
    await step("Finish " + vname(u) + " at time " + time + ".");
  }

  for (var u of order) {                             // for each vertex u in G.V
    if (color[u] === "WHITE") {                      //   if u.color == WHITE
      if (hooks.onRoot) hooks.onRoot(u);
      await visit(u);                                //     DFS-VISIT(G, u)
    }
  }
  return {d: d, f: f, pi: pi};
}

async function depthFirstSearch(g, s) {
  // Start from the chosen vertex, then try the rest in alphabetical order.
  var order = [s, ...[...Array(g.n).keys()].filter((u) => u !== s)];
  var r = await dfs(g, {order: order});
  setStatus("Done. Purple edges form the depth-first forest; labels show discovery/finish times.");
  var lines = [];
  for (var u = 0; u < g.n; u++) {
    lines.push(vname(u) + ": d = " + r.d[u] + ", f = " + r.f[u] +
               (r.pi[u] === null ? "  (root of a tree)" : "  (parent " + vname(r.pi[u]) + ")"));
  }
  return lines.join("\n");
}

// ---------- Topological sort (CLRS 22.4) ----------

async function topologicalSort(g) {
  if (!g.directed) {
    throw new GraphError("Topological sort needs a directed graph: set the graph type to Directed.");
  }
  var list = [];                                     // a linked list of vertices
  await dfs(g, {                                     // call DFS(G) to compute finishing times
    onFinish: (u) => {
      list.unshift(u);                               // as each vertex is finished, insert it
      setStatus("List: " + list.map(vname).join(", "));   // onto the front of the list
    },
    onBackEdge: async (u, v) => {
      await step("Edge " + vname(u) + "→" + vname(v) + " goes back to a vertex still being " +
                 "explored: a cycle.");
      throw new GraphError("The graph has a cycle (through edge " + vname(u) + "→" + vname(v) +
                           "), so it has no topological order.");
    },
  });
  setStatus("Done. Each vertex was put at the front of the list as it finished.");
  return "Topological order: " + list.map(vname).join(", ");   // return the linked list
}

// ---------- Strongly connected components (CLRS 22.5) ----------

async function stronglyConnectedComponents(g) {
  if (!g.directed) {
    throw new GraphError("Strongly connected components are defined for directed graphs: " +
                         "set the graph type to Directed.");
  }
  setStatus("Step 1: DFS(G) to compute finishing times.");
  var first = await dfs(g);                          // call DFS(G) to compute u.f
  await step("Step 2: compute G^T, the graph with every edge reversed.");
  var gt = transpose(g);                             // compute G^T
  var order = [...Array(g.n).keys()].sort((x, y) => first.f[y] - first.f[x]);
  await step("Step 3: DFS(G^T), taking vertices in order of decreasing finishing time: " +
             order.map(vname).join(", ") + ". Edges are now followed against their arrows.");
  for (var e of g.edges) setEdge(g, e.id, E_PLAIN, g.plainSize);
  var components = [];
  await dfs(g, {                                     // call DFS(G^T), main loop in order of
    adj: gt, order: order,                           //   decreasing u.f
    onRoot: (u) => components.push([]),
    onFinish: (u) => components[components.length - 1].push(u),
    colorFor: () => COMPONENT_COLORS[(components.length - 1) % COMPONENT_COLORS.length],
  });
  // Each tree of the second DFS is one strongly connected component.
  var label = (c) => "{" + c.slice().sort((x, y) => x - y).map(vname).join(", ") + "}";
  setStatus("Done. Each colour is one strongly connected component.");
  return components.length + " strongly connected component" +
         (components.length === 1 ? "" : "s") + ": " + components.map(label).join(", ");
}

// ---------- Shortest paths: shared pieces (CLRS 24) ----------

function initializeSingleSource(g, s, d, pi, piEdge) {
  for (var v = 0; v < g.n; v++) {                    // for each vertex v in G.V
    d[v] = Infinity;                                 //   v.d = ∞
    pi[v] = null;                                    //   v.π = NIL
    piEdge[v] = null;
    setVertex(v, V_WHITE, "∞");
  }
  d[s] = 0;                                          // s.d = 0
  setVertex(s, V_GRAY, "0");
}

// RELAX(u, v, w). Returns true if v.d went down.
function relax(g, u, e, d, pi, piEdge) {
  var v = e.v;
  if (d[v] > d[u] + e.w) {                           // if v.d > u.d + w(u, v)
    d[v] = d[u] + e.w;                               //   v.d = u.d + w(u, v)
    pi[v] = u;                                       //   v.π = u
    if (piEdge[v] !== null && piEdge[v] !== e.id) setEdge(g, piEdge[v], E_PLAIN, g.plainSize);
    piEdge[v] = e.id;
    setEdge(g, e.id, E_TREE, 3);
    setVertex(v, V_GRAY, String(d[v]));
    return true;
  }
  return false;
}

// ---------- Dijkstra (CLRS 24.3) ----------

async function dijkstra(g, s) {
  if (g.edges.some((e) => e.w < 0)) {
    throw new GraphError("Dijkstra's algorithm requires non-negative edge weights. " +
                         "Use Bellman-Ford for graphs with negative weights.");
  }
  var d = [], pi = [], piEdge = [];
  initializeSingleSource(g, s, d, pi, piEdge);       // INITIALIZE-SINGLE-SOURCE(G, s)
  var S = [];                                        // S = Ø
  var Q = [...Array(g.n).keys()];                    // Q = G.V
  await step("All d = ∞ except d(" + vname(s) + ") = 0. S = { }");
  while (Q.length > 0) {                             // while Q ≠ Ø
    var best = 0;
    for (var k = 1; k < Q.length; k++) if (d[Q[k]] < d[Q[best]]) best = k;
    var u = Q.splice(best, 1)[0];                    //   u = EXTRACT-MIN(Q)
    S.push(u);                                       //   S = S ∪ {u}
    setVertex(u, V_CURRENT);
    await step("u = EXTRACT-MIN(Q) = " + vname(u) + " (d = " + showDist(d[u]) + "). S = {" +
               S.map(vname).join(", ") + "}");
    for (var e of g.adj[u]) {                        //   for each vertex v in G.Adj[u]
      flashEdge(e.id);
      await step("Relax " + vname(u) + "→" + vname(e.v) + ": is " + showDist(d[e.v]) +
                 " > " + showDist(d[u]) + " + " + e.w + "?");
      if (relax(g, u, e, d, pi, piEdge)) {           //     RELAX(u, v, w)
        await step("Yes: d(" + vname(e.v) + ") = " + d[e.v] + ", π(" + vname(e.v) + ") = " +
                   vname(u) + ".");
      } else {
        unflashEdge(g, e.id);
      }
    }
    setVertex(u, V_BLACK);
  }
  await step("Q is empty: done. Purple edges form the shortest-paths tree.");
  return distanceReport(g, s, d, pi);
}

// ---------- Bellman-Ford (CLRS 24.1) ----------

async function bellmanFord(g, s) {
  var d = [], pi = [], piEdge = [];
  initializeSingleSource(g, s, d, pi, piEdge);       // INITIALIZE-SINGLE-SOURCE(G, s)
  // Each undirected edge counts as one edge in each direction.
  var E = [];
  for (var e of g.edges) {
    E.push({u: e.u, v: e.v, w: e.w, id: e.id});
    if (!g.directed) E.push({u: e.v, v: e.u, w: e.w, id: e.id});
  }
  await step("All d = ∞ except d(" + vname(s) + ") = 0.");
  for (var i = 1; i <= g.n - 1; i++) {               // for i = 1 to |G.V| - 1
    var changed = false;
    for (var e of E) {                               //   for each edge (u, v) in G.E
      flashEdge(e.id);
      setVertex(e.u, V_CURRENT);
      await step("Pass " + i + " of " + (g.n - 1) + ": relax " + vname(e.u) + "→" +
                 vname(e.v) + " (" + showDist(d[e.u]) + " + " + e.w + " vs " +
                 showDist(d[e.v]) + ").");
      setVertex(e.u, d[e.u] === Infinity ? V_WHITE : V_GRAY);
      if (relax(g, e.u, e, d, pi, piEdge)) {         //     RELAX(u, v, w)
        changed = true;
      } else {
        unflashEdge(g, e.id);
      }
    }
    if (!changed) {
      // Not in the CLRS pseudocode, but a common shortcut: nothing changed, so
      // later passes would change nothing either.
      await step("No d value changed in pass " + i + ", so the remaining passes are skipped.");
      break;
    }
  }
  for (var e of E) {                                 // for each edge (u, v) in G.E
    if (d[e.v] > d[e.u] + e.w) {                     //   if v.d > u.d + w(u, v)
      setEdge(g, e.id, E_BAD, 3);
      await step("Edge " + vname(e.u) + "→" + vname(e.v) + " can still be relaxed: " +
                 "there is a negative-weight cycle.");
      throw new GraphError("Bellman-Ford returns FALSE: a negative-weight cycle is reachable " +
                           "from " + vname(s) + " (edge " + vname(e.u) + "→" + vname(e.v) +
                           " could still be relaxed), so shortest paths are not defined.");
    }
  }
  for (var v = 0; v < g.n; v++) setVertex(v, d[v] === Infinity ? V_WHITE : V_BLACK);
  await step("No edge can be relaxed further: Bellman-Ford returns TRUE.");
  return "Bellman-Ford returns TRUE (no negative-weight cycle).\n" + distanceReport(g, s, d, pi);
}

// ---------- Page wiring ----------

function algoChoice() {
  return document.querySelector('input[name="algo"]:checked').id;
}

// Algorithms that start from a source vertex show the "start" box.
function algoChanged() {
  getHTML("start-group").style.display = NEEDS_SOURCE.includes(algoChoice()) ? "" : "none";
}

function run() {
  var algo = algoChoice();
  runAlgorithm(async (g) => {
    var s = null;
    if (NEEDS_SOURCE.includes(algo)) {
      s = readStart(g);
      if (s === null) return "";
    }
    return await ALGORITHMS[algo](g, s);
  });
}

// samples: {key: {n, type, edges, weights, start, algo, note, grid}}
function setGraphSample(samples) {
  var s = samples[getHTML("graphSample").value];
  if (!s) return;
  getHTML("nodeNum").value = s.n;
  getHTML("graphType").value = s.type;
  getHTML("edges").value = s.edges;
  if (WEIGHTED) getHTML("weights").value = s.weights;
  if (s.start) getHTML("start").value = s.start;
  if (s.algo) {
    getHTML(s.algo).checked = true;
    algoChanged();
  }
  sampleLayout = s.grid ? {key: layoutKey(), pos: gridLayout(s.grid)} : null;
  drawGraph();
  setStatus(s.note || "");
}
