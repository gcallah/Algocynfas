
var graph = new heap();

function heap_less(t1, t2) {
	return parseInt(t1.key) < parseInt(t2.key);
}


function heap_greater(t1, t2) {
	return parseInt(t1.key) > parseInt(t2.key);
}

function heapChange() {

	var radios = document.getElementsByName('heapType');

	for (var i = 0;  i < radios.length; i++)
	{
		if (radios[i].checked)
		{
			if (radios[i].value == "maxHeap")
				graph = new heap(heap_greater);
			else
				graph = new heap(heap_less)
		}
	}

	graph.startGraph(false, 'heapCanvas');

}


function heapInsert(ifEdge ) {

	var val = getHTML("heap-insert-value").value;
	if (isNaN(val))
	{
		noticeErr("Please enter a number","heap-insert-value")
		return;
	}
	correctErr("heap-insert-value");
	

	graph.insert(val);
	graph.startGraph(ifEdge, 'heapCanvas');
}




function heapInsertList(){
	
	var an_input = getHTML("heap-insert-list").value;
	var list_num = splitInput(an_input, true);
	if(list_num.length == 0 || list_num.length == 1){
		noticeErr("Invalid List!", "heap-insert-list");
		return;
	}
	for (var i = 0; i<list_num.length; i++) {
		list_num[i]=parseInt(list_num[i]);
		if (!Number.isInteger(list_num[i])){
			noticeErr("The number at index" + i + "is invalid! ", "heap-insert-list");
			return;
		}
	}
	correctErr("heap-insert-list");
	for(var i = 0; i<list_num.length; i++){
		graph.insert(list_num[i]);
		graph.startGraph(false, 'heapCanvas');
	}

}


function heapRemove(ifEdge) {

	graph.remove();
	graph.startGraph(ifEdge, 'heapCanvas');
}
