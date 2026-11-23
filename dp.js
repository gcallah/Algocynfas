/**
 * dp.js: dynamic programming and a greedy algorithm, animated with the List
 * and Grid classes in algocynfas.js.
 *   - Rod cutting                    (CLRS 15.1, EXTENDED-BOTTOM-UP-CUT-ROD)
 *   - Longest common subsequence     (CLRS 15.4, LCS-LENGTH and PRINT-LCS)
 *   - Activity selection             (CLRS 16.1, GREEDY-ACTIVITY-SELECTOR)
 */

const USED_COLOR = DEF_HL_COLOR;      // entries the current step reads
const CURRENT_COLOR = SWAP_COLOR;     // the entry being computed / considered
const CHOSEN_COLOR = '#8fd19e';       // part of the answer
const PATH_COLOR = '#c4d4ee';         // PRINT-LCS path cells that add no character
const REJECTED_COLOR = '#d5dbe0';

let canvases = {};
let drawables = [];       // Lists and Grids redrawn at each step
let animeRunning = false;

class Stopped extends Error {}

async function step(status = null) {
  if (!animeRunning) throw new Stopped();
  if (status !== null) setStatus(status);
  for (var d of drawables) {
    if (d instanceof List) {
      d.setDelay(0);
      await d.draw();
    } else {
      d.draw();
    }
  }
  await new Promise((resolve) => setTimeout(resolve, check_and_Delay()));
  if (!animeRunning) throw new Stopped();
}

function makeList(canvasName, name, keys, firstIndex) {
  var canvas = canvases[canvasName];
  canvas.clear();
  var list = createList(canvas, keys);
  list.drawIndices(firstIndex);
  list.drawName(name);
  return list;
}

function algoChoice() {
  return document.querySelector('input[name="algo"]:checked').id;
}

// Show the inputs and drawing area for the chosen algorithm.
function algoChanged() {
  var algo = algoChoice();
  for (var name of ["rod", "lcs", "activity"]) {
    for (var el of document.querySelectorAll("." + name + "-only")) {
      el.style.display = name === algo ? "" : "none";
    }
  }
  prepare();
}

function setSample() {
  var samples = {
    rodClrs: {algo: "rod", prices: "1, 5, 8, 9, 10, 17, 17, 20, 24, 30", n: "8"},   // CLRS Fig. 15.1
    rodFlat: {algo: "rod", prices: "3, 5, 8, 9, 10", n: "5"},
    lcsClrs: {algo: "lcs", x: "ABCBDAB", y: "BDCABA"},                              // CLRS Fig. 15.8
    lcsDna: {algo: "lcs", x: "GTTCCTAAT", y: "CGATAATTG"},
    actClrs: {algo: "activity", s: "1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12",              // CLRS 16.1
              f: "4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16"},
    actUnsorted: {algo: "activity", s: "5, 0, 8, 1, 3, 6", f: "9, 6, 11, 4, 5, 10"},
  };
  var s = samples[getHTML("sample").value];
  if (!s) return;
  getHTML(s.algo).checked = true;
  var fields = {prices: "prices", n: "rod-n", x: "lcs-x", y: "lcs-y", s: "act-s", f: "act-f"};
  for (var k in fields) if (s[k] !== undefined) getHTML(fields[k]).value = s[k];
  algoChanged();
}

// Read the inputs and draw the starting picture. Returns false on bad input.
function prepare() {
  getHTML("result").textContent = "";
  setStatus("");
  var algo = algoChoice();
  if (algo === "rod") return prepareRod();
  if (algo === "lcs") return prepareLcs();
  return prepareActivity();
}

async function run() {
  if (!prepare()) return;
  var runButton = getHTML("run-button");
  runButton.disabled = true;
  animeRunning = true;
  try {
    var algo = algoChoice();
    var result = algo === "rod" ? await rodCutting()
               : algo === "lcs" ? await lcs()
               : await activitySelection();
    await step("Done.");
    getHTML("result").textContent = result;
  } catch (e) {
    if (!(e instanceof Stopped)) throw e;
    setStatus("Stopped.");
  } finally {
    animeRunning = false;
    runButton.disabled = false;
  }
}

// ---------- Rod cutting (CLRS 15.1) ----------

let P = null, R = null, S = null, rodN = 0;

function prepareRod() {
  var prices = parseIntList(getHTML("prices").value, 0, 99, 10);
  if (prices === null) return false;
  rodN = parseInt(getHTML("rod-n").value);
  if (!(rodN >= 1 && rodN <= prices.length)) {
    noticeErr("The rod length n must be between 1 and " + prices.length +
              ", the number of prices given.");
    return false;
  }
  P = makeList("rodP", "p", prices, 1);
  R = makeList("rodR", "r", new Array(rodN + 1).fill(" "), 0);
  S = makeList("rodS", "s", new Array(rodN + 1).fill(" "), 0);
  drawables = [P, R, S];
  return true;
}

async function rodCutting() {
  var clear = () => { for (var l of [P, R, S]) { l.unhighlightAll(); l.setMarkers({}); } };
  R.setKey(0, 0);                                     // r[0] = 0
  await step("r[0] = 0: a rod of length 0 earns nothing.");
  for (var j = 1; j <= rodN; j++) {                   // for j = 1 to n
    var q = -Infinity;                                //   q = -∞
    for (var i = 1; i <= j; i++) {                    //   for i = 1 to j
      var p = P.elemAt(i - 1).getKey(), rest = R.elemAt(j - i).getKey();
      clear();
      P.colorElem(i - 1, USED_COLOR);
      R.colorElem(j - i, USED_COLOR);
      R.colorElem(j, CURRENT_COLOR);
      P.setMarkers({i: i - 1});
      R.setMarkers({"j-i": j - i, j: j});
      var better = q < p + rest;
      await step("Length " + j + ": first piece of length " + i + " earns p[" + i + "] + r[" +
                 (j - i) + "] = " + p + " + " + rest + " = " + (p + rest) +
                 (better ? (q === -Infinity ? "." : ", better than " + q + ".") :
                  ", not better than " + q + "."));
      if (better) {                                   //     if q < p[i] + r[j-i]
        q = p + rest;                                 //       q = p[i] + r[j-i]
        S.setKey(j, i);                               //       s[j] = i
      }
    }
    R.setKey(j, q);                                   //   r[j] = q
    clear();
    R.colorElem(j, CHOSEN_COLOR);
    S.colorElem(j, CHOSEN_COLOR);
    await step("r[" + j + "] = " + q + ", cutting off a first piece of length s[" + j + "] = " +
               S.elemAt(j).getKey() + ".");
  }
  // PRINT-CUT-ROD-SOLUTION(p, n)
  clear();
  var pieces = [];
  var n = rodN;
  while (n > 0) {                                     // while n > 0
    var piece = S.elemAt(n).getKey();
    pieces.push(piece);                               //   print s[n]
    S.colorElem(n, CHOSEN_COLOR);
    P.colorElem(piece - 1, CHOSEN_COLOR);
    S.setMarkers({n: n});
    await step("Cut off a piece of length s[" + n + "] = " + piece + "; " + (n - piece) +
               " left.");
    n = n - piece;                                    //   n = n - s[n]
  }
  return "Best revenue for a rod of length " + rodN + ": r[" + rodN + "] = " +
         R.elemAt(rodN).getKey() + ", cutting it into pieces of length " + pieces.join(" + ") + ".";
}

// ---------- Longest common subsequence (CLRS 15.4) ----------

let C = null, X = "", Y = "";

function prepareLcs() {
  X = getHTML("lcs-x").value.trim();
  Y = getHTML("lcs-y").value.trim();
  if (X.length < 1 || Y.length < 1 || X.length > 10 || Y.length > 10) {
    noticeErr("Please enter two sequences of 1 to 10 characters each.");
    return false;
  }
  var canvas = canvases.lcsGrid;
  canvas.clear();
  C = new Grid(canvas, X.length + 1, Y.length + 1, {cellW: 52, cellH: 40, x0: 70, y0: 58});
  C.setLabels([...Array(X.length + 1).keys()].map((i) => i === 0 ? "0" : i + "   " + X[i - 1]),
              [...Array(Y.length + 1).keys()].map((j) => j === 0 ? "0" : j + "\n" + Y[j - 1]));
  canvas.add(new fabric.Text("i  X", {left: 12, top: 30, fontSize: 14, fill: '#5b6770',
                                      fontFamily: DEF_FONT_FAMILY, selectable: false}));
  canvas.add(new fabric.Text("j\nY", {left: 44, top: 4, fontSize: 14, fill: '#5b6770',
                                      fontFamily: DEF_FONT_FAMILY, selectable: false,
                                      textAlign: 'center'}));
  drawables = [C];
  C.draw();
  return true;
}

async function lcs() {
  var m = X.length, n = Y.length;
  var c = [], b = [];
  for (var i = 0; i <= m; i++) { c.push(new Array(n + 1).fill(0)); b.push(new Array(n + 1).fill("")); }
  for (var i = 1; i <= m; i++) C.setKey(i, 0, 0);     // for i = 1 to m: c[i, 0] = 0
  for (var j = 0; j <= n; j++) C.setKey(0, j, 0);     // for j = 0 to n: c[0, j] = 0
  await step("Row 0 and column 0 are 0: an empty sequence has no common subsequence.");
  for (var i = 1; i <= m; i++) {                      // for i = 1 to m
    for (var j = 1; j <= n; j++) {                    //   for j = 1 to n
      C.uncolorAll();
      var why;
      if (X[i - 1] === Y[j - 1]) {                    //     if x_i == y_j
        c[i][j] = c[i - 1][j - 1] + 1;                //       c[i, j] = c[i-1, j-1] + 1
        b[i][j] = "↖";                                //       b[i, j] = "↖"
        C.colorCell(i - 1, j - 1, USED_COLOR);
        why = X[i - 1] + " = " + Y[j - 1] + ", so c[" + i + "," + j + "] = c[" + (i - 1) + "," +
              (j - 1) + "] + 1 = " + c[i][j] + ".";
      } else if (c[i - 1][j] >= c[i][j - 1]) {        //     elseif c[i-1, j] >= c[i, j-1]
        c[i][j] = c[i - 1][j];                        //       c[i, j] = c[i-1, j]
        b[i][j] = "↑";                                //       b[i, j] = "↑"
        C.colorCell(i - 1, j, USED_COLOR);
        C.colorCell(i, j - 1, USED_COLOR);
        why = X[i - 1] + " ≠ " + Y[j - 1] + ": take the larger of c[" + (i - 1) + "," + j +
              "] = " + c[i - 1][j] + " (above) and c[" + i + "," + (j - 1) + "] = " +
              c[i][j - 1] + " (left): above.";
      } else {
        c[i][j] = c[i][j - 1];                        //     else c[i, j] = c[i, j-1]
        b[i][j] = "←";                                //       b[i, j] = "←"
        C.colorCell(i - 1, j, USED_COLOR);
        C.colorCell(i, j - 1, USED_COLOR);
        why = X[i - 1] + " ≠ " + Y[j - 1] + ": take the larger of c[" + (i - 1) + "," + j +
              "] = " + c[i - 1][j] + " (above) and c[" + i + "," + (j - 1) + "] = " +
              c[i][j - 1] + " (left): left.";
      }
      C.setKey(i, j, b[i][j] + " " + c[i][j]);
      C.colorCell(i, j, CURRENT_COLOR);
      await step(why);
    }
  }
  // PRINT-LCS(b, X, i, j): follow the arrows back from c[m, n].
  C.uncolorAll();
  await step("The LCS has length c[" + m + "," + n + "] = " + c[m][n] +
             ". Follow the arrows back from the corner to read it off.");
  var chars = [];
  var i = m, j = n;
  while (i > 0 && j > 0) {                            // if i == 0 or j == 0: return
    if (b[i][j] === "↖") {                            // if b[i, j] == "↖"
      chars.unshift(X[i - 1]);                        //   PRINT-LCS(b, X, i-1, j-1); print x_i
      C.colorCell(i, j, CHOSEN_COLOR);
      await step("↖ at [" + i + "," + j + "]: " + X[i - 1] + " is in the LCS. So far: " +
                 chars.join(""));
      i--; j--;
    } else if (b[i][j] === "↑") {                     // elseif b[i, j] == "↑"
      C.colorCell(i, j, PATH_COLOR);
      await step("↑ at [" + i + "," + j + "]: go up.");
      i--;                                            //   PRINT-LCS(b, X, i-1, j)
    } else {
      C.colorCell(i, j, PATH_COLOR);
      await step("← at [" + i + "," + j + "]: go left.");
      j--;                                            // else PRINT-LCS(b, X, i, j-1)
    }
  }
  return c[m][n] === 0
    ? "X and Y have no characters in common: the LCS is empty."
    : "A longest common subsequence of " + X + " and " + Y + " is " + chars.join("") +
      " (length " + c[m][n] + ").";
}

// ---------- Activity selection (CLRS 16.1) ----------

let Sl = null, Fl = null, bars = [], acts = [];

function prepareActivity() {
  var s = parseIntList(getHTML("act-s").value, 0, 50, 14);
  if (s === null) return false;
  var f = parseIntList(getHTML("act-f").value, 0, 50, 14);
  if (f === null) return false;
  if (s.length !== f.length) {
    noticeErr("Please give the same number of start and finish times (" + s.length +
              " starts, " + f.length + " finishes).");
    return false;
  }
  for (var i = 0; i < s.length; i++) {
    if (s[i] >= f[i]) {
      noticeErr("Activity " + (i + 1) + " starts at " + s[i] + " but finishes at " + f[i] +
                ": each activity must finish after it starts.");
      return false;
    }
  }
  acts = s.map((si, i) => ({s: si, f: f[i]}));
  var sorted = acts.slice().sort((a, b) => a.f - b.f);
  if (sorted.some((a, i) => a !== acts[i])) {
    // The greedy algorithm assumes activities are sorted by finish time.
    acts = sorted;
    getHTML("act-s").value = acts.map((a) => a.s).join(", ");
    getHTML("act-f").value = acts.map((a) => a.f).join(", ");
    setStatus("The activities have been renumbered in order of finish time, as the algorithm assumes.");
  }
  Sl = makeList("actS", "s", acts.map((a) => a.s), 1);
  Fl = makeList("actF", "f", acts.map((a) => a.f), 1);
  drawTimeline();
  drawables = [Sl, Fl, {draw: () => canvases.actTimeline.renderAll()}];
  return true;
}

// One bar per activity, from its start time to its finish time.
function drawTimeline() {
  var canvas = canvases.actTimeline;
  canvas.clear();
  var maxT = Math.max(...acts.map((a) => a.f));
  var x0 = 50, width = canvas.width - x0 - 20, rowH = 24, y0 = 30;
  var xOf = (t) => x0 + t * width / maxT;
  canvas.setHeight(y0 + acts.length * rowH + 10);
  var text = (t, opts) => canvas.add(new fabric.Text(String(t), Object.assign(
    {fontSize: 13, fontFamily: DEF_FONT_FAMILY, fill: '#5b6770', selectable: false}, opts)));
  var tick = Math.max(1, Math.ceil(maxT / 16));
  for (var t = 0; t <= maxT; t += tick) {
    canvas.add(new fabric.Line([xOf(t), y0 - 4, xOf(t), y0 + acts.length * rowH],
                               {stroke: '#e3e8ec', selectable: false}));
    text(t, {left: xOf(t), top: y0 - 22, originX: CENTER});
  }
  bars = acts.map((a, i) => {
    text("a" + (i + 1), {left: x0 - 8, top: y0 + i * rowH + rowH / 2, originX: 'right',
                         originY: CENTER});
    var bar = new fabric.Rect({left: xOf(a.s), top: y0 + i * rowH + 3,
                               width: xOf(a.f) - xOf(a.s), height: rowH - 6, rx: 4, ry: 4,
                               fill: DEF_BG_COLOR, stroke: '#9aa6b2', selectable: false});
    canvas.add(bar);
    return bar;
  });
  canvas.renderAll();
}

function colorActivity(i, color) {
  bars[i].set('fill', color);
  Sl.colorElem(i, color);
  Fl.colorElem(i, color);
}

async function activitySelection() {
  var n = acts.length;
  var chosen = [0];                                   // A = {a1}
  var k = 0;                                          // k = 1
  colorActivity(0, CHOSEN_COLOR);
  Sl.setMarkers({k: 0});
  Fl.setMarkers({k: 0});
  await step("a1 finishes first, so choose it.");
  for (var m = 1; m < n; m++) {                       // for m = 2 to n
    colorActivity(m, CURRENT_COLOR);
    Sl.setMarkers({m: m});
    Fl.setMarkers({k: k});
    var fits = acts[m].s >= acts[k].f;
    await step("Does a" + (m + 1) + " start (s = " + acts[m].s + ") at or after a" + (k + 1) +
               " finishes (f = " + acts[k].f + ")? " + (fits ? "Yes: choose it." : "No: skip it."));
    if (fits) {                                       //   if s[m] >= f[k]
      chosen.push(m);                                 //     A = A ∪ {a_m}
      k = m;                                          //     k = m
      colorActivity(m, CHOSEN_COLOR);
    } else {
      colorActivity(m, REJECTED_COLOR);
    }
  }
  Sl.setMarkers({});
  Fl.setMarkers({});
  return "Chose " + chosen.length + " compatible activities: " +
         chosen.map((i) => "a" + (i + 1)).join(", ") + ".";   // return A
}
