/**
 * linearSort.js: sorting in linear time, animated with the List class in algocynfas.js.
 *   - Counting sort  (CLRS 8.2)
 *   - Radix sort     (CLRS 8.3), using counting sort as the stable sort on each digit
 * A and B are shown 1-based and C is shown 0-based, as in CLRS.
 */

const READ_COLOR = SWAP_COLOR;        // the element of A being read
const COUNT_COLOR = DEF_HL_COLOR;     // the entry of C being changed
const WRITTEN_COLOR = '#8fd19e';      // an element placed in B
const MAX_N = 12;

let A = null, B = null, C = null;
let canvases = {};
let animeRunning = false;
let statusPrefix = "";   // e.g. "Pass 2 (tens digit): " during radix sort

class Stopped extends Error {}

// Redraw all three arrays, then pause once. Abandon the run if Stop was pressed.
async function step(status = null) {
  if (!animeRunning) throw new Stopped();
  if (status !== null) setStatus(statusPrefix + status);
  for (var list of [A, B, C]) {
    list.setDelay(0);
    await list.draw();
  }
  await new Promise((resolve) => setTimeout(resolve, check_and_Delay()));
  if (!animeRunning) throw new Stopped();
}

function makeList(name, keys, firstIndex) {
  var canvas = canvases[name];
  canvas.clear();
  var list = createList(canvas, keys);
  list.drawIndices(firstIndex);
  list.drawName(name);
  return list;
}

function algoChoice() {
  return document.querySelector('input[name="algo"]:checked').id;
}

function algoChanged() {
  var radix = algoChoice() === "radix";
  getHTML("k-group").style.display = radix ? "none" : "";
  getHTML("d-group").style.display = radix ? "" : "none";
  getHTML("number-input").placeholder = radix
    ? "Up to 12 integers from 0 to 999" : "Up to 12 integers from 0 to k";
  setSample(radix ? "radix" : "clrs");
}

function setSample(choice) {
  var samples = {
    clrs: ["2, 5, 3, 0, 2, 3, 0, 3", "5", null],          // CLRS Figure 8.2
    dups: ["1, 4, 1, 2, 7, 5, 2, 1, 4", "7", null],
    small: ["3, 1, 2, 0, 1", "3", null],
    radix: ["329, 457, 657, 839, 436, 720, 355", null, "3"],  // CLRS Figure 8.3
    radix2: ["53, 9, 81, 27, 40, 66, 12, 95, 30", null, "2"],
  };
  var s = samples[choice || getHTML("sample").value];
  if (!s) return;
  getHTML("number-input").value = s[0];
  if (s[1] !== null) getHTML("k-input").value = s[1];
  if (s[2] !== null) getHTML("d-input").value = s[2];
  if (!choice) {
    // Picking a sample also picks the matching algorithm.
    getHTML(s[2] !== null ? "radix" : "counting").checked = true;
    algoChanged();
    getHTML("number-input").value = s[0];
    if (s[1] !== null) getHTML("k-input").value = s[1];
    if (s[2] !== null) getHTML("d-input").value = s[2];
  }
  showArrays();
}

// Read the inputs and draw A, B and C. Returns the parameters, or null if bad input.
function showArrays() {
  var radix = algoChoice() === "radix";
  var nums, k, d;
  statusPrefix = "";
  if (radix) {
    d = parseInt(getHTML("d-input").value);
    if (!(d >= 1 && d <= 3)) {
      noticeErr("d must be 1, 2 or 3.");
      return null;
    }
    nums = parseIntList(getHTML("number-input").value, 0, Math.pow(10, d) - 1, MAX_N);
    k = 9;
  } else {
    k = parseInt(getHTML("k-input").value);
    if (!(k >= 1 && k <= 11)) {
      noticeErr("k must be between 1 and 11, so that C[0..k] fits on the screen.");
      return null;
    }
    nums = parseIntList(getHTML("number-input").value, 0, k, MAX_N);
  }
  if (nums === null) return null;
  A = makeList("A", nums, 1);
  B = makeList("B", nums.map(() => " "), 1);
  C = makeList("C", new Array(k + 1).fill(" "), 0);
  getHTML("result").textContent = "";
  setStatus("");
  return {nums: nums, k: k, d: d, radix: radix};
}

async function run() {
  var params = showArrays();
  if (params === null) return;
  var runButton = getHTML("run-button");
  runButton.disabled = true;
  animeRunning = true;
  try {
    if (params.radix) {
      await radixSort(params.d);
      getHTML("result").textContent = "Sorted: " + keysOf(A).join(", ");
    } else {
      await countingSort(params.k, (x) => x, "");
      getHTML("result").textContent = "Sorted: " + keysOf(B).join(", ");
    }
    setStatus("Done.");
  } catch (e) {
    if (!(e instanceof Stopped)) throw e;
    setStatus("Stopped.");
  } finally {
    animeRunning = false;
    runButton.disabled = false;
  }
}

function keysOf(list) {
  var keys = [];
  for (var elem of list) keys.push(elem.getKey());
  return keys;
}

function clearColors() {
  for (var list of [A, B, C]) {
    list.unhighlightAll();
    list.setMarkers({});
  }
}

// ---------- Counting sort (CLRS 8.2) ----------
// keyOf picks the key to sort on: the whole number, or one digit of it for radix sort;
// what names that digit ("" when sorting whole numbers).

async function countingSort(k, keyOf, what) {
  var n = A.size();
  for (var j = 0; j < n; j++) B.setKey(j, " ");
  for (var i = 0; i <= k; i++) {                      // for i = 0 to k
    C.setKey(i, 0);                                   //   C[i] = 0
  }
  clearColors();
  await step("Let C[0.." + k + "] be a new array of zeros.");

  for (var j = 0; j < n; j++) {                       // for j = 1 to A.length
    var key = keyOf(A.elemAt(j).getKey());
    clearColors();
    A.highlightSwap(j);
    C.highlight(key);
    C.setKey(key, C.elemAt(key).getKey() + 1);        //   C[A[j]] = C[A[j]] + 1
    A.setMarkers({j: j});
    C.setMarkers({[what ? "digit" : "A[j]"]: key});
    await step("Count: A[" + (j + 1) + "]" + (what ? "'s " + what + " digit" : "") + " is " +
               key + ", so C[" + key + "] becomes " + C.elemAt(key).getKey() + ".");
  }
  clearColors();
  await step("Now C[i] holds the number of elements equal to i.");

  for (var i = 1; i <= k; i++) {                      // for i = 1 to k
    clearColors();
    C.highlight(i - 1);
    C.highlightSwap(i);
    C.setKey(i, C.elemAt(i).getKey() + C.elemAt(i - 1).getKey());   //   C[i] = C[i] + C[i-1]
    C.setMarkers({i: i});
    await step("Running sum: C[" + i + "] = C[" + i + "] + C[" + (i - 1) + "] = " +
               C.elemAt(i).getKey() + ".");
  }
  clearColors();
  await step("Now C[i] holds the number of elements less than or equal to i.");

  for (var j = n - 1; j >= 0; j--) {                  // for j = A.length downto 1
    var value = A.elemAt(j).getKey();
    var key = keyOf(value);
    var pos = C.elemAt(key).getKey() - 1;             // (B is 1-based in CLRS)
    clearColors();
    A.highlightSwap(j);
    C.highlight(key);
    B.setKey(pos, value);                             //   B[C[A[j]]] = A[j]
    B.colorElem(pos, WRITTEN_COLOR);
    A.setMarkers({j: j});
    C.setMarkers({[what ? "digit" : "A[j]"]: key});
    B.setMarkers({"C[A[j]]": pos});
    await step("Place A[" + (j + 1) + "] = " + value + " at B[" + (pos + 1) + "]" +
               ", then decrement C[" + key + "].");
    C.setKey(key, C.elemAt(key).getKey() - 1);        //   C[A[j]] = C[A[j]] - 1
    await step();
  }
  clearColors();
}

// ---------- Radix sort (CLRS 8.3) ----------

const DIGIT_NAMES = ["ones", "tens", "hundreds"];

async function radixSort(d) {
  for (var i = 1; i <= d; i++) {                      // for i = 1 to d
    var place = Math.pow(10, i - 1);
    statusPrefix = "Pass " + i + " (" + DIGIT_NAMES[i - 1] + " digit): ";
    await countingSort(9, (x) => Math.floor(x / place) % 10,   //   use a stable sort to sort
                       DIGIT_NAMES[i - 1]);                    //   array A on digit i
    for (var j = 0; j < A.size(); j++) {
      A.setKey(j, B.elemAt(j).getKey());
      A.colorElem(j, WRITTEN_COLOR);
    }
    await step("Copy B back into A. After pass " + i + ", A is sorted on its last " +
               i + " digit" + (i > 1 ? "s" : "") + ".");
    A.unhighlightAll();
  }
  statusPrefix = "";
}
