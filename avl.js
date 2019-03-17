//Below is the code for AVL tree
//perform standard BST insert for new node
function treeInsertAVL(root, newNode) {
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
}
//write  a function here which checks height of left and right subtrees

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
