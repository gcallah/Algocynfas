// below are Red Black tree algorithms


function createTree(rbtree, data) {
  for (const input of data) {
    insert(rbtree, input)
  }
  console.log("insertion good, the root is:", rbtree.root)
}

function insert(rbtree, data)
{
    let newNode = new rbTreeNode(data);
                    
    if(rbtree.root === null){
        newNode.color = BLACK;
        rbtree.root = newNode;
    }
    else {
      newNode.color = RED;
      insertNode(rbtree.root, newNode);
      insertFixUp(rbtree, newNode)
    }
    
}

function insertNode(node, newNode)
{
    if(newNode.key < node.key)
    {
        if(node.left === null) {
            node.left = newNode;
            newNode.parent = node;
        }
        else
            this.insertNode(node.left, newNode);
    }
    else
    {
        if(node.right === null) {
            node.right = newNode;
            newNode.parent = node;
        }
        else
            this.insertNode(node.right,newNode);
    }
}

// testTree.root = new rbTreeNode(4)
// testTree.root.color = BLACK;
// testTree.root.left = new rbTreeNode(1)
// testTree.root.left.parent = testTree.root
// testTree.root.left.color = RED;
// testTree.root.right = new rbTreeNode(17);
// testTree.root.right.color = RED;
// testTree.root.right.parent = testTree.root;
// testTree.root.right.right = new rbTreeNode(20);
// testTree.root.right.right.color = RED;
// testTree.root.right.right.parent = testTree.root.right;

function rbtreeInsert(root, newNode, tree) {
  // CLRS P294 root == T.root, r == x, curr == y, newNode == z

  var r = root; //x = root
  var curr = null; // y = NIL
  var LastDir = null;
  var adjustList = [];
  var highLightN = [];
  // console.log(newNode)
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
    curr.leftNode = "EXIST";
    newNode.sideToParent = "left";
  } else {
    curr.right = newNode; // else y.right = z
    curr.rightNode = "EXIST";
    newNode.sideToParent = "right";
  }

  newNode.leftNode = null; // Z.left = T.nil
  newNode.rightNode = null; //  Z.right = T.nil

  newNode.color = RED; //  Z.color = Red

  if (newNode == root) newNode.color = BLACK;
  else {
    root = insertFixUp(tree, newNode);
  }

  var result = {
    root: root,
    node: newNode,
    adj: adjustList,
    hlNodeId: highLightN,
    
  };

  return result;
}

function insertFixUp(tree, newNode) {
  // T,z
  
  while (newNode.parent && newNode.parent.color == RED) {
    if (newNode.parent == newNode.parent.parent.left) {
      aunt = newNode.parent.parent.right;
      if (aunt != null && aunt.color == RED) {
        newNode.parent.color = BLACK;
        aunt.color = BLACK;
        newNode.parent.parent.color = RED;
        newNode = newNode.parent.parent;
      } else {
        if (newNode == newNode.parent.right) {
          newNode = newNode.parent;
          console.log("before left rotation ", tree)
          leftRotate(tree, newNode);
        }
        
        newNode.parent.color = BLACK;
        newNode.parent.parent.color = RED;
        rightRotate(tree, newNode.parent.parent);
      }
    } else {
      aunt = newNode.parent.parent.left;
      if (aunt != null && aunt.color == RED) {
        newNode.parent.color = BLACK;
        aunt.color = BLACK;
        newNode.parent.parent.color = RED;
        newNode = newNode.parent.parent;
      } else {
        if (newNode == newNode.parent.left) {
          newNode = newNode.parent;
          rightRotate(tree, newNode);
        }

        newNode.parent.color = BLACK;
        newNode.parent.parent.color = RED;
        leftRotate(tree, newNode.parent.parent);
      }
    }
  }
  tree.root.color = BLACK;
  return tree.root;
  //while z.p.color == Red
  // if z.p == z.p.p.left
  // y = z.p.p.right
  // if y.color == RED
  //  z.p.color = BLACK
  //  y.color = BLACK
  //  z.p.p.color = RED
  //  z = z.p.p
  //  else if z == z.p.right
  //  z = z.p
  //  LEFT-ROTATE(T,z)
  //  z.p.color = BLACK
  //  z.p.p.color = RED
  //  RIGHT-ROTATE(T,z.p.p)

  //else
  // y = z.p.p.left
  // if y.color == RED
  //  z.p.color = BLACK
  //  y.color = BLACK
  //  z.p.p.color = RED
  //  z = z.p.p
  //  else if z == z.p.left
  //  z = z.p
  //  RIGHT-ROTATE(T,z)
  //  z.p.color = BLACK
  //  z.p.p.color = RED
  //  LIGHT-ROTATE(T,z.p.p)

  // T.root.color = BLACK
}

function leftRotate(tree, newNode) {
  // T x
  if (newNode == null || newNode.right == null) return;
  let y = newNode.right;
  newNode.right = y.left;
  if (y.left !== null) {
    y.left.parent = newNode;
  }
  y.parent = newNode.parent;
  if (newNode.parent == null) {
    tree.root = y;
  } else if (newNode == newNode.parent.left) {
    newNode.parent.left = y;
  } else {
    newNode.parent.right = y;
  }
  y.left = newNode;
  newNode.parent = y;
  // y = x.right
  // x.right = y.left
  // if y.left != T.nil
  //   y.left.p = x
  // y.p = x.p
  // if x.p == T.nil
  //   T.root = y
  // else if x == x.p.left
  //   x.p.left = y
  // else
  //   x.p.right = y
  // y.left = x
  // x.p = y
  return tree.root;
}

function rightRotate(tree, newNode) {
  // T x
  if (newNode == null || newNode.left == null) return;
  let y = newNode.left;
  newNode.left = y.right;
  if (y.right != null) {
    y.right.parent = newNode;
  }
  y.parent = newNode.parent;
  if (newNode.parent == null) {
    tree.root = y;
  } else if (newNode.parent.right == newNode) {
    newNode.parent.right = y;
  } else {
    newNode.parent.left = y;
  }
  y.right = newNode;
  newNode.parent = y;

  // y = x.left
  // x.left = y.right
  // if y.left != T.nil
  //   y.right.p = x
  // y.p = x.p
  // if x.p == T.nil
  //   T.root = y
  // else if x == x.p.right
  //   x.p.right = y
  // else
  //   x.p.left = y
  // y.right = x
  // x.p = y
  return tree.root;
}

function treeDelete(root, node, treeNodes) {
  //CLRS p298   (z == node,T == this.root,y == replaceNode )

  var highLightN = [];
  var result = [];
  if (!node.left) {
    // if(z.left == NIL)
    root = transplant(root, node, node.right, treeNodes); // transplant(T,z,z.right)
  } else if (!node.right) {
    // else if(z.right == NIL)
    root = transplant(root, node, node.left, treeNodes); // transplant(T,z,z.left)
  } else {
    var minNode = treeMin(node.right); // else y = Tree-Minimum(z.right)
    var replaceNode = minNode.min;
    highLightN = minNode.HLNodeId;
    if (replaceNode.parent != node) {
      // if(y.p != z)
      root = transplant(root, replaceNode, replaceNode.right, treeNodes); //transplant(T,y,y.right)
      replaceNode.right = node.right; // y.right = z.right
      replaceNode.right.parent = replaceNode; // y.right.p = y
      treeNodes[replaceNode.right.id] = replaceNode.right;
    }
    root = transplant(root, node, replaceNode, treeNodes, false); //transplant(T,z,y)
    replaceNode.left = node.left; // y.left = z.left
    treeNodes[replaceNode.id] = replaceNode;
    replaceNode.left.parent = replaceNode; // y.left.p = y
    treeNodes[replaceNode.left.id] = replaceNode.left;
  }

  return {
    path: highLightN,
    root: root,
  };
}

function transplant(root, toDelete, replace, treeNodes, ifPosition = true) {
  var node = toDelete.parent;
  if (!toDelete.parent) {
    root = replace;
  } else if (toDelete == node.left) {
    node.left = replace;
    node.leftEdge = resetEdge(node.leftEdge, node, replace);
    treeNodes[node.id] = node;
  } else {
    node.right = replace;
    node.rightEdge = resetEdge(node.rightEdge, node, replace);
    treeNodes[node.id] = node;
  }
  if (replace) {
    if (toDelete.leftEdge && toDelete.left != replace) {
      replace.leftEdge = toDelete.leftEdge;
      replace.leftEdge = resetEdge(replace.leftEdge, replace, toDelete.left);
    }
    if (toDelete.rightEdge && toDelete.right != replace) {
      replace.rightEdge = toDelete.rightEdge;
      replace.rightEdge = resetEdge(replace.rightEdge, replace, toDelete.right);
    }
    replace.parent = node;
    if (ifPosition || toDelete.right.key == replace.key) {
      replace = resetReplace(replace, toDelete);
    } else {
      replace.position = toDelete.position;
      replace.layout.x = replace.position.x;
      replace.layout.y = replace.position.y;
    }
    treeNodes[replace.id] = replace;
  }
  return root;
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

function afterDeletePosition(node, x, y) {
  node.layout.x += x;
  node.position.x += x;
  node.layout.y += y;
  node.position.y += y;
  if (node.left) {
    this.afterDeletePosition(node.left, x, y);
  }
  if (node.right) {
    this.afterDeletePosition(node.right, x, y);
  }
  return node;
}

function deleteFixUp() {}

// below are facilitate functions

function rbtCheck() {
  if (!animeRunning) {
    var graph = new RBT();
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
  $(".rbtGraphContainer").empty();

  Graph.createSigmaGraph("rbtGraphContainer");
  return true;
}

async function deleteNode() {
  if (rbtCheck()) {
    await Graph.delete();
    disableButtons(false);
  }
}

function disableButtons(ifDisable) {
  getHTML("createRBT-button").disabled = ifDisable;
  getHTML("insert-rb-button").disabled = ifDisable;
  getHTML("delete-rb-button").disabled = ifDisable;
  getHTML("clear-rb-button").disabled = ifDisable;
}

function clearBstGraph() {
  $(".rbtGraphContainer").empty();
  let selectedBox = getHTML("rbtSample");
  selectedBox.selectedIndex = 0;
}
