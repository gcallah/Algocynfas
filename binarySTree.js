function treeInsert(root, newNode){      // CRLS P294 root == T.root, r == x, curr == y, newNode == z 
  var r = root;                        
  var curr = null;                    // y = NIL
  var LastDir = null;
  var adjustList = [];
  var highLightN = [];
  while (r != null){                    // while x != NIL
    curr = r;                          // y = x
    highLightN.push(curr.id);
    if (newNode.key < r.key){          // if z.key < x.key
      if(LastDir == "right"){
         adjustList.push(r);
      }
      r = r.left;                      // x = x.left
      LastDir = "left";
    }
    else{
      if(LastDir == "left"){
         adjustList.push(r);
      }
      r = r.right;                 // else x = x.right
      LastDir = "right";
    }   
  }
  newNode.parent = curr;           // z.p = y
  if (curr == null){               // if y == NIL
    root = newNode;                   // T.root = z
  }
  else if (newNode.key < curr.key){    // else if z.key < y.key
    curr.left = newNode;               // y.left = z;
    newNode.sideToParent = "left";
  }
  else{
    curr.right = newNode;             // else y.right = z
    newNode.sideToParent = "right";
  }

  var result = {
          root: root,
          node: newNode, 
          adj: adjustList,
          hlNodeId: highLightN,
         };

  return result;
}


function treeSearch( root, target, highLightN = []){

  if(!root){
    noticeErr("Node not found!");
    return null;
  }
  
  highLightN.push(root.id);

  if(root.key == target){
    var result = {
      node: root,
      path: highLightN,
    }
    return result;
  }

  if (target < root.key){
    return treeSearch(root.left, target, highLightN);
  }
  return treeSearch(root.right, target, highLightN);

} 

function treeMin(root){
   var highLightN = []
   while (root.left != null){
    highLightN.push(root.id);
    root = root.left;
  }
  highLightN.push(root.id);

  return {
        min: root.key,
        HLNodeId: highLightN,
  }
}

function treeMax(root){
  var highLightN = []
   while (root.right != null){
    highLightN.push(root.id);
    root = root.right;
  }
  highLightN.push(root.id);
  return {
        max: root.key,
        HLNodeId: highLightN,
  }
}

function treeSuccessor(node){
   if (node.right){
     var result = treeMin(node.right);
     result.HLNodeId.unshift(node.id);
     return {
      HLNodeId: result.HLNodeId,
      suc: result.min,
   };
  }
  var highLightN = [];
  highLightN.push(node.id);
  suc = node.parent;

  while (suc && node == suc.right){
    node = suc;
    highLightN.push(node.id);
    suc = suc.parent; 
  }

  if(suc){
    highLightN.push(suc.id);
    return  {
      HLNodeId: highLightN,
      suc: suc.key,
    };
  }
  else{
    noticeErr("This node is already the largest in the tree!")

  }

}

function treePredecessor(node){
  if (node.left){
     var result = treeMax(node.left);
     result.HLNodeId.unshift(node.id);
     return  {
      HLNodeId: result.HLNodeId,
      pre: result.max,
   };
  }
  var highLightN = [];
  highLightN.push(node.id);
  pre = node.parent;

  while (pre && node == pre.left){
    node = pre;
    highLightN.push(node.id);
    pre = pre.parent; 
  }

  if(pre){
    highLightN.push(pre.id);
    return  {
      HLNodeId: highLightN,
      pre: pre.key,
    };
  }
  else{
    noticeErr("This node is already the smallest in the tree!")

  }
}

function inorderTreeWalk(root){
   if(root){
    var node = root.id+",";
    var edge = "";
    var left = inorderTreeWalk(root.left);
    var right = inorderTreeWalk(root.right);
    node = left.node + node +right.node
   if(root.leftEdge){    
      edge += left.edge;
      edge = edge + root.leftEdge.id + ",";
    } 
    if(root.rightEdge){
      edge = edge + root.rightEdge.id + ",";
      edge += right.edge;
    }
    return {
      node: node,
      edge: edge,
  }
}
  return {
    node: [],
    edge: [],
  };
}

function preorderTreeWalk(root){
  if(root){
    var node = root.id+",";
    var edge = "";
    var left = preorderTreeWalk(root.left);
    var right = preorderTreeWalk(root.right);
    node = node+left.node +right.node
    if(root.leftEdge){
      edge = edge + root.leftEdge.id + ",";
      edge += left.edge;
    } 
    if(root.rightEdge){
      edge = edge + root.rightEdge.id + ",";
      edge += right.edge;
    }
    return {
      node: node,
      edge: edge,
  }
}
  return {
    node: [],
    edge: [],
  };
}

function postorderTreeWalk(root){
  if(root){
    var node = root.id+",";
    var edge = "";
    var left = postorderTreeWalk(root.left);
    var right = postorderTreeWalk(root.right);
    node = left.node +right.node+node;
    if(root.leftEdge){
      
      edge += left.edge;
      edge = edge + root.leftEdge.id + ",";
    } 
    if(root.rightEdge){
      
      edge += right.edge;
      edge = edge + root.rightEdge.id + ",";
    }
    return {
      node: node,
      edge: edge,
  }
}
  return {
    node: [],
    edge: [],
  };
}


















