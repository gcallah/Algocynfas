/**
 * array_algos.js: array algorithms animated with the List class in algocynfas.js.
 *   - Maximum subarray, divide and conquer   (CLRS 4.1)
 *   - Maximum subarray in linear time        (CLRS Exercise 4.1-5)
 *   - Hoare partition                        (CLRS Problem 7-1)
 *   - Minimum and maximum together           (CLRS 9.1)
 * Array indices are shown 1-based, as in CLRS.
 */

const RANGE_COLOR = DEF_HL_COLOR;     // the part of A being worked on
const CURRENT_COLOR = SWAP_COLOR;     // being looked at right now
const BEST_COLOR = '#8fd19e';         // best subarray so far / the answer
const CROSS_COLOR = '#c4d4ee';        // the crossing subarray being grown
const LOW_SIDE_COLOR = BEST_COLOR;      // partition: <= pivot
const HIGH_SIDE_COLOR = CROSS_COLOR;   // partition: >= pivot
const PIVOT_COLOR = '#eab8c6';        // partition: the pivot x
const MIN_COLOR = BEST_COLOR;
const MAX_COLOR = PIVOT_COLOR;
const MAX_N = 16;

let canvas = null;
let A = null;
let animeRunning = false;

class Stopped extends Error {}

async function step(markers = null, status = null) {
  if (!animeRunning) throw new Stopped();
  if (markers !== null) A.setMarkers(markers);
  if (status !== null) setStatus(status);
  await A.draw();
  if (!animeRunning) throw new Stopped();
}

const key = (i) => A.elemAt(i).getKey();

function colorRange(lo, hi, color) {
  for (var k = lo; k <= hi; k++) A.colorElem(k, color);
}

function algoChoice() {
  return document.querySelector('input[name="algo"]:checked').id;
}

function algoChanged() {
  var notes = {
    maxsubDC: "Find the contiguous subarray with the largest sum by splitting A in half: " +
              "the best subarray is in the left half, the right half, or crosses the middle.",
    maxsubLinear: "Scan once, keeping the best subarray ending at the current position " +
                  "and the best seen so far.",
    hoare: "Hoare's original partition: x = A[p], and i and j move toward each other, " +
           "swapping elements that are on the wrong side.",
    minmax: "Find both the smallest and largest element with about 3n/2 comparisons, by " +
            "comparing elements in pairs.",
  };
  getHTML("algo-note").textContent = notes[algoChoice()];
}

function setSample() {
  var samples = {
    stock: "13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7",  // CLRS Fig. 4.3
    negative: "-8, -3, -6, -2, -5, -4",
    hoare: "13, 19, 9, 5, 12, 8, 7, 4, 11, 2, 6, 21",                            // CLRS Problem 7-1
    sorted: "1, 2, 3, 4, 5, 6, 7, 8",
    minmax: "31, 41, 59, 26, 53, 58, 97, 93, 23",
  };
  var choice = getHTML("sample").value;
  if (!samples[choice]) return;
  getHTML("number-input").value = samples[choice];
  var algo = {stock: "maxsubDC", negative: "maxsubLinear", hoare: "hoare", minmax: "minmax"}[choice];
  if (algo) {
    getHTML(algo).checked = true;
    algoChanged();
  }
  showList();
}

function showList() {
  var nums = parseIntList(getHTML("number-input").value, -99, 99, MAX_N);
  if (nums === null) return false;
  canvas.clear();
  A = createList(canvas, nums);
  A.drawIndices(1);
  A.drawName("A");
  getHTML("result").textContent = "";
  setStatus("");
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
    var result;
    if (algo === "maxsubDC") {
      var [lo, hi, sum] = await findMaximumSubarray(0, A.size() - 1, 0);
      result = showBest(lo, hi, sum);
    } else if (algo === "maxsubLinear") {
      var [lo, hi, sum] = await maxSubarrayLinear();
      result = showBest(lo, hi, sum);
    } else if (algo === "hoare") {
      var j = await hoarePartition(0, A.size() - 1);
      result = "HOARE-PARTITION returns j = " + (j + 1) + ": every element of A[1.." + (j + 1) +
               "] is <= every element of A[" + (j + 2) + ".." + A.size() + "].";
    } else {
      result = await minAndMax();
    }
    await step(null, "Done.");
    getHTML("result").textContent = result;
  } catch (e) {
    if (!(e instanceof Stopped)) throw e;
    setStatus("Stopped.");
  } finally {
    animeRunning = false;
    runButton.disabled = false;
  }
}

function showBest(lo, hi, sum) {
  A.unhighlightAll();
  colorRange(lo, hi, BEST_COLOR);
  A.setMarkers({low: lo, high: hi});
  var values = [];
  for (var k = lo; k <= hi; k++) values.push(key(k));
  return "Maximum subarray: A[" + (lo + 1) + ".." + (hi + 1) + "] = " + values.join(", ") +
         ", with sum " + sum + ".";
}

// ---------- Maximum subarray, divide and conquer (CLRS 4.1) ----------

async function findMaxCrossingSubarray(low, mid, high) {
  A.unhighlightAll();
  colorRange(low, high, RANGE_COLOR);
  var leftSum = -Infinity, sum = 0, maxLeft = mid;    // left-sum = -∞; sum = 0
  for (var i = mid; i >= low; i--) {                  // for i = mid downto low
    sum = sum + key(i);                               //   sum = sum + A[i]
    A.colorElem(i, CURRENT_COLOR);
    await step({low: low, i: i, mid: mid, high: high},
               "Crossing, left side: A[" + (i + 1) + ".." + (mid + 1) + "] sums to " + sum +
               (sum > leftSum ? ", the best so far." : "."));
    if (sum > leftSum) {                              //   if sum > left-sum
      leftSum = sum;                                  //     left-sum = sum
      maxLeft = i;                                    //     max-left = i
    }
    colorRange(low, mid, RANGE_COLOR);
    colorRange(maxLeft, mid, CROSS_COLOR);
  }
  var rightSum = -Infinity, maxRight = mid + 1;       // right-sum = -∞
  sum = 0;                                            // sum = 0
  for (var j = mid + 1; j <= high; j++) {             // for j = mid + 1 to high
    sum = sum + key(j);                               //   sum = sum + A[j]
    A.colorElem(j, CURRENT_COLOR);
    await step({low: low, mid: mid, j: j, high: high},
               "Crossing, right side: A[" + (mid + 2) + ".." + (j + 1) + "] sums to " + sum +
               (sum > rightSum ? ", the best so far." : "."));
    if (sum > rightSum) {                             //   if sum > right-sum
      rightSum = sum;                                 //     right-sum = sum
      maxRight = j;                                   //     max-right = j
    }
    colorRange(mid + 1, high, RANGE_COLOR);
    colorRange(mid + 1, maxRight, CROSS_COLOR);
  }
  colorRange(maxLeft, maxRight, CROSS_COLOR);
  await step({low: low, mid: mid, high: high},
             "Best crossing subarray: A[" + (maxLeft + 1) + ".." + (maxRight + 1) + "], sum " +
             (leftSum + rightSum) + ".");
  return [maxLeft, maxRight, leftSum + rightSum];     // return (max-left, max-right, left-sum + right-sum)
}

async function findMaximumSubarray(low, high, depth) {
  var range = "A[" + (low + 1) + ".." + (high + 1) + "]";
  if (high === low) {                                 // if high == low
    A.unhighlightAll();
    A.colorElem(low, BEST_COLOR);
    await step({low: low}, "Base case: " + range.replace(/\.\..*\]/, "]") +
               " = " + key(low) + " on its own.");
    return [low, high, key(low)];                     //   return (low, high, A[low])
  }
  var mid = Math.floor((low + high) / 2);             // mid = floor((low + high) / 2)
  A.unhighlightAll();
  colorRange(low, high, RANGE_COLOR);
  await step({low: low, mid: mid, high: high}, "Split " + range + " at mid = " + (mid + 1) + ".");
  var left = await findMaximumSubarray(low, mid, depth + 1);        // FIND-MAXIMUM-SUBARRAY(A, low, mid)
  var right = await findMaximumSubarray(mid + 1, high, depth + 1);  // FIND-MAXIMUM-SUBARRAY(A, mid+1, high)
  var cross = await findMaxCrossingSubarray(low, mid, high);        // FIND-MAX-CROSSING-SUBARRAY(...)
  var best, where;
  if (left[2] >= right[2] && left[2] >= cross[2]) {   // if left-sum >= right-sum and left-sum >= cross-sum
    best = left; where = "left half";
  } else if (right[2] >= left[2] && right[2] >= cross[2]) {   // elseif right-sum >= ...
    best = right; where = "right half";
  } else {
    best = cross; where = "crossing subarray";
  }
  A.unhighlightAll();
  colorRange(low, high, RANGE_COLOR);
  colorRange(best[0], best[1], BEST_COLOR);
  await step({low: low, high: high},
             "Best in " + range + ": the " + where + " A[" + (best[0] + 1) + ".." + (best[1] + 1) +
             "], sum " + best[2] + " (left " + left[2] + ", right " + right[2] + ", crossing " +
             cross[2] + ").");
  return best;
}

// ---------- Maximum subarray in linear time (CLRS Exercise 4.1-5) ----------

async function maxSubarrayLinear() {
  var best = -Infinity, bestLow = 0, bestHigh = 0;
  var endingHere = 0, start = 0;   // the best subarray ending at j is A[start..j]
  for (var j = 0; j < A.size(); j++) {
    if (endingHere > 0) {
      endingHere = endingHere + key(j);       // extend the best subarray ending at j-1
    } else {
      endingHere = key(j);                    // or start afresh at j
      start = j;
    }
    var improved = endingHere > best;
    if (improved) {
      best = endingHere;
      bestLow = start;
      bestHigh = j;
    }
    A.unhighlightAll();
    colorRange(bestLow, bestHigh, BEST_COLOR);
    colorRange(start, j, improved ? BEST_COLOR : RANGE_COLOR);
    A.colorElem(j, CURRENT_COLOR);
    await step({start: start, j: j},
               "Best ending at A[" + (j + 1) + "]: A[" + (start + 1) + ".." + (j + 1) + "], sum " +
               endingHere + ". Best so far: A[" + (bestLow + 1) + ".." + (bestHigh + 1) +
               "], sum " + best + ".");
  }
  return [bestLow, bestHigh, best];
}

// ---------- Hoare partition (CLRS Problem 7-1) ----------

async function hoarePartition(p, r) {
  var x = key(p);                                     // x = A[p]
  var i = p - 1;                                      // i = p - 1
  var j = r + 1;                                      // j = r + 1
  var show = () => {
    A.unhighlightAll();
    colorRange(p, i, LOW_SIDE_COLOR);
    colorRange(j, r, HIGH_SIDE_COLOR);
  };
  A.colorElem(p, PIVOT_COLOR);
  await step({p: p, r: r}, "The pivot is x = A[" + (p + 1) + "] = " + x + ".");
  while (true) {                                      // while TRUE
    do {                                              //   repeat
      j = j - 1;                                      //     j = j - 1
      show();
      A.colorElem(j, CURRENT_COLOR);
      await step({i: i, j: j}, "Move j left: is A[" + (j + 1) + "] = " + key(j) + " <= " + x + "?");
    } while (!(key(j) <= x));                         //   until A[j] <= x
    do {                                              //   repeat
      i = i + 1;                                      //     i = i + 1
      show();
      A.colorElem(j, CURRENT_COLOR);
      A.colorElem(i, CURRENT_COLOR);
      await step({i: i, j: j}, "Move i right: is A[" + (i + 1) + "] = " + key(i) + " >= " + x + "?");
    } while (!(key(i) >= x));                         //   until A[i] >= x
    if (i < j) {                                      //   if i < j
      A.swap(i, j);                                   //     exchange A[i] with A[j]
      show();
      A.colorElem(i, LOW_SIDE_COLOR);
      A.colorElem(j, HIGH_SIDE_COLOR);
      await step({i: i, j: j}, "i < j, so exchange A[" + (i + 1) + "] and A[" + (j + 1) + "].");
    } else {
      show();
      colorRange(p, j, LOW_SIDE_COLOR);
      colorRange(j + 1, r, HIGH_SIDE_COLOR);
      await step({i: i, j: j}, "i >= j: return j = " + (j + 1) + ".");
      return j;                                       //   else return j
    }
  }
}

// ---------- Minimum and maximum (CLRS 9.1) ----------

async function minAndMax() {
  var n = A.size();
  var comparisons = 0;
  var lo, hi, start;
  var show = (status, markers) => {
    A.unhighlightAll();
    A.colorElem(lo, MIN_COLOR);
    A.colorElem(hi, MAX_COLOR);
    return step(Object.assign({min: lo, max: hi}, markers),
                status + " (" + comparisons + " comparison" + (comparisons === 1 ? "" : "s") + ")");
  };
  if (n % 2 === 1) {
    lo = hi = 0;                       // n odd: min and max both start as the first element
    start = 1;
    await show("n is odd, so min and max both start as A[1].", {});
  } else {
    comparisons++;                     // n even: compare the first two elements
    if (key(0) < key(1)) { lo = 0; hi = 1; } else { lo = 1; hi = 0; }
    start = 2;
    await show("n is even, so compare A[1] and A[2]: min and max start as those two.", {});
  }
  for (var i = start; i + 1 < n; i += 2) {
    // Compare the pair with each other, then the smaller with min and the larger with max.
    A.unhighlightAll();
    A.colorElem(lo, MIN_COLOR);
    A.colorElem(hi, MAX_COLOR);
    A.colorElem(i, CURRENT_COLOR);
    A.colorElem(i + 1, CURRENT_COLOR);
    comparisons++;
    var small = key(i) < key(i + 1) ? i : i + 1;
    var large = small === i ? i + 1 : i;
    await step({min: lo, max: hi, i: i},
               "Compare the pair A[" + (i + 1) + "] = " + key(i) + " and A[" + (i + 2) + "] = " +
               key(i + 1) + ". (" + comparisons + " comparisons)");
    comparisons++;
    if (key(small) < key(lo)) lo = small;
    comparisons++;
    if (key(large) > key(hi)) hi = large;
    await show("Compare the smaller, " + key(small) + ", with min and the larger, " + key(large) +
               ", with max.", {});
  }
  var naive = 2 * n - 2;
  return "min = " + key(lo) + " (A[" + (lo + 1) + "]), max = " + key(hi) + " (A[" + (hi + 1) +
         "]), using " + comparisons + " comparisons. Finding them separately takes " + naive +
         "; the bound is 3⌊n/2⌋ = " + 3 * Math.floor(n / 2) + ".";
}
