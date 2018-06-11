function hash()
{
	animeRunning = true;
    document.getElementById("set-button").disabled = true;
	document.getElementById("table_size").disabled = true;
	document.getElementById("hash_func").disabled = true;
	
	window.hashing(Hash_Table);
	
    document.getElementById("set-button").disabled = false;
	document.getElementById("table_size").disabled = false;
	document.getElementById("hash_func").disabled = false;

}


function hashing()
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
	 		Hash_Table.setHList(result,input);
	    }
	    catch(error) {
	        notice_err("Function is invalid!", "hash_func");
	    }
    }
    else{
    	notice_err("Incomplete input!");
    }
}


