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

function treeDelete(root, node, treeNodes){
  console.log(treeNodes);
  var returnNode = null;
  if (!node.left){
    treeNodes = transplant(root,node,node.right,treeNodes);
    if(!node.right){
      returnNode = node.parent.key;
    }
    returnNode = node.right.key;
  }
  else if(!node.right){
    treeNodes = transplant(root,node,node.left,treeNodes);
    returnNode = node.left.key;
  }
  else{
    var replaceNode = treeMin(node.right);
    returnNode = replaceNode.parent.key;
    if (replaceNode.parent != node){
      treeNodes = transplant(root,replaceNode,replaceNode.right,treeNodes);
      replaceNode.right = node.right;  
      replaceNode.right.parent = replaceNode;
      treeNodes[replaceNode.right.id] = replaceNode.right; 

    }
    treeNodes = transplant(root,node,replaceNode,treeNodes);
    replaceNode.left = node.left;
    treeNodes[replaceNode.id] = replaceNode;  
    replaceNode.left.parent = replaceNode;
    treeNodes[replaceNode.left.id] = replaceNode.left; 

  }

  return{
    adjust: returnNode;
    newLayout: trreeNodes;
  }
}


function transplant(root,toDelete,replace,treeNodes){
  var node = toDelete.parent;
  if(!toDelete.parent){
    root = replace;
  }
  else if (toDelete = node.left){
    node.left = replace;
    node.leftEdge =  
    resetEdge(node.leftEdge,node.leftEdge.source,replace.id.toString());
    treeNodes[toDelete.parent.id] = node;
  }
  else{
    node.right = replace;
    node.rightEdge = 
    resetEdge(node.rightEdge, node.rightEdge.source, replace.id.toString());

    treeNodes[node.id] = node;
  }
  if(replace){
    if(toDelete != replace.parent){
      if(toDelete.leftEdge){
        replace.leftEdge =  toDelete.leftEdge;
        replace.leftEdge = 
        resetEdge(replace.leftEdge,replace.id.toString(),replace.leftEdge.target);
      }
      if(toDelete.rightEdge){
        replace.rightEdge = toDelete.rightEdge;
        replace.rightEdge = 
        resetEdge(replace.rightEdge,replace.id.toString(),replace.rightEdge.target);
      }
    }
    replace.parent = node;
    replace = resetReplace(replace, toDelete);
    treeNodes[replace.id] = replace;
    
  }
  return treeNodes;
}


function resetReplace(replace, toDelete){
  replace.position = toDelete.position;
  replace.sideToParent = toDelete.sideToParent;
}

function resetEdge(edge, source, target){
   edge.id = source + "-" + target;
   edge.source = source;
   edge.target = target;
   return edge;
}



function inorderTreeWalk(root){
   if(root){
    var node = [root.id];
    var edge = [];
    var left = inorderTreeWalk(root.left);
    var right = inorderTreeWalk(root.right);
    node = left.node.concat(node).concat(right.node);
   if(root.leftEdge){    
      edge = edge.concat(left.edge);
      edge.push(root.leftEdge.id);
    } 
    if(root.rightEdge){
      edge.push(root.rightEdge.id);
      edge = edge.concat(right.edge);
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
    var node = [root.id];
    var edge = [];
    var left = preorderTreeWalk(root.left);
    var right = preorderTreeWalk(root.right);
    node = node.concat(left.node).concat(right.node);
    if(root.leftEdge){
      edge.push(root.leftEdge.id);
      edge = edge.concat(left.edge);
    } 
    if(root.rightEdge){
      edge.push(root.rightEdge.id);
      edge = edge.concat(right.edge);
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
    var node = [root.id];
    var edge = [];
    var left = postorderTreeWalk(root.left);
    var right = postorderTreeWalk(root.right);
    node = left.node.concat(right.node).concat(node);

    if(root.leftEdge){
      edge = edge.concat(left.edge);
      edge.push(root.leftEdge.id);
    } 
    if(root.rightEdge){
      
      edge = edge.concat(right.edge);
      edge.push(root.rightEdge.id);
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


















