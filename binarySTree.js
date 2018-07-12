function binaryS(curr, input, lastDir = null, adjustList = []){
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

 
