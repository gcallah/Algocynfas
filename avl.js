function treeInsert(root, newNode) {
  var r = root;
  var curr = null; // y = NIL
  var LastDir = null;
  var adjustList = [];
  var highLightN = [];
  while (r != null) {
    // while x != NIL
    curr = r; // y = x
    highLightN.push(curr.id);
    if (newNode.key < r.key) {
      // if z.key < x.key
      if (LastDir == "right") {
        adjustList.push(r);
      }
      r = r.left; // x = x.left
      LastDir = "left";
    } else {
      if (LastDir == "left") {
        adjustList.push(r);
      }
      r = r.right; // else x = x.right
      LastDir = "right";
    }
  }
  newNode.parent = curr; // z.p = y
  if (curr == null) {
    // if y == NIL
    root = newNode; // T.root = z
  } else if (newNode.key < curr.key) {
    // else if z.key < y.key
    curr.left = newNode; // y.left = z;
    newNode.sideToParent = "left";
  } else {
    curr.right = newNode; // else y.right = z
    newNode.sideToParent = "right";
  }
  //return result object
  var result = {
    root: root,
    node: newNode,
    adj: adjustList,
    hlNodeId: highLightN
  };

  return result;
}

function resetEdge(edge, sourceNode, targetNode) {
  if (targetNode) {
    var source = sourceNode.id.toString();
    var target = targetNode.id.toString();
    edge.id = source + "-" + target;
    edge.source = source;
    edge.target = target;
    return edge;
  }
  return null;
}

function resetReplace(replace, toDelete) {
  var x = toDelete.position.x - replace.position.x;
  var y = toDelete.position.y - replace.position.y;
  if (replace.strenchTimes != 0 && toDelete.parent) {
    if (replace == toDelete.left) {
      x -= 30 * replace.strenchTimes;
    } else if (replace == toDelete.right) {
      x += 30 * replace.strenchTimes;
    }
  }

  replace.sideToParent = toDelete.sideToParent;
  replace.strenchTimes = toDelete.strenchTimes;
  return afterDeletePosition(replace, x, y);
}

//avlcheck
function AVLCheck() {
  if (!animeRunning) {
    var graph = new AVL();
    for (var i = 0; i < Graph.nodes.length; i++) {
      graph.insert(parseInt(Graph.nodes[i]), false, false);
    }
    Graph = graph;
  }
  animeRunning = true;
  disableButtons(true);
  if (!Graph) {
    noticeErr("The tree is empty!");
    disableButtons(false);
    return false;
  }
  $(".AVLGraphContainer").empty();

  Graph.createSigmaGraph("AVLGraphContainer");
  return true;
}

async function searchInTree() {
  if (AVLCheck()) {
    var input = parseInt(getHTML("searchBox").value);
    if (Number.isInteger(input)) {
      correctErr("searchBox");
      await Graph.search(input);
      disableButtons(false);
      return;
    }
    noticeErr("Please input a valid integer", "searchBox");
    disableButtons(false);
  }
}

async function findMinMax() {
  if (AVLCheck()) {
    await Graph.minMax();
    disableButtons(false);
  }
}

async function findPreSuc() {
  if (AVLCheck()) {
    await Graph.preSuc();
    disableButtons(false);
  }
}

async function PreInPost() {
  if (AVLCheck()) {
    await Graph.traversal();
    disableButtons(false);
  }
}

async function deleteNode() {
  if (AVLCheck()) {
    await Graph.delete();
    disableButtons(false);
  }
}

//calculate leftHeight
function leftHeight(newNode) {
  if (!newNode.left) {
    return -1;
  }
  return newNode.left.height;
}

function getBalanceState(node) {
  var heightDifference = leftHeight(node) - rightHeight(node);
  //switch case for handling different cases
  switch (heightDifference) {
    case -2:
      return BalanceState.UNBALANCED_RIGHT;
    case -1:
      return BalanceState.SLIGHTLY_UNBALANCED_RIGHT;
    case 1:
      return BalanceState.SLIGHTLY_UNBALANCED_LEFT;
    case 2:
      return BalanceState.UNBALANCED_LEFT;
    default:
      return BalanceState.BALANCED;
  }
}
var BalanceState = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5
};

//calculate rightHeight
function rightHeight(newNode) {
  if (!newNode.right) {
    return -1;
  }
  return newNode.right.height;
}

/**
 * Performs a right rotate on this node.
 *
 *       b                           a
 *      / \                         / \
 *     a   e -> b.rotateRight() -> c   b
 *    / \                             / \
 *   c   d                           d   e
 *
 * @return {Node} The root of the sub-tree; the node where this node used to be.
 */

//function for rotateRight
function rotateRight(newNode) {
  var other = newNode.left;
  newNode.left = other.right;
  other.right = newNode;
  newNode.height = Math.max(leftHeight(newNode), rightHeight(newNode)) + 1;
  other.height = Math.max(leftHeight(other), newNode.height) + 1;
  return other;
}
/**
 * Performs a left rotate on this node.
 *
 *     a                              b
 *    / \                            / \
 *   c   b   -> a.rotateLeft() ->   a   e
 *      / \                        / \
 *     d   e                      c   d
 *
 * @return {Node} The root of the sub-tree; the node where this node used to be.
 */

//function for rotateLeft
function rotateLeft(newNode) {
  var other = newNode.right;
  newNode.right = other.left;
  other.left = newNode;
  newNode.height = Math.max(leftHeight(newNode), rightHeight(newNode)) + 1;
  other.height = Math.max(leftHeight(other), newNode.height) + 1;
  return other;
}

/**
 * Represents how balanced a node's left and right children are.
 *
 */
var BalanceState = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5
};

/**
 * Gets the balance state of a node, indicating whether the left or right
 * sub-trees are unbalanced.
 *
 */
function getBalanceState(node) {
  //height difference between left tree and right tree
  var heightDifference = node.leftHeight() - node.rightHeight();
  switch (heightDifference) {
    case -2:
      return BalanceState.UNBALANCED_RIGHT;
    case -1:
      return BalanceState.SLIGHTLY_UNBALANCED_RIGHT;
    case 1:
      return BalanceState.SLIGHTLY_UNBALANCED_LEFT;
    case 2:
      return BalanceState.UNBALANCED_LEFT;
    default:
      return BalanceState.BALANCED;
  }
}

function compare(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

function disableButtons(ifDisable) {
  getHTML("createAVL-button").disabled = ifDisable;
  getHTML("insert-button").disabled = ifDisable;

  getHTML("delete-button").disabled = ifDisable;
  getHTML("traversal-button").disabled = ifDisable;
  getHTML("clear-AVL-button").disabled = ifDisable;
}
//clear avl graph
function clearAVLGraph() {
  $(".AVLGraphContainer").empty();
  let selectedBox = getHTML("AVLSample");
  selectedBox.selectedIndex = 0;
}
