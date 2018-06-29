
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

function clearEdges(){
  if(document.getElementById("nodeNum").value == ""){

    noticeErr("Please still keep a valid node input!","nodeNum");
    return;
  }
  for(var i =0; i<Graph.edges.length; i++){
    Graph.sigma.graph.dropEdge(Graph.edges[i]);


  }
  graphRefresh();
  document.getElementById("edges").value = "";
  document.getElementById("weights").value = "";
}

function clearGraph(){
   $( ".graph" ).empty();
   document.getElementById("nodeNum").value = "";
   document.getElementById("edges").value = "";
   document.getElementById("weights").value = "";


}
/*function clearEdges(){
   console.log(document.getElementById("nodeNum").value);
  if(document.getElementById("nodeNum").value == ""){

    noticeErr("Please still keep a valid node input!","nodeNum");
    return;
  }
  correctErr("nodeNum");
  createGraph(false);
  document.getElementById("edges").value = null;
  document.getElementById("weights").value = null;

}*/


function createGraph(ifEdge){
   var graph = new ourGraph(ifEdge);
   Graph = graph;
}




///////////////////////////////////// kruskal algorithm function below:


function run(){
  animeRunning = true;
  if(document.getElementById("kruskal").checked == true){
    Graph.kruskal();
    return;
  }
  Graph.prim();
}



function stopAnime(){

  animeRunning = false;

}


function graphRefresh(){

  Graph.sigma.refresh();

}


//////////wrapper class implementation

class ourGraph{

    constructor(ifEdge){
      this.sigma = null;
      this.graph = null;
      this.edgeLayout = [];
      this.nodes = [];
// can we make a map from edges to nodes here so that we can do simple
// lookups?
      this.edges = [];
      this.weights = null;
      this.nodeSet = null;
      this.setGraph(ifEdge);

     //only for weighted graph
      this.weightEdgeMap = null;
    
  
    
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
    if(inputNum == 0){
      return;
    }


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
             id: nodesToConnect[j]+"-"+nodesToConnect[j+1],
             source: (nodesToConnect[0].charCodeAt(0) - aAscii).toString(),
             target: (nodesToConnect[1].charCodeAt(0) - aAscii).toString(),
             size :5,
             label : WEIGHT,
             type: shape,
             color: '#ec5148',
           
           });
          }
          else{
            this.edgeLayout.push({
             id: nodesToConnect[j]+"-"+nodesToConnect[j+1],
             source: this.find(nodesToConnect[j]).toString(),
             target: this.find(nodesToConnect[j+1]).toString(),
             size :5,
             label : WEIGHT,
             type : shape,
             color: '#ec5148',


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


 

  find(name){
  
  for(var i =0; i < this.nodes.length; i++){
    if (name == (this.nodes[i].split(" ").join(""))){
      console.log(this.nodes[i]);
      return i;
    }
  }

  return -1;
}

 makeSets() {
      var nodeList = [];
      for(var i = 0; i < this.nodes.length; i++){
          nodeList.push(i);
      }
      this.nodeSet = nodeList;

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

    unionFind(node1Index,node2Index){
    var list = this.nodeSet;
    var afterVal = list[node1Index];
    var beforeVal = list[node2Index];
    for(var i = 0; i < list.length; i++){

      if(list[i] == beforeVal){
          list[i] = afterVal;
      }

    }
    return list;

  }

   async color(path){
    var pathEdges = this.sigma.graph.edges(path);
    for(var i = 0; i < pathEdges.length; i++){
      if(animeRunning){
      pathEdges[i].color = "#000";
       Graph= this;
       graphRefresh();
       await this.pause();
     }
     else{
      break;
     }
    
    }

  }

 async pause () { 

      var times = document.getElementsByName("speed");
      console.log(times[0].checked);
      var time = 1000;
      if(times[0].checked == true){
        time = 300;
      }
      else if(times[2].checked == true){
        time = 2000;
      }
      
      return new Promise(function (resolve) {
        setTimeout(resolve, time)
      })
  }


getNodes(edge) {
  var aAscii = "a".charCodeAt(0);
  var node1 = (edge.split("-"))[0];
  var node2 = (edge.split("-"))[1];
  var node1Index = node1.charCodeAt(0)-aAscii;
  var node2Index = node2.charCodeAt(0)-aAscii
  return {
      n1: node1Index,
      n2: node2Index
  }
}

/// kruskal

kruskal(){                                              //refer to CLRS P631 Kruskal's Algorithm
  if(this.edges.length == 0){                                            
    noticeErr("Please input edge first!","edges");      // A != []
    return;
  }
  correctErr("edges");
  this.createWeightEdgeMap();
  var path = [];


  this.makeSets();                                                           //MAKE-SET(v)
  var sortedWeight = this.weights.sort(function(a,b){return a-b});          // sort the edges of G.E into nondecreasing order by weight w
  for(var i = 0; i < sortedWeight.length; i++)                        
  {                                                           // // for each edge (u,v) in G.E, taken in nondecreasing order by weight
    var edges = this.weightEdgeMap.get(sortedWeight[i]);      // (Achieved by mapping weights to the edges in the method createWeightEdgeMap())
    for(var j = 0; j < edges.length; j++){
        var nodes = this.getNodes(edges[j])

      if (this.nodeSet[nodes.n1] !=                             // if FIND-SET(u)!= FIND-SET(v)
        this.nodeSet[nodes.n2]){
        path.push(edges[j]);                                      // A = A U {(u,v)}
        this.nodeSet = this.unionFind(nodes.n1, nodes.n2);     // Union (u,v)
          
    }
  }
  
}


  var color = true;
  for(var i = 1; i < this.nodeSet.length; i++){
    var final = this.nodeSet[0];
    if(this.nodeSet[i] != final){
      noticeErr("Sorry this is an disconnected graph so no kruskal's path!");
      color = false
      break;
    }

  }
  if (color){
    this.color(path);
  }


}

// prim

prim(){

}

  


}

