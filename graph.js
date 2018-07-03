
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

function splitInput(input,space = false){
  if (space){
    return (input.split(" ").join("")).split(",");
  }
  return input.split(",");
  

}

function getHTML(id){
  return document.getElementById(id);
}

function letterNumConvert(key){
    if(Number.isInteger(key)){
      var aAlph = {
        0: "a", 1: "b", 2: "c", 3: "d", 4: "e", 5: "f", 6: "g", 7: "h",
        8: "i", 9: "j", 10: "k", 11: "l", 12: "m", 13: "n", 14: "o", 15: "p"}
        return aAlph[key];

      }
    
    var aNum={
        a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, 
        l: 11, m: 12, n: 13,o: 14, p: 15
    }
    return aNum[key];
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
  animeRunning = true;
  if(getHTML("kruskal").checked == true){
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
      this.setGraphEdges(ifEdge);



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

   

  setGraphEdges(ifEdge){

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
         return;
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
          return;
        }
      }

      else{
        WEIGHT = null;
      }
      
    



      correctErr("weights");

      if (inputType == "num"){


        this.edgeLayout.push({
         id: edgeList[i],
         source: letterNumConvert(nodesToConnect[0]).toString(),
         target: letterNumConvert(nodesToConnect[1]).toString(),
         size :5,
         label : WEIGHT,
         type: shape,
         color: '#ec5148',

       });



    
     

      }
      else{
        this.edgeLayout.push({
         id: edgeList[i],
         source: this.find(nodesToConnect[0]).toString(),
         target: this.find(nodesToConnect[1]).toString(),
         size :5,
         label : WEIGHT,
         type : shape,
         color: '#ec5148',


       });
      }

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
      try{
      pathEdges[i].color = "#000";
    }
    catch(error){
      path[i] = path[i][2] + path[i][1] + path[i][0];
      pathEdges[i]= this.sigma.graph.edges(path[i]);
      pathEdges[i].color = "#000";
    }
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
  var node1 = (edge.split("-"))[0];
  var node2 = (edge.split("-"))[1];
  var node1Index = letterNumConvert(node1);
  var node2Index = letterNumConvert(node2);
  return {
      n1: node1Index,
      n2: node2Index
  }
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


prim(){

   if(this.edges.length == 0){                                            
    noticeErr("Please input edge first!","edges");      // G.V != []
    return;
  }
  correctErr("edges");

  var list = []; 
  var path = [];
  var color = true;
  var connectionMap = this.findConnectionMap();


  for(var ind = 0; ind < this.nodes.length; ind++){

    var item ={
              v:this.nodes[ind], 
              key:Infinity,
              parent: null
            }

    list.push(item);


  }
 var r = list[0];
 r.key = 0;
 var minInd = 0;
 var size = list.length;

  while(size != 0){
    try{
    var adjU = connectionMap[letterNumConvert(list[minInd].v)];
    }
    catch(error){
       noticeErr("Sorry this is an disconnected graph so no Prim's path!");
      color = false
      break;

    }

    

    for(var i = 0; i < adjU.length; i++){


      var nodeIndex = letterNumConvert(adjU[i].connectedTo);
   
      if(!list[nodeIndex]){ 
    
         continue;
      }
 
      else{
       if(adjU[i].cost <  list[nodeIndex].key){
         list[nodeIndex].key = adjU[i].cost;
         list[nodeIndex].parent = list[minInd].v;
    
       }
     }
     
 }


 if(size != list.length){
      path.push(list[minInd].parent + "-" + list[minInd].v);
    }

    delete list[minInd];
    minInd = this.findMinIndex(list);
 
    size -= 1;


  }

console.log(path);
 if (color){
    this.color(path);
  }


} 






findMinIndex(list){       // for prim
   var min = Infinity;
   var ind = 0;
   for(var i = 0; i < list.length; i++){
    if(list[i] != null){
      if(parseInt(list[i].key) < min){
        min = list[i].key;
        ind = i;
      }
    }

}
return ind;
}





findConnectionMap(){

  var result = [];
      for(var j = 0; j < this.nodes.length; j++ ){
        result.push([]);
       }

 for(var i = 0; i < this.edges.length; i++ ){
      var nodesToConnect = this.edges[i].split("-");


   result[letterNumConvert(nodesToConnect[0])].push({
        connectedTo: nodesToConnect[1],
        cost: parseInt(this.weights[i]),
      });

      result[letterNumConvert(nodesToConnect[1])].push({
        connectedTo: nodesToConnect[0],
        cost: parseInt(this.weights[i]),
      });

   }

   return result;
}



}



