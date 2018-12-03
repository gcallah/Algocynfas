
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

function disableHeapButtons(ifDisable){
  getHTML("heap-insert-list").disabled = ifDisable;
  getHTML("heap-insert").disabled = ifDisable;
  getHTML("heap-remove").disabled = ifDisable;
}


async function heapInsert(ifEdge ) {

	disableHeapButtons(true);

	var val = getHTML("heap-insert-value").value;
	if (isNaN(val))
	{
		noticeErr("Please enter a number","heap-insert-value");
		disableHeapButtons(false);
		return;
	}
	correctErr("heap-insert-value");
	

	await graph.insert(val);

	disableHeapButtons(false);
}




async function heapInsertList(){

	disableHeapButtons(true);
	
	var an_input = getHTML("heap-insert-list-value").value;
	var list_num = splitInput(an_input, true);
	if(list_num.length == 0 || list_num.length == 1){
		noticeErr("Invalid List!", "heap-insert-list-value");
		disableHeapButtons(false);
		return;
	}
	for (var i = 0; i<list_num.length; i++) {
		list_num[i]=parseInt(list_num[i]);
		if (!Number.isInteger(list_num[i])){
			noticeErr("The number at index" + i + "is invalid! ", "heap-insert-list-value");
			disableHeapButtons(false);
			return;
		}
	}
	correctErr("heap-insert-list-value");
	/*for(var i = 0; i<list_num.length; i++){
		await graph.insert(list_num[i]);
	}*/

	graph.arrayList = window.createList(canvas, list_num);
	await graph.build_heap(list_num);

	disableHeapButtons(false);

}


async function heapRemove(ifEdge) {

	disableHeapButtons(true);

	await graph.remove();

	disableHeapButtons(false);
}

function heapClear() {
	$("#heapCanvas").empty();
	canvas.clear();
}


