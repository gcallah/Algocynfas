/*test

module.exports = { SetupTable: SetupTable, 
                 calculateHashValue: calculateHashValue,
                 checkHashType: checkHashType,
                 hash: hash,
                 hashChaining: hashChaining,
                 hashProbing: hashProbing,
                 clearTable: clearTable,
                  }

//Bellow are functions-----------------------------------------------

function checkInput()
{
   var input = getHTML("InputValue").value;
  if(parseInt(input) > 999 || parseInt(input) < 0){
        noticeErr("Please enter a positive integer between 0 to 999!",
                "InputValue");
        return false;
      }
      correctErr("InputValue");
      return true;
}
*/

function chooseFunc(){
  let selectedBox = getHTML("funcChoices");
  var funcSelected = selectedBox.selectedIndex;
  var size= parseInt(getHTML("tableSize").value);
  var func = document.getElementsByName("func");
  var input = parseInt(getHTML("InputValue").value);
  var errorValue = 100;

    if (funcSelected == 0){
        noticeErr("Please select a function first!");
        return errorValue;
    }

    if (funcSelected == 1){
      return (2 * input) % size; //f1
    }

    else if (funcSelected == 2){
      return (input ** 2) % size; //f2
    }

    else if (funcSelected == 3){
      return (input ** 3) % size; //f3
    }

    else if (funcSelected == 4){
      return (7 * input + 11) % size; //f4
    }
  
    else if (funcSelected == 5){
    return calculateHashValue(); 
   }
}


function SetupTable(){

	let size = getHTML("tableSize").value;
	size=parseInt(size);
	canvas.clear();      
	if (Number.isInteger(size) && size > 1 && size < 21){
		correctErr("tableSize");
		getHTML("tableSize").style.background="#FCF5DB";
		list=Array.apply(null, {length: size}).map(Number.call, Number); 
		hashTable= createHashTable(canvas, list);
	}
	else
	{
		noticeErr("Please enter a valid size between 2-20 !","tableSize");
	}
	return;
}


function isCustomize(){
  if (getHTML("funcChoices").selectedIndex == 5){
    getHTML("hashFunc").style.visibility = "visible";
    getHTML("text").style.visibility = "visible";
  }
  else{
    getHTML("hashFunc").style.visibility = "hidden";
    getHTML("text").style.visibility = "hidden";
  }

}

function calculateHashValue()
{
    var func = getHTML("hashFunc").value; 
    var size= getHTML("tableSize").value;
    var input = getHTML("InputValue").value;
    var errorValue = 100;
    
    if(func&&size&&input){
        try {
      		formula = func.split("x").join("input");
      		if(func==formula){
      			noticeErr("Function is invalid!","hashFunc");
      			return errorValue;
      		}
      		else{
      		;
      			formula=func.split("x");
      			for(var i=0; i<formula.length-1; i++){
      				if( Number.isInteger(parseInt(formula[i][(formula[i].length)-1]))){
      					formula[i]=formula[i].concat("*");
      				}
      			}
                formula=formula.join(input);
      		}
      		formula = formula.split("^").join("**");
     		result = eval(formula);
     		result = parseInt(result % parseInt(size)); 
     		correctErr("hashFunc");
     		return result;
    
     		 }
        catch(error) {
            noticeErr("Function is invalid!", "hashFunc");
            return errorValue;
        }
    }
    else{
    	noticeErr("Incomplete inputs!");
    	return errorValue;
    }
}

function checkHashType()
{
  if(getHTML("chaining").checked){
      return "CHAIN";
  }
  return "PROB";
}


function hash()
{
  chainOrProbe= checkHashType();
	var errorValue = 100;
	var input = getHTML("InputValue").value;
	input = parseInt(input);
	if(!hashTable){
		noticeErr("Please set the size first!");
	}
	else{
    if(checkInput()){
		var value = chooseFunc();
		if(value != errorValue)
		{
            if(chainOrProbe == "CHAIN")
            {
                hashChaining(input, value)
            }
            else
            {
                console.log("here");
                hashProbing(input, value)
            }
        }
    }
  }
}

function hashChaining(input, value)
{
    hashTable.setHList(value, input);
}

function hashProbing(input, value)
{
	if(probingCounter <= getHTML("tableSize").value-1){
		probingCounter += 1;
		hashTable.setHValue(value, input);
		
	}
	else{
		noticeErr("Sorry, the hash table is full!");

    }
}


function clearTable()
{
	canvas.clear();
	getHTML("hashFunc").value="";
	getHTML("InputValue").value="";
  probingCounter=0;
	
	
}

