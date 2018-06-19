//test

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
   var input = document.getElementById("InputValue").value;
   var errorValue = 100;
  if(parseInt(input) > 999 || parseInt(input) < 0){
        noticeErr("Please enter a positive integer between 0 to 999!",
                "InputValue");
        return errorValue;
      }
      correctErr("InputValue");
}

function chooseFunc(){
  let selectedBox = document.getElementById("funcChoices");
  var funcSelected = selectedBox.selectedIndex;
  var size= parseInt(document.getElementById("tableSize").value);
  var func = document.getElementsByName("func");
  var input = parseInt(document.getElementById("InputValue").value);
  var errorValue = 100;

    if (funcSelected == 0){
        noticeErr("Please select a function first!");
        return errorValue;
    }

    if (funcSelected == 1){
      if(size % 2 != 0){
          noticeErr("Please set an even size first!","tableSize");
          return errorValue;
      }
      correctErr("tableSize");
      return (2 * input) % size; //f1
    }

    else if (funcSelected == 2){
      if(!isPrime(size)){
          noticeErr("Please set a prime size first!","tableSize");
          return errorValue;
      }
      correctErr("tableSize")
      return (2 * input) % size; //f2
    }
    
    else if (funcSelected == 3){
      return (input ** 2) % size; //f3
    }

    else if (funcSelected == 4){
      return (input ** 3) % size; //f4
    }

    else if (funcSelected == 5){
      return (7 * input + 11) % size; //f5
    }
  
    else if (funcSelected == 6){
    return calculateHashValue(); 
   }
}


function SetupTable(){

	let size = document.getElementById("tableSize").value;
	size=parseInt(size);
	canvas.clear();      
	if (Number.isInteger(size) && size > 1 && size < 21){
		correctErr("tableSize");
		document.getElementById("tableSize").style.background="#FCF5DB";
		list=Array.apply(null, {length: size}).map(Number.call, Number); 
		hashTable= createHashTable(canvas, list);
	}
	else
	{
		noticeErr("Please enter a valid size between 2-20 !","tableSize");
	}
	return;
}

function isPrime(input) {
    let prime = true;
    for (let i = 2; i <= Math.sqrt(input); i++) {
        if (input % i == 0) {
            prime = false;
            break;
        }
    }
    return prime && (input > 1);
}

function isCustomize(){
  if (document.getElementById("funcChoices").selectedIndex == 6){
    document.getElementById("hashFunc").style.visibility = "visible";
    document.getElementById("text").style.visibility = "visible";
  }
  else{
    document.getElementById("hashFunc").style.visibility = "hidden";
    document.getElementById("text").style.visibility = "hidden";
  }

}

function calculateHashValue()
{
    var func = document.getElementById("hashFunc").value; 
    var size= document.getElementById("tableSize").value;
    var input = document.getElementById("InputValue").value;
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
  if(document.getElementById("chaining").checked){
      return "CHAIN";
  }
  return "PROB";
}


function hash()
{
  chainOrProbe= checkHashType()
	var errorValue = 100;
	var input = document.getElementById("InputValue").value;
	input = parseInt(input);
	if(!hashTable){
		noticeErr("Please set the size first!");
	}
	else{
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

function hashChaining(input, value)
{
    hashTable.setHList(value, input);
}

function hashProbing(input, value)
{
	if(probingCounter <= document.getElementById("tableSize").value-1){
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
	document.getElementById("hashFunc").value="";
	document.getElementById("InputValue").value="";
  probingCounter=0;
	
	
}


function createLegend() {
    const legend = {    
        "data": [{
                    "title": "Table Index",
                    "color": DEF_HL_COLOR,
                },
                {
                    "title": "Hashed Values",
                    "color": DEF_BG_COLOR,
                        },]
    };
    return legend;
}

function displayLegend() {
  var legend = createLegend();
  return document.getElementById("legend").innerHTML =
  `<div class='list-group col-3'>
    <div class='list-group-item' style = background-color:${legend.data[0].color}>
    ${legend.data[0].title}
    </div>
    <div class='list-group-item' style = background-color:${legend.data[1].color}>
    ${legend.data[1].title}
    </div>
  </div>`;
}

