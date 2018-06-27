
function setWeight(){
   var choice = document.getElementById("graphWeight").selectedIndex;
   var wBox = document.getElementById("weights");
    if(choice == 0){
      weight = 0;
      wBox.style.display = "none";
    }
    else{
      weight = 1;
      wBox.style.display = "inline";
    }

}
function setDir(){
    var choice = document.getElementById("graphType").selectedIndex;
    if(choice == 0){
      dir = 0;
    }
    else{
      dir = 1;
    }
}

function typeChange(){
    var choice = document.getElementById("choices").selectedIndex;
    var inputBox = document.getElementById("nodeNum");
    if(choice == 0){
      inputBox.style.width = 200;
      inputBox.placeholder = "Enter node#, max 16 nodes";
      inputType = "num";
    }
    else{
      inputBox.style.width = 400;
      inputBox.placeholder = "Enter node names separate by comma, max 16 nodes";
      inputType = "name";
    }


}

function createGraph(ifEdge){
   var graph = new sigmaGraph(ifEdge);
   Graph = graph;
}





class sigmaGraph{

    constructor(ifEdge){
      this.sigma = null;
      this.graph = null;
      this.edgeLayout = [];
      this.nodes = [];
      this.edges = [];
      this.weights = null;
      this.setGraph(ifEdge);
  
    
    }

    setGraph(ifEdge){

      //Node part

     var rawInput = document.getElementById("nodeNum").value;

     if (inputType == "num"){
      var inputNum = parseInt(rawInput);
    }
    else{
      var nameList = rawInput.split(",");
      var inputNum = nameList.length;
      this.nodes = nameList;
      
    }

    // begin to do graphing prepare


    if(inputNum > 0 && inputNum < 17)
    {
      correctErr("nodeNum");
      var nodeLayout = sixteenArrange[inputNum];
      this.setGraphEdges(ifEdge);

      let g = {
        nodes: nodeLayout,
        edges: this.edgeLayout,
      }; 

      this.graph = g;

      if(inputType == "name"){
          this.setName();
        }
      else{
        var defaultList = [];
        var counter = 0;
        var aAscii = "a".charCodeAt(0);
        while (counter != inputNum){
          var elem = String.fromCharCode(counter+aAscii);
          defaultList.push(elem);
          counter += 1;
        }
        this.nodes = defaultList;
      }


    }

    else{
      noticeErr("Please give a valid input!", "nodeNum");

    }

    try{
        this.createSigmaGraph();
        if(this.edges.length==0){

          correctErr("edges");
        }
        
     }
     catch(error){
      noticeErr("Please make sure if the nodes existed!", "edges");
    }

    
  
     

  }

   

  setGraphEdges(ifEdge){

    if(ifEdge == true){
        var edgeList = (((document.getElementById('edges').value).split(" ")).join("")).split(",");
        this.edges = edgeList;

        var aAscii = "a".charCodeAt(0);
        var counter = 0;  

        if(dir == 1){
          var shape = "arrow";
        }
        else{
          var shape = "line";
        }

        for(var i = 0; i < edgeList.length; i++ ){
         var nodesToConnect = edgeList[i].split("-");
         if(nodesToConnect.length != 2 || nodesToConnect[0] == nodesToConnect[1]){
           noticeErr("Please enter edges in valid format (a-b,b-c), no self loop allowed !", "edges");
           return;
         }
         correctErr("edges");


         for(var j = 0; j < nodesToConnect.length - 1; j++){


          if (weight == 1){
            var listWeight =  (((document.getElementById('weights').value).split(" ")).join("")).split(",");
            this.weights = listWeight;
            var WEIGHT = parseInt(listWeight[counter]);
            if (Number.isInteger(WEIGHT)){
              correctErr("weights");
              WEIGHT = WEIGHT.toString();
            }
            else{
              noticeErr("Please make sure the weight input and the number of weight inputs are valid!", "weights");
              return;
            }
          }

          else{
            WEIGHT = null;
          }
          

          correctErr("weights");
          if (inputType == "num"){
            this.edgeLayout.push({
             "id": nodesToConnect[j]+"-"+nodesToConnect[j+1],
             "source": (nodesToConnect[0].charCodeAt(0) - aAscii).toString(),
             "target": (nodesToConnect[1].charCodeAt(0) - aAscii).toString(),
             "size" :5,
             "label" : WEIGHT,
             "type" : shape,
           });
          }
          else{
            this.edgeLayout.push({
             "id": nodesToConnect[j]+"-"+nodesToConnect[j+1],
             "source": this.find(nodesToConnect[j]).toString(),
             "target": this.find(nodesToConnect[j+1]).toString(),
             "size" :5,
             "label" : WEIGHT,
             "type" : shape,


           });
          }
          counter += 1;
        }
      }
      if(weight == 1){
        if (counter < this.weights.length){
           noticeErr("Please make sure if the weight number matches edge number!", "weights");
         }
         else{
           correctErr("weights");
         }
      }

    }

}


  createSigmaGraph(){
    $( ".graph" ).empty();
    let s = new sigma({
      graph: this.graph,
      renderer: {                                                        
        container: 'graphContainer',   
        type: 'canvas'                                                                                 
    },                
      settings: {
        defaultNodeColor: '#ec5148',
        enableCamera: false,
        autoRescale: false,
        defaultEdgeLabelSize: 15,

         }

    });
    this.sigma = s;
    this.enableDrag();


  }

  enableDrag(){
    var dragListener = sigma.plugins.dragNodes(this.sigma, this.sigma.renderers[0]);

    dragListener.bind('startdrag', function(event) {

    });
    dragListener.bind('drag', function(event) {

    });
    dragListener.bind('drop', function(event) {

    });
    dragListener.bind('dragend', function(event) {
 
    });
}


  setName(){
    for (var i = 0; i < this.nodes.length; i++){
         this.graph.nodes[i].label = this.nodes[i];

    }
  }


  setColor(){


  }

  find(name){
  
  for(var i =0; i < this.nodes.length; i++){
    if (name == (this.nodes[i].split(" ").join(""))){
      console.log(this.nodes[i]);
      return i;
    }
  }

  return -1;
}


}


///////////////////////////////////// kruskal algorithm below:

function createKGraph(ifEdge){
   var kgraph = new kruskalGraph(ifEdge);
   kGraph = kgraph;
}

function runKruskal(){
  kGraph.kruskal();
}

function stopAnime(){

}



class kruskalGraph extends sigmaGraph{

    constructor(ifEdge){
      super(ifEdge);
        this.nodeFindList = null;
        this.weightEdgeMap = null;
    }
    kruskal(){
      if(this.edges.length == 0){
        noticeErr("Please input edge first!","edges");
        return;
      }
      correctErr("edges");
      this.createFindList();
      this.createWeightEdgeMap();
      this.kruskalAlgo();


    }

    createFindList(){
      var nodeList = [];
      for(var i = 0; i < this.nodes.length; i++){
          nodeList.push(i);
      }
      this.nodeFindList = nodeList;

    }

    createWeightEdgeMap(){

      var weMap = new Map();
      for (var i = 0; i < this.weights.length; i++){
        try {
          var list = weMap.get(this.weights[i]);
          list.push(this.edges[i]);
          weMap.set(this.weights[i], list);
        }
        catch(error){
          weMap.set(this.weights[i],[this.edges[i]]);
        }

      }
      this.weightEdgeMap = weMap;

    }


/*async*/ kruskalAlgo(){
  var result = [];
  var sortedWeight = this.weights.sort();
  var aAscii = "a".charCodeAt(0);
  for(var i = 0; i < sortedWeight.length; i++)
  {
    var edges = this.weightEdgeMap.get(sortedWeight[i]);
    for(var j = 0; j < edges.length; j++){
      var node1 = (edges[j].split("-"))[0];
      var node2 = (edges[j].split("-"))[1];
      var node1Index = node1.charCodeAt(0)-aAscii;
      var node2Index = node2.charCodeAt(0)-aAscii

      if (this.nodeFindList[node1Index] != 
          this.nodeFindList[node2Index]){
        this.nodeFindList = this.unionFind(node1Index,node2Index);
        result.push(edges[j]);
      }
    }
  
  }
  console.log(result);
  for(var i = 1; i < this.nodeFindList.length; i++){
    var final = this.nodeFindList[0];
    if(this.nodeFindList[i] != final){
      noticeErr("Sorry this is an disconnected graph so no kruskal path!");
      break;
    }

  }

  //var result = await draw(result, time);
}

  unionFind(node1Index,node2Index){
    var list = this.nodeFindList;
    var afterVal = list[node1Index];
    var beforeVal = list[node2Index];
    for(var i = 0; i < list.length; i++){

      if(list[i] == beforeVal){
          list[i] = afterVal;
      }

    }
    return list;

  }


}





















