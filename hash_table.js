function SetupTable(){

	let size = document.getElementById("table_size").value;
	size=parseInt(size);
	canvas.clear();      
	if (Number.isInteger(size) && size > 1 && size < 21){
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

function hash()
{
	var func = document.getElementById("hash_func").value; 
	var size= document.getElementById("table_size").value;
	var input = document.getElementById("InputValue").value;

	if(func&&size&&input){
	    try {
	  		formula = func.split("x").join("input");
	  		if(func==formula){
	  			notice_err("hash_func","Function is invalid!");
	  			return;
	  		}
	  		else{
	  			formula=func.split("x");
	  			for(var i=0; i<formula.length-1; i++){
	  				if( Number.isInteger(parseInt(formula[i][(formula[i].length)-1]))){
	  					formula[i]=formula[i].concat("*");
	  				}
	  			}
                formula=formula.join(input);
	  		}
	  		formula = formula.split("^").join("**");
	  		console.log(formula);
	 		result = eval(formula);
	 		result = parseInt(result % parseInt(size)); 
	 		console.log(result);
	 		input = parseInt(input);
	 		if(!Hash_Table){
	 			notice_err("Please set the size first!");
	 		}
	 		else{
	 		Hash_Table.setHList(result,input);
	 	    }
	    }
	    catch(error) {
	        notice_err("Function is invalid!", "hash_func");
	    }
    }
    else{
    	notice_err("Incomplete input!");
    }
}


function clearTable()
{
	canvas.clear();
	document.getElementById("hash_func").value="";
	document.getElementById("InputValue").value="";
	
}


function create_legend() {
    const legend = {    
        "data": [{
                    "title": "Table Index",
                    "color": DEF_HL_COLOR,
                },
                {
                    "title": "Hashed List",
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

