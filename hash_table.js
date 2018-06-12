function SetupTable(){

	let size = document.getElementById("table_size").value;
	size=parseInt(size);
	canvas.clear();      
	if (Number.isInteger(size) && size > 1 && size < 21){
		correct_err("table_size");
		document.getElementById("table_size").style.background="#FCF5DB";
		list=Array.apply(null, {length: size}).map(Number.call, Number); 
		Hash_Table= createHashTable(canvas, list);
	}
	else
	{
		notice_err("Please enter a valid size between 2-20 !","table_size");
	}
	return;
}

function calculateHashValue()
{
    var func = document.getElementById("hash_func").value; 
    var size= document.getElementById("table_size").value;
    var input = document.getElementById("InputValue").value;
    var error_value = 100;
    
    if(func&&size&&input){
    	if(parseInt(input) > 999 || parseInt(input) < 0){
    		notice_err("Please enter a positive integer between 0 to 999!",
                "InputValue")
    		return error_value;
    	}
    	correct_err("InputValue");
        try {
      		formula = func.split("x").join("input");
      		if(func==formula){
      			notice_err("Function is invalid!","hash_func");
      			return error_value;
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
     		correct_err("hash_func");
     		return result;
    
     		 }
        catch(error) {
            notice_err("Function is invalid!", "hash_func");
            return error_value;
        }
    }
    else{
    	notice_err("Incomplete input!");
    	return error_value;
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
	var error_value = 100;
	var input = document.getElementById("InputValue").value;
	input = parseInt(input);
	if(!Hash_Table){
		notice_err("Please set the size first!");
	}
	else{
		var value = calculateHashValue();
		if(value != error_value)
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
    Hash_Table.setHList(value, input);
}

function hashProbing(input, value)
{
	if(Probing_counter <= document.getElementById("table_size").value-1){
		Probing_counter += 1;
		Hash_Table.setHValue(value, input);
		
	}
	else{
		notice_err("Sorry, the hash table is full!");

    }
}


function clearTable()
{
	canvas.clear();
	document.getElementById("hash_func").value="";
	document.getElementById("InputValue").value="";
  probingCounter=0;
	
	
}


function create_legend() {
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
  var legend = create_legend();
  return document.getElementById("legend").innerHTML =
  `<ul class='list-group col-3'>
    <li class='list-group-item' style = background-color:${legend.data[0].color}>
    ${legend.data[0].title}
    </li>
    <li class='list-group-item' style = background-color:${legend.data[1].color}>
    ${legend.data[1].title}
    </li>
  </ul>`;
}

