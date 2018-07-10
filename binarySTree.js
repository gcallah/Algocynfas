function binaryS(curr, input){

    if (!curr.left && curr.right){
      if(input <= curr.key){
         return [curr,"left"];
      }
      else{
      	return binaryS(curr.right, input);
      }
    }
    else if(curr.left && !curr.right){
      if(input <= curr.key){
        return binaryS(curr.left, input);
      }
      else{
          return [curr, "right"];
      }
    }

    else if(!curr.left && !curr.right){

      if(input <= curr.key){
          return[curr,"left"];
      }
      else{
          return [curr, "right"];
      }
    }

    else {

      if(input <= curr.key){
        return binaryS(curr.left, input);
      }
      else{
        return binaryS(curr.right, input);
      }
    }

 }

 function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

 
