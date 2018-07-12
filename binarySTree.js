function treeInsert(root, newNode){      // CRLS P294 root == T.root, r == x, curr == y, newNode == z 
  var r = root;                        
  var curr = null;                    // y = NIL
  var LastDir = null;
  var adjustList = [];
  while (r != null){                    // while x != NIL
    curr = r;                          // y = x
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
         };
 
  

  return result;
}
 

/*function binaryS(curr, input, lastDir = null, adjustList = []){
    if (!curr.left && curr.right){
      if(input < curr.key){
         if(lastDir == "right"){
            adjustList.push(curr);
          }
          return [curr,"left", adjustList]
      }
      else{
        if(lastDir == "left"){
          adjustList.push(curr);;
        }
          return binaryS(curr.right, input, "right", adjustList);
      }
    }
    else if(curr.left && !curr.right){
      if(input < curr.key){
        if(lastDir == "right"){
          adjustList.push(curr);
        }
          return binaryS(curr.left, input, "left", adjustList);
      }
      else{
          if(lastDir == "left"){
            adjustList.push(curr);
          }
          return [curr, "right", adjustList];
      }
    }
    else if(!curr.left && !curr.right){
      if(input < curr.key){
          if(lastDir == "right"){
            adjustList.push(curr);
          }
          return [curr,"left", adjustList]
      }
      else{
          if(lastDir == "left"){
            adjustList.push(curr);
          }
          return [curr, "right", adjustList];
      }
    }
    else {
      if(input < curr.key){
        if(lastDir == "right"){
          adjustList.push(curr);
        }
          return binaryS(curr.left, input, "left", adjustList);
      }
      else{
        if(lastDir == "left"){
          adjustList.push(curr);
        }
          return binaryS(curr.right, input, "right", adjustList);
      }
    }
 }

 function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}
*/


