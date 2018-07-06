function typeChange(){
    var choice = getHTML("choices").selectedIndex;
    var inputBox = getHTML("nodeNum");
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

function setSample(){
  let selectedBox = getHTML("sampleChoice");
  var sampleSelected = selectedBox.selectedIndex;

  if (sampleSelected == 0){
        clearGraph();
    }

    if (sampleSelected == 1){
         $( ".graph" ).empty();
        getHTML("nodeNum").value = "5";
        getHTML("edges").value = "a-b,b-c,c-d,d-e,a-e,b-e,a-c,a-d";
        getHTML("weights").value = "1,2,3,4,5,6,7,8";
    }

    else if (sampleSelected == 2){
         $( ".graph" ).empty();
        getHTML("nodeNum").value = "10";
        getHTML("edges").value = "d-e,a-d,a-c,e-i,e-g,f-i,f-j,c-i,h-b,b-g,b-a,e-h,d-c,c-e,g-h,g-j";
        getHTML("weights").value = "2,6,4,7,2,8,1,11,9,2,4,3,12,5,6,1";
    }

    else if (sampleSelected == 3){
         $( ".graph" ).empty();
        getHTML("nodeNum").value = "11";
        getHTML("edges").value = "a-b,b-e,e-i,b-i,h-i,e-h,c-d,d-g,g-k,j-k,f-j,c-f,c-j";
        getHTML("weights").value = "1,5,7,2,4,2,2,11,14,8,9,21,10";
    }
}
function setWeight(){
   var choice = getHTML("graphWeight").selectedIndex;
   var wBox = getHTML("weights");
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
    var choice = getHTML("graphType").selectedIndex;
    if(choice == 0){
      dir = 0;
    }
    else{
      dir = 1;
    }
}


function clearEdges(){
  if(getHTML("nodeNum").value == ""){

    noticeErr("Please still keep a valid node input!","nodeNum");
    return;
  }
  for(var i =0; i<Graph.edges.length; i++){
    Graph.sigma.graph.dropEdge(Graph.edges[i]);

  }
  graphRefresh();
  getHTML("edges").value = "";
  getHTML("weights").value = "";
}

function clearGraph(){
   $( ".graph" ).empty();
   getHTML("nodeNum").value = "";
   getHTML("edges").value = "";
   getHTML("weights").value = "";

}
/*function clearEdges(){
   console.log(getHTML("nodeNum").value);
  if(getHTML("nodeNum").value == ""){

    noticeErr("Please still keep a valid node input!","nodeNum");
    return;
  }
  correctErr("nodeNum");
  createGraph(false);
  getHTML("edges").value = null;
  getHTML("weights").value = null;

}*/


function createGraph(ifEdge){
   var graph = new ourGraph(ifEdge);
   Graph = graph;
}




///////////////////////////////////// kruskal algorithm function below:


function run(){
  if(Graph == null){
    noticeErr("No graph created!");
  }

  else{
  animeRunning = true;
  if(getHTML("kruskal").checked == true){
    Graph.kruskal();
    return;
  }
  Graph.prim();
}

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

     var rawInput = getHTML("nodeNum").value;

     if (inputType == "num"){
      var inputNum = parseInt(rawInput);
    }
    else{
      var nameList = splitInput(rawInput);
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

      if(inputType == "num"){
        var defaultList = [];
        var counter = 0;

        while (counter != inputNum){
          var elem = letterNumConvert(counter)
          defaultList.push(elem);
          counter += 1;
        }
        this.nodes = defaultList;
      
      }

      var nodeLayout = sixteenArrange[inputNum];
      this.edgeCheck(ifEdge);

      let g = {
        nodes: nodeLayout,
        edges: this.edgeLayout,
      }; 

      this.graph = g;

      if(inputType == "name"){
    
        this.setName();
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

  edgeCheck(ifEdge){

    if(ifEdge == true){
      var edgeList = splitInput(getHTML('edges').value, true);
      this.edges = edgeList;
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
         return ;
       }
       correctErr("edges");


       if (weight == 1){
        var listWeight =  splitInput((getHTML('weights').value), true);
        this.weights = listWeight;
        var WEIGHT = parseInt(listWeight[counter]);
        if (Number.isInteger(WEIGHT) && WEIGHT >= 0){
          correctErr("weights");
          WEIGHT = WEIGHT.toString();
        }
        else{
          noticeErr("Please make sure the weight input and the number of weight inputs are valid!", "weights");
          return ;
        }
      }
      else{
        WEIGHT = null;
      }
      
      correctErr("weights");
      this.setGraphEdges(edgeList[i], nodesToConnect, WEIGHT,shape);
     
       counter += 1;
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

  setGraphEdges(edge,nodesToConnect,WEIGHT,shape){
     
      if (inputType == "num"){
        this.edgeLayout.push({
         id: edge,
         source: letterNumConvert(nodesToConnect[0]).toString(),
         target: letterNumConvert(nodesToConnect[1]).toString(),
         size :5,
         label : WEIGHT,
         type: shape,
         color: '#0039e6',
       });
      }
      else{
        this.edgeLayout.push({
         id: edge,
         source: this.find(nodesToConnect[0]).toString(),
         target: this.find(nodesToConnect[1]).toString(),
         size :5,
         label : WEIGHT,
         type : shape,
         color: '#0039e6',
       });
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
        defaultNodeColor: '#0039e6',
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

getNodes(edge) {
  var node1 = (edge.split("-"))[0];
  var node2 = (edge.split("-"))[1];
  var node1Index = letterNumConvert(node1);
  var node2Index = letterNumConvert(node2);
  return {
    n1: node1Index,
    n2: node2Index
  }
}


findMinIndex(Q){       // for prim
 var min = Infinity;
 var ind = 0;
 for(var i = 0; i < Q.length; i++){
  if(Q[i] != null){
    if(parseInt(Q[i].key) < min){
      min = Q[i].key;
      ind = i;
    }
  }

}
return ind;
}


findConnectionMap(){

  var connectionMap = [];
  for(var j = 0; j < this.nodes.length; j++ ){
    connectionMap.push([]);
  }

  for(var i = 0; i < this.edges.length; i++ ){
    var nodesToConnect = this.edges[i].split("-");


    connectionMap[letterNumConvert(nodesToConnect[0])].push({
      connectedTo: nodesToConnect[1],
      cost: parseInt(this.weights[i]),
    });

    connectionMap[letterNumConvert(nodesToConnect[1])].push({
      connectedTo: nodesToConnect[0],
      cost: parseInt(this.weights[i]),
    });

  }

  return connectionMap;
}


async color(path, theColor = '#000', pause = true){
  var pathEdges = this.sigma.graph.edges(path);
  for(var i = 0; i < pathEdges.length; i++){
    if(animeRunning){
      try{
        pathEdges[i].color = theColor;
      }
      catch(error){
        path[i] = path[i][2] + path[i][1] + path[i][0];
        pathEdges[i]= this.sigma.graph.edges(path[i]);
        pathEdges[i].color = theColor;
      }
      Graph= this;
      graphRefresh();
      if(pause){
        await this.pause();
      }
    }
    else{
      break;
    }
  }
}

async pause () { 

  var time = check_and_Delay();

  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

/// kruskal

kruskal(){              
                                 //refer to CLRS P631 Kruskal's Algorithm
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

prim(){                                                // Refer to CLRS P634's prim's algorithm
var path = [];
var color = true;
var connectionMap = this.findConnectionMap();
if(this.edges.length == 0){                                            
      noticeErr("Please input edge first!","edges");      // G.V != []
      return;
    }
    correctErr("edges");
  var Q = [];                                       // Note: In this algorithm, an array is used instead of a minimum piority queue
  for(var ind = 0; ind < this.nodes.length; ind++){ // for each u in G.V

    var u ={
      vertex:this.nodes[ind], 
              key:Infinity,                     // u.key = infinity
              parent: null,                     // u.p = NIL
            }

            Q.push(u);
          }
   var r = Q[0];                           //(Choose the first of the list as root)
   r.key = 0;                                 // r.key = 0;
   var minInd = 0;
   var size = Q.length;

  while(size != 0){                                                //while Q != []
    var u = Q[minInd];                                              // u = Extract - min(Q)             
    try{
      var adjU = connectionMap[letterNumConvert(u.vertex)];                 
    }
    catch(error){
     noticeErr("Sorry this is an disconnected graph so no Prim's path!");
     color = false;
     break;
   }
    for(var i = 0; i < adjU.length; i++){                          //for each v in G.adj[u];
      var nodeIndex = letterNumConvert(adjU[i].connectedTo);
       if(Q[nodeIndex] && adjU[i].cost < Q[nodeIndex].key){     // if v in Q.V and w(u,v) < v.key
         Q[nodeIndex].parent = u.vertex;                         // v.p = u
         Q[nodeIndex].key = adjU[i].cost;                        // v.key = w(u,v)

       }

     }
     if(size != Q.length){
      path.push(u.parent + "-" + u.vertex);
    }

    delete Q[minInd];
    minInd = this.findMinIndex(Q);

    size -= 1;
  }

  if (color){
    this.color(path);
  }
} 

}


class tree extends ourGraph{

  constructor(ifEdge){
    super(ifEdge);
  
  }

  setGraph(ifEdge){
    super.setGraph(ifEdge);

    if(this.edges.length != 0){
    var result = this.isTree();
    
    if(result == "true"){
      correctErr("edges")
      return;    
    }

    else if(result == "cir"){ 
      noticeErr("A tree cannot has circles!", "edges");
    }

    else if(result == "disconnected"){ 
      noticeErr("A tree cannot be disconnected!","edges");
    }

    else{
      noticeErr("A tree cannot be disconnected or contains circle!","edges");
    }


  }

  }
  
  isTree(){

    var result = "true";
    var circledge = [];
    var circledSet = [];
    this.makeSets();
    for(var i = 0; i < this.edges.length; i++){
      var nodes = this.getNodes(this.edges[i]);
      console.log(nodes);
      if (this.nodeSet[nodes.n1] != this.nodeSet[nodes.n2]){
        var list = this.nodeSet;
        var afterVal = list[nodes.n1];
        var beforeVal = list[nodes.n2];
        for(var j = 0; j < list.length; j++){
          if(list[j] == beforeVal){
            list[j] = afterVal;
          }
        }
      }
      else{
        result =  "cir";
        circledge.push(this.edges[i]);
        circledSet.push(circledge);
        circledge = [];
      }
      circledge.push(this.edges[i]);
    }
    
    
      var final = this.nodeSet[0];
    for(var i = 1; i < this.nodeSet.length; i++){
   
      if(this.nodeSet[i] != final){
        if(result == "cir"){
          result += "disconnected";
        }
        else{
          result = "disconnected";
        }
        break;
      }
    }

    for(var i = 0; i < circledSet.length; i++){
       this.color(circledSet[i], '#FF0000',false);
    }
    return result;
  }
}

function createTree(ifEdge){
   var graph = new tree(ifEdge);
   Graph = graph;
}



