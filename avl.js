function treeInsertAVL(root, newNode) {
  // CLRS P294 root == T.root, r == x, curr == y, newNode == z
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

  var result = {
    root: root,
    node: newNode,
    adj: adjustList,
    hlNodeId: highLightN
  };

  return result;
}
//calculate leftHeight
function leftHeight(newNode) {
  if (!newNode.left) {
    return -1;
  }
  return newNode.left.height;
}

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

//function rotateRight
function rotateRight(root, newNode) {
  var other = newNode.left;
  newNode.left = other.right;
  other.right = newNode;
  newNode.height = Math.max(newNode.leftHeight(), newNode.rightHeight()) + 1;
  other.height = Math.max(other.leftHeight(), newNode.height) + 1;
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
function rotateLeft(root, newNode) {
  var other = newNode.right;
  newNode.right = other.left;
  other.left = newNode;
  newNode.height = Math.max(newNode.leftHeight(), newNode.rightHeight()) + 1;
  other.height = Math.max(other.leftHeight(), newNode.height) + 1;
  return other;
}

function disableButtons(ifDisable) {
  getHTML("createAVL-button").disabled = ifDisable;
  getHTML("insert-button").disabled = ifDisable;
  //getHTML("search-button").disabled = ifDisable;
  //getHTML("minmax-button").disabled = ifDisable;
  //getHTML("presuc-button").disabled = ifDisable;
  getHTML("delete-button").disabled = ifDisable;
  getHTML("traversal-button").disabled = ifDisable;
  getHTML("clear-button").disabled = ifDisable;
}
function clearBstGraph() {
  $(".AVLGraphContainer").empty();
  let selectedBox = getHTML("bstSample");
  selectedBox.selectedIndex = 0;
}
