/**
 * search.js: searching and selection algorithms animated with the List class
 * in algocynfas.js.
 *   - Linear search        (CLRS Exercise 2.1-3)
 *   - Binary search        (CLRS Exercise 2.3-5)
 *   - Randomized-Select    (CLRS 9.2)
 * Array indices are shown 1-based, as in CLRS.
 */

const RANGE_COLOR = DEF_HL_COLOR;     // still under consideration
const CURRENT_COLOR = SWAP_COLOR;     // being compared right now
const FOUND_COLOR = '#8fd19e';        // the answer
const LOW_SIDE_COLOR = '#c6e6cf';     // partition: <= pivot
const HIGH_SIDE_COLOR = '#c4d4ee';    // partition: > pivot
const PIVOT_COLOR = '#eab8c6';        // partition: the pivot

let canvas = null;
let A = null;              // the List being animated
let animeRunning = false;

class Stopped extends Error {}

// Redraw and pause; abandon the run if the user pressed Stop.
async function step(markers = null, status = null) {
  if (!animeRunning) throw new Stopped();
  if (markers !== null) A.setMarkers(markers);
  if (status !== null) setStatus(status);
  await A.draw();
  if (!animeRunning) throw new Stopped();
}

function setSearchSample() {
  var samples = {
    unsorted: ["31, 41, 59, 26, 41, 58, 12, 7, 93", "58", "4"],
    sorted: ["2, 5, 8, 12, 16, 23, 38, 56, 72, 91", "23", "3"],
    missing: ["3, 9, 14, 21, 27, 35, 44, 50", "30", "8"],
    dups: ["5, 2, 9, 5, 1, 9, 7, 5, 3", "7", "5"],
  };
  var choice = getHTML("searchSample").value;
  if (!samples[choice]) return;
  [getHTML("number-input").value, getHTML("target-input").value,
   getHTML("rank-input").value] = samples[choice];
  showList();
}

function algoChoice() {
  return document.querySelector('input[name="algo"]:checked').id;
}

// Show the right parameter box for the chosen algorithm.
function algoChanged() {
  var select = algoChoice() === "select";
  getHTML("target-group").style.display = select ? "none" : "";
  getHTML("rank-group").style.display = select ? "" : "none";
  getHTML("pivot-group").style.display = select ? "" : "none";
  getHTML("sorted-note").style.display = algoChoice() === "binary" ? "" : "none";
}

// Draw the input list. Returns false if the input is bad.
function showList() {
  var nums = parseIntList(getHTML("number-input").value, -99, 99, 12);
  if (nums === null) return false;
  if (algoChoice() === "binary") {
    var sorted = nums.slice().sort((a, b) => a - b);
    if (sorted.join() !== nums.join()) {
      nums = sorted;
      getHTML("number-input").value = nums.join(", ");
      setStatus("Binary search needs a sorted array, so the input has been sorted.");
    }
  }
  canvas.clear();
  A = createList(canvas, nums);
  A.drawIndices(1);
  A.drawName("A");
  getHTML("result").textContent = "";
  return true;
}

async function run() {
  if (!showList()) return;
  var runButton = getHTML("run-button");
  runButton.disabled = true;
  animeRunning = true;
  A.setDelay(check_and_Delay());
  try {
    var algo = algoChoice();
    if (algo === "select") {
      var i = parseInt(getHTML("rank-input").value);
      if (!(i >= 1 && i <= A.size())) {
        noticeErr("i must be between 1 and " + A.size() + ".");
        return;
      }
      var randomPivot = getHTML("pivot-choice").value === "random";
      var q = await randomizedSelect(0, A.size() - 1, i, randomPivot);
      A.unhighlightAll();
      A.colorElem(q, FOUND_COLOR);
      await step({}, "Done.");
      getHTML("result").textContent =
        "The " + ordinal(i) + " smallest element is " + A.elemAt(q).getKey() +
        " (now at A[" + (q + 1) + "]).";
    } else {
      var target = parseInt(getHTML("target-input").value);
      if (!Number.isInteger(target)) {
        noticeErr("Please enter a whole number to search for.");
        return;
      }
      var found = algo === "binary" ? await binarySearch(target)
                                    : await linearSearch(target);
      getHTML("result").textContent = found === null
        ? target + " is not in A: the search returns NIL."
        : target + " found at A[" + (found + 1) + "].";
    }
  } catch (e) {
    if (!(e instanceof Stopped)) throw e;
    setStatus("Stopped.");
  } finally {
    animeRunning = false;
    runButton.disabled = false;
  }
}

function ordinal(n) {
  var s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ---------- Linear search (CLRS Exercise 2.1-3) ----------

async function linearSearch(v) {
  for (var i = 0; i < A.size(); i++) {                 // for i = 1 to A.length
    A.unhighlightAll();
    A.highlightSwap(i);
    await step({i: i}, "Is A[" + (i + 1) + "] = " + A.elemAt(i).getKey() +
                       " equal to " + v + "?");
    if (A.elemAt(i).getKey() === v) {                  //   if A[i] == v
      A.colorElem(i, FOUND_COLOR);
      await step({i: i}, "Yes: return " + (i + 1) + ".");
      return i;                                        //     return i
    }
  }
  A.unhighlightAll();
  await step({}, "Reached the end of A: return NIL.");
  return null;                                         // return NIL
}

// ---------- Binary search (CLRS Exercise 2.3-5) ----------

function showRange(lo, hi) {
  A.unhighlightAll();
  for (var k = lo; k <= hi; k++) A.colorElem(k, RANGE_COLOR);
}

async function binarySearch(v) {
  var lo = 0, hi = A.size() - 1;                       // low = 1, high = A.length
  while (lo <= hi) {                                   // while low <= high
    var mid = Math.floor((lo + hi) / 2);               //   mid = floor((low + high) / 2)
    showRange(lo, hi);
    A.highlightSwap(mid);
    await step({low: lo, mid: mid, high: hi},
               "Compare v = " + v + " with A[" + (mid + 1) + "] = " + A.elemAt(mid).getKey());
    var key = A.elemAt(mid).getKey();
    if (key === v) {                                   //   if A[mid] == v
      A.unhighlightAll();
      A.colorElem(mid, FOUND_COLOR);
      await step({mid: mid}, "Found it: return " + (mid + 1) + ".");
      return mid;                                      //     return mid
    } else if (v < key) {                              //   elseif v < A[mid]
      hi = mid - 1;                                    //     high = mid - 1
      setStatus(v + " < " + key + ", so search the left half.");
    } else {
      lo = mid + 1;                                    //   else low = mid + 1
      setStatus(v + " > " + key + ", so search the right half.");
    }
  }
  A.unhighlightAll();
  await step({}, "low > high: the range is empty, return NIL.");
  return null;                                         // return NIL
}

// ---------- Randomized-Select (CLRS 9.2) ----------

// Returns the (0-based) position of the i-th smallest element of A[p..r].
async function randomizedSelect(p, r, i, randomPivot) {
  showRange(p, r);
  await step({p: p, r: r}, "Looking for the " + ordinal(i) + " smallest of A[" +
                           (p + 1) + ".." + (r + 1) + "].");
  if (p === r) {                                       // if p == r
    return p;                                          //   return A[p]
  }
  var q = await randomizedPartition(p, r, randomPivot);   // q = RANDOMIZED-PARTITION(A, p, r)
  var k = q - p + 1;                                   // k = q - p + 1
  if (i === k) {                                       // if i == k
    setStatus("The pivot is the " + ordinal(k) + " smallest of the range: that's the answer.");
    return q;                                          //   return A[q]
  } else if (i < k) {                                  // elseif i < k
    setStatus("The pivot is the " + ordinal(k) + " smallest; look on the low side.");
    await step({q: q});
    return await randomizedSelect(p, q - 1, i, randomPivot);       // RANDOMIZED-SELECT(A, p, q-1, i)
  } else {
    setStatus("The pivot is the " + ordinal(k) + " smallest; look on the high side for the " +
              ordinal(i - k) + ".");
    await step({q: q});
    return await randomizedSelect(q + 1, r, i - k, randomPivot);   // RANDOMIZED-SELECT(A, q+1, r, i-k)
  }
}

async function randomizedPartition(p, r, randomPivot) {
  if (randomPivot) {
    var i = p + Math.floor(Math.random() * (r - p + 1));   // i = RANDOM(p, r)
    A.colorElem(i, PIVOT_COLOR);
    await step({p: p, r: r}, "Random pivot: A[" + (i + 1) + "] = " + A.elemAt(i).getKey() +
                             ". Exchange it with A[" + (r + 1) + "].");
    A.swap(r, i);                                          // exchange A[r] with A[i]
    await step({p: p, r: r});
  }
  return await partition(p, r);                            // return PARTITION(A, p, r)
}

// CLRS 7.1 PARTITION, with the regions coloured.
async function partition(p, r) {
  var x = A.elemAt(r).getKey();                        // x = A[r]
  var i = p - 1;                                       // i = p - 1
  var colourRegions = (j) => {
    for (var k = p; k < r; k++) {
      A.colorElem(k, k <= i ? LOW_SIDE_COLOR : (k < j ? HIGH_SIDE_COLOR : RANGE_COLOR));
    }
    A.colorElem(r, PIVOT_COLOR);
  };
  for (var j = p; j < r; j++) {                        // for j = p to r - 1
    colourRegions(j);
    A.highlightSwap(j);
    await step({i: i, j: j, r: r}, "Pivot x = " + x + ". Is A[" + (j + 1) + "] = " +
                                   A.elemAt(j).getKey() + " <= x?");
    if (A.elemAt(j).getKey() <= x) {                   //   if A[j] <= x
      i++;                                             //     i = i + 1
      A.swap(i, j);                                    //     exchange A[i] with A[j]
    }
  }
  colourRegions(r);
  A.swap(i + 1, r);                                    // exchange A[i+1] with A[r]
  A.colorElem(i + 1, PIVOT_COLOR);
  A.colorElem(r, r === i + 1 ? PIVOT_COLOR : HIGH_SIDE_COLOR);
  await step({q: i + 1}, "Put the pivot in its final place, A[" + (i + 2) + "].");
  return i + 1;                                        // return i + 1
}
