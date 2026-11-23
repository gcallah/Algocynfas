// Search-tree algorithms shared by binarySTree.html, avl.html and redBlackTree.html,
// following CLRS chapters 12 and 13. NIL is null. "tree" is any object with a
// root field (the BST, AVL and RBT classes in graph.js).
// The drawing is done in graph.js, which lays the tree out again from its shape
// after every change.

// ---- Binary search trees (CLRS chapter 12) ----

function treeInsert(root, newNode) {
  // CLRS p294: root == T.root, r == x, curr == y, newNode == z
  var r = root;
  var curr = null; // y = NIL
  var highLightN = [];
  while (r != null) {
    // while x != NIL
    curr = r; // y = x
    highLightN.push(curr.id);
    if (newNode.key < r.key) {
      // if z.key < x.key
      r = r.left; // x = x.left
    } else {
      r = r.right; // else x = x.right
    }
  }
  newNode.parent = curr; // z.p = y
  if (curr == null) {
    // if y == NIL
    root = newNode; // T.root = z
  } else if (newNode.key < curr.key) {
    // else if z.key < y.key
    curr.left = newNode; // y.left = z
  } else {
    curr.right = newNode; // else y.right = z
  }
  return { root: root, node: newNode, hlNodeId: highLightN };
}

function treeSearch(root, target, highLightN = []) {
  // CLRS p291: x == root, k == target
  if (root) {
    highLightN.push(root.id);
  }
  if (!root || target == root.key) {
    // if x == NIL or k == x.key
    return { node: root, path: highLightN }; // return x
  }
  if (target < root.key) {
    // if k < x.key
    return treeSearch(root.left, target, highLightN); // return Tree-Search(x.left, k)
  }
  return treeSearch(root.right, target, highLightN); // return Tree-Search(x.right, k)
}

function treeMin(root) {
  // CLRS p291: x == root
  var highLightN = [];
  while (root.left) {
    // while x.left != NIL
    highLightN.push(root.id);
    root = root.left; // x = x.left
  }
  highLightN.push(root.id);
  return { min: root, HLNodeId: highLightN }; // return x
}

function treeMax(root) {
  // CLRS p291: x == root
  var highLightN = [];
  while (root.right) {
    // while x.right != NIL
    highLightN.push(root.id);
    root = root.right; // x = x.right
  }
  highLightN.push(root.id);
  return { max: root, HLNodeId: highLightN }; // return x
}

// Returns {suc, HLNodeId}; suc is null when node holds the largest key.
function treeSuccessor(node) {
  // CLRS p292: x == node, y == suc
  if (node.right) {
    // if x.right != NIL
    var result = treeMin(node.right); // return Tree-Minimum(x.right)
    result.HLNodeId.unshift(node.id); // start the highlighted path at x
    return { HLNodeId: result.HLNodeId, suc: result.min.key };
  }
  var highLightN = [node.id];
  var suc = node.parent; // y = x.p
  while (suc && node == suc.right) {
    // while y != NIL and x == y.right
    node = suc; // x = y
    highLightN.push(node.id);
    suc = suc.parent; // y = y.p
  }
  if (suc) highLightN.push(suc.id);
  return { HLNodeId: highLightN, suc: suc ? suc.key : null }; // return y
}

// Returns {pre, HLNodeId}; pre is null when node holds the smallest key.
function treePredecessor(node) {
  // The mirror image of treeSuccessor.
  if (node.left) {
    var result = treeMax(node.left);
    result.HLNodeId.unshift(node.id);
    return { HLNodeId: result.HLNodeId, pre: result.max.key };
  }
  var highLightN = [node.id];
  var pre = node.parent;
  while (pre && node == pre.left) {
    node = pre;
    highLightN.push(node.id);
    pre = pre.parent;
  }
  if (pre) highLightN.push(pre.id);
  return { HLNodeId: highLightN, pre: pre ? pre.key : null };
}

function transplant(tree, u, v) {
  // CLRS p296: replace the subtree rooted at u with the one rooted at v
  if (!u.parent) {
    // if u.p == NIL
    tree.root = v; // T.root = v
  } else if (u == u.parent.left) {
    // else if u == u.p.left
    u.parent.left = v; // u.p.left = v
  } else {
    u.parent.right = v; // else u.p.right = v
  }
  if (v) {
    // if v != NIL
    v.parent = u.parent; // v.p = u.p
  }
}

// CLRS p298 (z == node, y == replaceNode). Returns the successor's path (for
// highlighting) and "changed", the lowest node whose subtree lost a level,
// which is where AVL rebalancing starts.
function treeDelete(tree, node) {
  var highLightN = [];
  var changed;
  if (!node.left) {
    // if z.left == NIL
    changed = node.parent;
    transplant(tree, node, node.right); // Transplant(T, z, z.right)
  } else if (!node.right) {
    // else if z.right == NIL
    changed = node.parent;
    transplant(tree, node, node.left); // Transplant(T, z, z.left)
  } else {
    var minNode = treeMin(node.right); // else y = Tree-Minimum(z.right)
    var replaceNode = minNode.min;
    highLightN = minNode.HLNodeId;
    changed = replaceNode;
    if (replaceNode.parent != node) {
      // if y.p != z
      changed = replaceNode.parent;
      transplant(tree, replaceNode, replaceNode.right); // Transplant(T, y, y.right)
      replaceNode.right = node.right; // y.right = z.right
      replaceNode.right.parent = replaceNode; // y.right.p = y
    }
    transplant(tree, node, replaceNode); // Transplant(T, z, y)
    replaceNode.left = node.left; // y.left = z.left
    replaceNode.left.parent = replaceNode; // y.left.p = y
  }
  node.parent = node.left = node.right = null;
  return { path: highLightN, changed: changed };
}

// The walks return the node ids in visiting order, and the edge ids to light up.
function inorderTreeWalk(root) {
  // derived from CLRS p288
  if (root) {
    var node = [root.id];
    var edge = [];
    var left = inorderTreeWalk(root.left);
    var right = inorderTreeWalk(root.right);
    node = left.node.concat(node).concat(right.node); // walk(x.left); print x; walk(x.right)
    if (root.leftEdge) {
      edge = edge.concat(left.edge);
      edge.push(root.leftEdge.id);
    }
    if (root.rightEdge) {
      edge.push(root.rightEdge.id);
      edge = edge.concat(right.edge);
    }
    return { node: node, edge: edge };
  }
  return { node: [], edge: [] };
}

function preorderTreeWalk(root) {
  if (root) {
    var node = [root.id];
    var edge = [];
    var left = preorderTreeWalk(root.left);
    var right = preorderTreeWalk(root.right);
    node = node.concat(left.node).concat(right.node);
    if (root.leftEdge) {
      edge.push(root.leftEdge.id);
      edge = edge.concat(left.edge);
    }
    if (root.rightEdge) {
      edge.push(root.rightEdge.id);
      edge = edge.concat(right.edge);
    }
    return { node: node, edge: edge };
  }
  return { node: [], edge: [] };
}

function postorderTreeWalk(root) {
  if (root) {
    var node = [root.id];
    var edge = [];
    var left = postorderTreeWalk(root.left);
    var right = postorderTreeWalk(root.right);
    node = left.node.concat(right.node).concat(node);
    if (root.leftEdge) {
      edge = edge.concat(left.edge);
      edge.push(root.leftEdge.id);
    }
    if (root.rightEdge) {
      edge = edge.concat(right.edge);
      edge.push(root.rightEdge.id);
    }
    return { node: node, edge: edge };
  }
  return { node: [], edge: [] };
}

// ---- Rotations (CLRS p313), used by both AVL and red-black trees ----

function leftRotate(tree, x) {
  var y = x.right; // y = x.right
  x.right = y.left; // x.right = y.left
  if (y.left) {
    // if y.left != T.nil
    y.left.parent = x; // y.left.p = x
  }
  y.parent = x.parent; // y.p = x.p
  if (!x.parent) {
    // if x.p == T.nil
    tree.root = y; // T.root = y
  } else if (x == x.parent.left) {
    // else if x == x.p.left
    x.parent.left = y; // x.p.left = y
  } else {
    x.parent.right = y; // else x.p.right = y
  }
  y.left = x; // y.left = x
  x.parent = y; // x.p = y
}

function rightRotate(tree, x) {
  // The mirror image of leftRotate.
  var y = x.left;
  x.left = y.right;
  if (y.right) {
    y.right.parent = x;
  }
  y.parent = x.parent;
  if (!x.parent) {
    tree.root = y;
  } else if (x == x.parent.right) {
    x.parent.right = y;
  } else {
    x.parent.left = y;
  }
  y.right = x;
  x.parent = y;
}

// ---- AVL trees (CLRS problem 13-3) ----
// Each node keeps its height; an empty subtree has height 0.

function avlHeight(node) {
  return node ? node.height : 0;
}

function avlUpdateHeight(node) {
  node.height = 1 + Math.max(avlHeight(node.left), avlHeight(node.right));
}

function avlBalance(node) {
  return avlHeight(node.left) - avlHeight(node.right);
}

// Walk from node up to the root, fixing heights and rotating wherever the two
// subtrees' heights differ by 2. Returns a description of each rotation.
function avlRebalance(tree, node) {
  var rotations = [];
  while (node) {
    avlUpdateHeight(node);
    var balance = avlBalance(node);
    if (balance > 1) {
      // left-heavy
      if (avlBalance(node.left) < 0) {
        // left-right case: rotate the left child first
        var child = node.left;
        rotations.push("left rotation at " + child.key);
        leftRotate(tree, child);
        avlUpdateHeight(child);
        avlUpdateHeight(child.parent);
      }
      rotations.push("right rotation at " + node.key);
      rightRotate(tree, node);
      avlUpdateHeight(node);
      node = node.parent; // the subtree's new root
      avlUpdateHeight(node);
    } else if (balance < -1) {
      // right-heavy: the mirror image
      if (avlBalance(node.right) > 0) {
        var child = node.right;
        rotations.push("right rotation at " + child.key);
        rightRotate(tree, child);
        avlUpdateHeight(child);
        avlUpdateHeight(child.parent);
      }
      rotations.push("left rotation at " + node.key);
      leftRotate(tree, node);
      avlUpdateHeight(node);
      node = node.parent;
      avlUpdateHeight(node);
    }
    node = node.parent;
  }
  return rotations;
}

// ---- Red-black trees (CLRS chapter 13) ----
// NIL leaves are null and count as black.

function rbColor(node) {
  return node ? node.color : BLACK;
}

function rbInsertFixup(tree, z) {
  // CLRS p316
  while (z.parent && z.parent.color == RED) {
    // while z.p.color == RED
    if (z.parent == z.parent.parent.left) {
      // if z.p == z.p.p.left
      var aunt = z.parent.parent.right; // y = z.p.p.right
      if (rbColor(aunt) == RED) {
        // case 1: the aunt is red
        z.parent.color = BLACK;
        aunt.color = BLACK;
        z.parent.parent.color = RED;
        z = z.parent.parent;
      } else {
        if (z == z.parent.right) {
          // case 2: z is a right child
          z = z.parent;
          leftRotate(tree, z);
        }
        // case 3: z is a left child
        z.parent.color = BLACK;
        z.parent.parent.color = RED;
        rightRotate(tree, z.parent.parent);
      }
    } else {
      // the same with "right" and "left" exchanged
      var aunt = z.parent.parent.left;
      if (rbColor(aunt) == RED) {
        z.parent.color = BLACK;
        aunt.color = BLACK;
        z.parent.parent.color = RED;
        z = z.parent.parent;
      } else {
        if (z == z.parent.left) {
          z = z.parent;
          rightRotate(tree, z);
        }
        z.parent.color = BLACK;
        z.parent.parent.color = RED;
        leftRotate(tree, z.parent.parent);
      }
    }
  }
  tree.root.color = BLACK; // T.root.color = BLACK
}

// CLRS p324. With null for NIL, x can be null, so its parent is tracked
// separately in xParent.
function rbDelete(tree, z) {
  var y = z; // y = z
  var yOriginalColor = y.color;
  var x, xParent, path = [];
  if (!z.left) {
    // if z.left == T.nil
    x = z.right;
    xParent = z.parent;
    transplant(tree, z, z.right); // RB-Transplant(T, z, z.right)
  } else if (!z.right) {
    // else if z.right == T.nil
    x = z.left;
    xParent = z.parent;
    transplant(tree, z, z.left); // RB-Transplant(T, z, z.left)
  } else {
    var minNode = treeMin(z.right); // y = Tree-Minimum(z.right)
    y = minNode.min;
    path = minNode.HLNodeId;
    yOriginalColor = y.color;
    x = y.right; // x = y.right
    if (y.parent == z) {
      xParent = y; // x.p = y
    } else {
      xParent = y.parent;
      transplant(tree, y, y.right); // RB-Transplant(T, y, y.right)
      y.right = z.right; // y.right = z.right
      y.right.parent = y; // y.right.p = y
    }
    transplant(tree, z, y); // RB-Transplant(T, z, y)
    y.left = z.left; // y.left = z.left
    y.left.parent = y; // y.left.p = y
    y.color = z.color; // y.color = z.color
  }
  z.parent = z.left = z.right = null;
  if (yOriginalColor == BLACK) {
    // removing or moving a black node breaks the black heights
    rbDeleteFixup(tree, x, xParent);
  }
  return { path: path };
}

function rbDeleteFixup(tree, x, xParent) {
  // CLRS p326; w is x's sibling
  while (x != tree.root && rbColor(x) == BLACK) {
    if (x == xParent.left) {
      var w = xParent.right;
      if (rbColor(w) == RED) {
        // case 1: the sibling is red
        w.color = BLACK;
        xParent.color = RED;
        leftRotate(tree, xParent);
        w = xParent.right;
      }
      if (rbColor(w.left) == BLACK && rbColor(w.right) == BLACK) {
        // case 2: both of the sibling's children are black
        w.color = RED;
        x = xParent;
        xParent = x.parent;
      } else {
        if (rbColor(w.right) == BLACK) {
          // case 3: the sibling's right child is black
          w.left.color = BLACK;
          w.color = RED;
          rightRotate(tree, w);
          w = xParent.right;
        }
        // case 4: the sibling's right child is red
        w.color = xParent.color;
        xParent.color = BLACK;
        w.right.color = BLACK;
        leftRotate(tree, xParent);
        x = tree.root;
      }
    } else {
      // the same with "right" and "left" exchanged
      var w = xParent.left;
      if (rbColor(w) == RED) {
        w.color = BLACK;
        xParent.color = RED;
        rightRotate(tree, xParent);
        w = xParent.left;
      }
      if (rbColor(w.right) == BLACK && rbColor(w.left) == BLACK) {
        w.color = RED;
        x = xParent;
        xParent = x.parent;
      } else {
        if (rbColor(w.left) == BLACK) {
          w.right.color = BLACK;
          w.color = RED;
          leftRotate(tree, w);
          w = xParent.left;
        }
        w.color = xParent.color;
        xParent.color = BLACK;
        w.left.color = BLACK;
        rightRotate(tree, xParent);
        x = tree.root;
      }
    }
  }
  if (x) {
    x.color = BLACK; // x.color = BLACK
  }
}

// ---- Page actions shared by the three tree pages ----
// Each page defines disableButtons(); the global Graph holds the tree.

// Run one tree operation: redraw the tree (clearing old highlights), keep the
// buttons disabled while it animates, and re-enable them even if it fails.
async function treeOperation(op) {
  animeRunning = true;
  if (!Graph || !Graph.root) {
    noticeErr("The tree is empty!");
    return;
  }
  disableButtons(true);
  try {
    Graph.draw();
    await op(Graph);
  } finally {
    disableButtons(false);
  }
}

function searchInTree() {
  return treeOperation((t) => t.search());
}

function findMinMax() {
  return treeOperation((t) => t.minMax());
}

function findPreSuc() {
  return treeOperation((t) => t.preSuc());
}

function PreInPost() {
  return treeOperation((t) => t.traversal());
}

function deleteNode() {
  return treeOperation((t) => t.delete());
}

// Shuffle the keys in the list box (and show the new order there).
function shuffledTreeList() {
  var input = splitInput(getHTML("treeList").value, true);
  for (var i = input.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = input[i];
    input[i] = input[j];
    input[j] = temp;
  }
  getHTML("treeList").value = input.join(",");
  return input;
}

// Create button (type 1): build a new tree from the list box.
// Insert button (type 2): insert one key, showing the path it takes.
async function buildTree(TreeClass, type) {
  animeRunning = true;
  if (type == 1) {
    var tree = new TreeClass();
    var input = getHTML("random").checked
      ? shuffledTreeList()
      : splitInput(getHTML("treeList").value, true);
    for (var i = 0; i < input.length; i++) {
      if (!tree.insertChecked(parseInt(input[i]), "treeList")) {
        return;
      }
    }
    Graph = tree;
    tree.draw();
  } else {
    if (!Graph) {
      Graph = new TreeClass();
    }
    disableButtons(true);
    try {
      await Graph.insert(parseInt(getHTML("treeNode").value));
    } finally {
      disableButtons(false);
    }
  }
}

function clearTree(container) {
  $("." + container).empty();
  Graph = null;
  getHTML("treeSample").selectedIndex = 0;
}
