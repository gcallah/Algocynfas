// Shared driver for the browser tests in this directory (run them with bin/browser_tests.sh).
// Each test page loads a site page in an iframe, drives it, and writes lines to <pre id="out">:
//   "OK   ..." or "FAIL ..." for checks, "ERROR ..." for uncaught errors, and "DONE" at the end.

const REPO = new URL('../../', location.href).href;
const out = document.createElement('pre');
out.id = 'out';
document.body.appendChild(out);

const log = (s) => out.textContent += s + "\n";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

window.onerror = (m, src, line) => log("ERROR " + m + " " + src + ":" + line);
window.addEventListener('unhandledrejection',
  (e) => log("ERROR " + (e.reason && e.reason.stack || e.reason)));

function check(ok, label, detail = "") {
  log((ok ? "OK   " : "FAIL ") + label + (!ok && detail ? "\n     " + detail : ""));
}

// Load a site page in an iframe. Alerts are recorded in f.alerts (and logged)
// instead of blocking.
function load(page) {
  return new Promise((res) => {
    const f = document.createElement('iframe');
    f.style.cssText = "width:1100px;height:900px;border:0";
    f.alerts = [];
    f.onload = () => {
      const w = f.contentWindow;
      w.alert = (m) => { f.alerts.push(String(m)); log("     (alert: " + m + ")"); };
      w.addEventListener('error', (e) => log("ERROR in " + page + ": " + e.message + " line " + e.lineno));
      w.addEventListener('unhandledrejection',
        (e) => log("ERROR in " + page + ": " + (e.reason && e.reason.message || e.reason)));
      res(f);
    };
    f.src = REPO + page;
    document.body.appendChild(f);
  });
}

// Wait until the page's Run button is enabled again (the animation finished).
async function waitDone(d, id = 'run-button') {
  await sleep(50);
  for (let t = 0; t < 4000 && d.getElementById(id).disabled; t++) await sleep(100);
}

// Run an async test body, then print DONE (or the error that stopped it).
function runTests(body) {
  body().then(() => log("DONE"), (e) => log("ERROR " + (e && e.stack || e)));
}

// Floyd-Warshall distances, as an independent check on the graph algorithms.
// edges: "a-b, b-c"; weights: "3, 4" or null for unweighted.
function allPairs(n, edges, weights, directed) {
  const E = edges.split(',').map((s) => s.trim()).filter(Boolean)
    .map((s) => s.split('-').map((c) => c.charCodeAt(0) - 97));
  const W = weights ? weights.split(',').map(Number) : E.map(() => 1);
  const D = [...Array(n)].map((_, i) => [...Array(n)].map((_, j) => i === j ? 0 : Infinity));
  E.forEach(([u, v], i) => {
    D[u][v] = Math.min(D[u][v], W[i]);
    if (!directed) D[v][u] = Math.min(D[v][u], W[i]);
  });
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (D[i][k] + D[k][j] < D[i][j]) D[i][j] = D[i][k] + D[k][j];
  return {E, D, negCycle: D.some((r, i) => r[i] < 0)};
}

const vname = (i) => String.fromCharCode(97 + i);
const vindex = (c) => c.charCodeAt(0) - 97;

// Parse "x: d = 3" lines from a result into an array of distances.
function parseDistances(text, n) {
  return [...Array(n)].map((_, v) => {
    const m = text.match(new RegExp('^' + vname(v) + ': d = (\\S+)', 'm'));
    return m ? (m[1] === '∞' ? Infinity : +m[1]) : undefined;
  });
}
