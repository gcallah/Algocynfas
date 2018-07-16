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
    return null;
  }
  
  highLightN.push(root.id);

  if(root.key == target){
    return highLightN;
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

  return ({
        min: root.layout.label,
        HLNodeId: highLightN,
  })

}

function treeMax(root){
  var highLightN = []
   while (root.right != null){
    highLightN.push(root.id);
    root = root.right;
  }
  highLightN.push(root.id);
  return ({
        max: root.layout.label,
        HLNodeId: highLightN,
  })


}





























