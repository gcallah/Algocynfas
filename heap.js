
function heap_less(t1, t2) {
	return parseInt(t1.key) < parseInt(t2.key);
}


function heap_greater(t1, t2) {
	return parseInt(t1.key) > parseInt(t2.key);
}


class heap extends BST {

	constructor(cmp = heap_less) {
		super();
		this.data = [];
		this.data.push(null);
		this.cmp = cmp;
		this.id = 0;
		this.highLightNodes = [];
		this.highLightEdges = [];
	}

	parent(i) {
		return Math.floor(i / 2);
	}

	left(i) {
		return 2 * i;
	}

	is_left(i) {
		return this.parent(i) * 2 == i;
	}

	is_right(i) {
		return !this.is_left(i);
	}

	has_left(i) {
		return this.left(i) < this.data.length;
	}

	right(i) {
		return 2 * i + 1;
	}

	has_right(i) {
		return this.right(i) < this.data.length;
	}

	down_heap(i) {

		while (this.has_left(i)) {
			var min_child = this.left(i);

			if (this.has_right(i)) {
				if( this.cmp(this.data[this.right(i)], this.data[min_child]) ) {
					min_child = this.right(i);
				}
			}

			if( this.cmp(this.data[min_child], this.data[i])) {
				[this.data[i].key, this.data[min_child].key] = [this.data[min_child].key, this.data[i].key];
				[this.data[i].id, this.data[min_child].id] = [this.data[min_child].id, this.data[i].id];

				i = min_child;
			} else {
				return;
			}

		}

	}

	async up_heap(i) {
		this.highLightNodes.push(i);
		this.startGraph(false, 'heapCanvas');
		await this.pause();

		while(i > 1) {
			var p = this.parent(i);
			this.highLightNodes.push(p);
			this.startGraph(false, 'heapCanvas');
			await this.pause();
			if( this.cmp(this.data[i], this.data[p])) {

				this.highLightEdges.push([this.data[i].id, this.data[p].id ]);
				this.startGraph(false, 'heapCanvas');
				await this.pause();

				[this.data[i].key, this.data[p].key] = [this.data[p].key, this.data[i].key];
				[this.data[i].id, this.data[p].id] = [this.data[p].id, this.data[i].id];
				i = p;

				this.startGraph(false, 'heapCanvas');
				await this.pause();
			} else {
				this.highLightNodes = [];
				this.highLightEdges = [];
				this.startGraph(false, 'heapCanvas');
				await this.pause();
				return;
			}
		}

		this.highLightNodes = [];
		this.highLightEdges = [];
		this.startGraph(false, 'heapCanvas');
	}

	insert(val) {
		var node = new treeNode(val, this.id++);

		this.data.push(node);
		var l = this.data.length-1;
		if(l != 1) {
			this.data[l].parent = this.data[this.parent(l)];

			if(this.is_left(l)) {
				this.data[l].sideToParent = "left";
				this.data[l].parent.left = this.data[l];
			} else {
				this.data[l].sideToParent = "right";
				this.data[l].parent.right = this.data[l];
			}
		}

		this.up_heap(l);
	}

	remove() {

		if(this.data.length == 1)
			return;
		var result = this.data[1];

		[this.data[1].key, this.data[this.data.length-1].key] = [this.data[this.data.length-1].key, this.data[1].key];
		[this.data[1].id, this.data[this.data.length-1].id] = [this.data[this.data.length-1].id, this.data[1].id];
		this.data.pop();

		this.down_heap(1);

		return result;
	}

	async pause (time = 1000) { 
	  return new Promise(function (resolve) {
	    setTimeout(resolve, time)
	  });
	}

	startGraph(ifEdge, container) {


		var nodes = [];
		var edges = [];

		for(var i = 1; i < this.data.length; i++) {
			this.data[i].setNode();
			this.data[i].strenchTimes = 0;
			this.data[i].layout.color = EdgeNodeCOLOR;
			nodes.push(this.data[i].layout);
		}

		for (var i = 0; i < this.highLightNodes.length; i++){
			nodes[this.highLightNodes[i]-1].color = HIGHLIGHT;
		}


		for(var i = 1; i < this.data.length; i++) {

			if(this.has_left(i)){
				edges.push(
					{
				     id: this.id++,
				     source: this.data[i].id,
				     target: this.data[this.left(i)].id,
				     size :5,
				     label : 0,
				     type: 'line',
				     color: EdgeNodeCOLOR
				   }
				)
			}else
				break;


			if(this.has_right(i)){
			edges.push(
				{
			     id: this.id++,
			     source: this.data[i].id,
			     target: this.data[this.right(i)].id,
			     size :5,
			     label : 0,
			     type: 'line',
			     color: EdgeNodeCOLOR
			   }
			)
			}else
				break;
		}

		for (var i = 0; i < edges.length; i++){
			for (var j = 0;  j < this.highLightEdges.length; j++) {

				if (edges[i].source == this.highLightEdges[j][0] && edges[i].target == this.highLightEdges[j][1]) {
					edges[i].color = HIGHLIGHT;
				}

				else if (edges[i].source == this.highLightEdges[j][1] && edges[i].target == this.highLightEdges[j][0]) {
					edges[i].color = HIGHLIGHT;
				}	

			}
		}

		for (var i = 4; i < this.data.length; i *= 2) {
			for (var j = 2; j < i; j++) {
				if (this.data[j].strenchTimes == 0) {
					this.data[j].strenchTimes = 1;
				} else {
					this.data[j].strenchTimes *= 2;
				}
				for( var k = 0; k < this.data[j].strenchTimes; k++) {
					if (j % 2 == 0)
						this.adjustPos("left", this.data[j]);
					else
						this.adjustPos("right", this.data[j]);
				}
			}
		}


		let g = {
  			"nodes": nodes,
  			"edges": edges
		}


		$("#heapCanvas").empty();

		this.sigma = new sigma({
		    graph: g,
		    renderer: {
		      container: container,
		      type: 'canvas'
		    },
		    settings: {
		      defaultNodeColor: EdgeNodeCOLOR,
		      enableCamera: false,
		      autoRescale: false,
		      defaultEdgeLabelSize: 15,

		    }
		});


		this.sigma.refresh();

		list = [];
		for(var i = 1; i < this.data.length; i++) {
			list.push(this.data[i].key);
		}
		drawListOnScreen(list);
	}
}

var graph = new heap();

function heapChange() {

	var radios = document.getElementsByName('heapType');

	for (var i = 0, length = radios.length; i < length; i++)
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


function heapInsert(ifEdge) {
	
    var val = document.getElementById("heap-insert-value").value;
	if (isNaN(val))
    {
        noticeErr("Please enter a number","heap-insert-value")
        return;
    }
    graph.insert(val);
 	graph.startGraph(ifEdge, 'heapCanvas');
}

function heapRemove(ifEdge) {

	graph.remove();
 	graph.startGraph(ifEdge, 'heapCanvas');
}
