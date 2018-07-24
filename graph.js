const EdgeNodeCOLOR = '#0039e6' ;
const HIGHLIGHT = '#F5B041';
const RESULTCOLOR = '#FF5733';
const ErrorCOLOR = '#FF0000';

adjustPosition = false;

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

function createGraph(ifEdge){
   var graph = new ourGraph();
   graph.setGraph(ifEdge);
   Graph = graph;
}


function createTree(ifEdge){
   var graph = new tree();
   graph.setGraph(ifEdge);
   Graph = graph;
}

function createBST(type){
   if(type == 1){
     getHTML("graphContainer").style.height = 300;
     getHTML("graphContainer").style.width = 800;
     getHTML("graphContainer").style.marginLeft = "10em";
     var graph = new BST();
     if(getHTML("random").checked == true){
       var input = graph.random();
     }
     else{
      var input = splitInput(getHTML("treeList").value, true);
     }
      for(var i = 0; i < input.length; i++){
        graph.insert(parseInt(input[i]));
   }
     Graph = graph;  
   }
   else{
     var input = parseInt(getHTML("treeNode").value);
     if(!Graph){
      var graph = new BST();
     }
     else{
         $( ".graph" ).empty();
         var graph = Graph;
        
      }
      graph.insert(input,true);
      Graph = graph;

   }
}

function bstCheck(){
  if(!Graph){
    noticeErr("The tree is empty!");
    return;
  }
   $( ".graph" ).empty();

   Graph.createSigmaGraph(false);
}

function searchInTree(){
  bstCheck();
  var input = parseInt(getHTML("searchBox").value);
   if(Number.isInteger(input)){
      correctErr("searchBox");
      Graph.search(input);
      return;
   }
    noticeErr("Please input a valid integer", "searchBox");

}

function findMinMax(){
  bstCheck();
  Graph.minMax();

}

function findPreSuc(){
  bstCheck();
  Graph.preSuc();

}

function PreInPost(){
  bstCheck();
  Graph.traversal();

  
}

function deleteNode(){
  bstCheck();
  Graph.delete();
}


//////////wrapper class implementation

class ourGraph{

    constructor(){
      this.sigma = null;
      this.graph = null;
      this.edgeLayout = [];
      this.nodes = [];
      this.edges = [];
      this.weights = null;
      this.nodeSet = null;
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
         color: EdgeNodeCOLOR ,
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
         color: EdgeNodeCOLOR ,
       });
      }
    }

  createSigmaGraph(drag = true){
    $( ".graph" ).empty();
    let s = new sigma({
      graph: this.graph,
      renderer: {                                                        
        container: 'graphContainer',  
        type: 'canvas'                                                                                 
    },                
      settings: {
        defaultNodeColor: EdgeNodeCOLOR,
        enableCamera: false,
        autoRescale: false,
        defaultEdgeLabelSize: 15,
      
        }
    });

    this.sigma = s;
    if(drag){
    this.enableDrag();
    }
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


async color(path, nodes = null, theColor = HIGHLIGHT, pause = true){
  var pathEdges = this.sigma.graph.edges(path); 
  if (nodes){
    var pathNodes = this.sigma.graph.nodes(nodes); 
  }
  for(var i = 0; i < pathEdges.length; i++){
    if(animeRunning){
      try{
        if(nodes){
          pathNodes[i].color = theColor;
          Graph = this;
          graphRefresh();
         if(pause){
           await this.pause();
          }
        } 
        pathEdges[i].color = theColor;
      }
      catch(error){

        var str = path[i];
        str = str.split("-");
        path[i] = str[1] + "-" + str[0];

        pathEdges[i]= this.sigma.graph.edges(path[i]);
        pathEdges[i].color = theColor;
      }
      Graph = this;
      graphRefresh();
      if(pause){
        await this.pause();
      }
    }
    else{
      break;
    }
  }
  if(nodes){
        pathNodes[pathNodes.length-1].color = theColor;
        Graph = this;
        graphRefresh();
        await this.pause();
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

  constructor(){
    super();
  
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
       this.color(circledSet[i], null, ErrorCOLOR,false);
    }
    return result;
  }
}


class BST extends ourGraph{

    constructor(){
      super();
      this.root = null;
      this.nodeLayout = [];
      this.treeNodes = [];
      this.horiAdjust = false;
      this.vertiAdjust = false;
      this.position = true;
      
    }
    adjustPos(dir, node){


       if (dir == "left"){
        node.layout.x -= 30;
        node.position.x -= 30;
      }
      else{
        node.layout.x += 30;
        node.position.x += 30;
      }

       if(node.position.x >= 550 || node.position.x <= -550){
      
       if(this.position){
        noticeErr("Sorry the graph is too big to fit in the container, try randomize!");
        this.position = false;
       }

     }
    

    if(node.left){
      this.adjustPos(dir, node.left);
    }
    if(node.right){
      this.adjustPos(dir, node.right);
    }
  }

  strench(adjustList){
    for(var i = 0; i < adjustList.length; i++){
      adjustList[i].strenchTimes += 1;
      this.adjustPos(adjustList[i].sideToParent, adjustList[i]);
    }
  } 
   positionCheck(node){


     if(Math.abs(node.position.x) > 200 && this.horiAdjust == false){
       getHTML("graphContainer").style.width = 1200;
       getHTML("graphContainer").style.marginLeft = "5em";
       getHTML("legend").style.marginLeft = "5em";
      this.horiAdjust = true;
    }
    if(Math.abs(node.position.y) > 130 && this.vertiAdjust == false){
     getHTML("graphContainer").style.height = 800;
     for(var k = 0; k < this.nodeLayout.length; k++){
        this.treeNodes[k].position.y -= 150;
        this.treeNodes[k].layout.y -= 150;
     }
     this.vertiAdjust = true;

   } 
 }
   async insert(input,single = false){
      if(Number.isInteger(input)){
         correctErr("treeNode");
         correctErr("treeList");
         this.createSigmaGraph(false);
         await this.pause();
         var node = new treeNode(input, this.treeNodes.length);
         var result = treeInsert(this.root, node);   // the binary insert algorithm, in binarySTree.js
         this.root = result.root;
         node = result.node;
         var adjustList = result.adj;
         var hlNodeId = result.hlNodeId;

         node.setNode();
         if(this.treeNodes.length > 1 && adjustList.length != 0){
            this.strench(adjustList);
          }              
         this.treeNodes.push(node);
         this.nodeLayout.push(node.layout);

         this.positionCheck(node);
    

         if(this.treeNodes.length > 1){
          this.connectParentChild(node); 
          if(single){
            await this.highLight(hlNodeId); 
          }   
         }
         let g = {
          nodes: this.nodeLayout,
          edges: this.edgeLayout,
         }; 
        this.graph = g;
        this.createSigmaGraph(false);

        return;  
      }

        if(single){
          var errorBox = "treeNode";
        }
        else{
          var errorBox = "treeList";
        }
        noticeErr("Please input a valid integer", errorBox);
   }


   search(input){
      var result = treeSearch(this.root, input);     // the binary search algorithm, in binarySTree.js
          if(result){
            this.highLight(result.path);
          }
   }


  async minMax(){    
      var index = getHTML("minMaxChoice").selectedIndex;
      if(index == 0){
        var result = treeMin(this.root);     // the binary search algorithm, in binarySTree.js
        await this.highLight(result.HLNodeId);
        var returnValue = "The minimum is " + result.min.key;
        alert(returnValue);
      }
      else{
       var result = treeMax(this.root);     // the binary search algorithm, in binarySTree.js
       await this.highLight(result.HLNodeId);
       var returnValue = "The maximum is " + result.max.key;
       alert(returnValue);
      }
      return;
    }



   async preSuc(){
      var input = parseInt(getHTML("preSucBox").value);
      if(Number.isInteger(input)){
        var searched = treeSearch(this.root, input);

        if(searched){
          var node = searched.node;
          var index = getHTML("preSucChoice").selectedIndex;

          if(index == 0){
            var result = treePredecessor(node);     // the binary search algorithm, in binarySTree.js
            await this.highLight(result.HLNodeId);
              var returnValue = "The predecessor is " + result.pre;
              alert(returnValue);   
          }
          else{
           var result = treeSuccessor(node);     // the binary search algorithm, in binarySTree.js
           await this.highLight(result.HLNodeId);

              var returnValue = "The successor is " + result.suc;
              alert(returnValue);
          }
          return;
        }
        return;
    }
    noticeErr("Please give a valid input!", "preSucBox");

   }
  
  traversal(){
      var index = getHTML("treeWalkChoice").selectedIndex;
       if(index == 0){
         var result = preorderTreeWalk(this.root);     // the binary search algorithm, in binarySTree.js
         
      }
      else if (index == 1) {
        var result = inorderTreeWalk(this.root);     // the binary search algorithm, in binarySTree.js
        
      }
      else{
        var result = postorderTreeWalk(this.root);     // the binary search algorithm, in binarySTree.js
      }

      this.highLight(result.node,result.edge);
  }
     
   async delete(){
    var input = parseInt(getHTML("deleteBox").value);
      if(Number.isInteger(input)){
        correctErr("deleteBox");
        var searched = treeSearch(this.root, input);
        if(searched){
          await this.highLight(searched.path);
          var node = searched.node;
          var result = treeDelete(this.root,node,this.treeNodes);
          this.root = result.root;
          if(result.path.length != 0){
            result.path.unshift(node.id);
            await this.highLight(result.path);
          }
          this.treeNodes = result.newTreeNodes;
          this.treeNodes[node.id] = null;
          this.nodeLayout = [];
          this.edgeLayout = [];
          for(var i = 0; i < this.treeNodes.length; i++){
            if(this.treeNodes[i]){
              this.nodeLayout.push(this.treeNodes[i].layout);
              if(this.treeNodes[i].leftEdge){
                this.edgeLayout.push(this.treeNodes[i].leftEdge);
              }
              if(this.treeNodes[i].rightEdge){
                this.edgeLayout.push(this.treeNodes[i].rightEdge);
              }
            }
          }
        let g = {
          nodes: this.nodeLayout,
          edges: this.edgeLayout,
         }; 
        this.graph = g;
        this.createSigmaGraph();
         return;
        }
        return; 
    }
    noticeErr("Please give a valid input!", "deleteBox");

   }

    connectParentChild(node){
    if (!node.parent){
      return;
    }
    var edgeId = (node.parent.id).toString()+ "-" + (node.id).toString();
    var newEdge = {
         id: edgeId,
         source: (node.parent.id).toString(),
         target: (node.id).toString(),
         size :5,
         label : null,
         color: EdgeNodeCOLOR,
       }
    this.edgeLayout.push(newEdge);
    if(node.sideToParent == "left"){
      node.parent.leftEdge = newEdge;
    }
    else{
      node.parent.rightEdge = newEdge;
    }
  }

    random(){
    var input = getHTML("treeList").value;
    input = splitInput(input, true);
    var result = [];
    while(input.length != 0){
      var index = Math.floor(Math.random() * input.length);
      var temp = input[input.length-1];
      input[input.length-1] = input[index];
      input[index] = temp;
      result.push(input.pop());
    }
    var returnValue = result;
    result.join();
    getHTML("treeList").value = result;
    return returnValue;
  }

  async highLight(HLNodeLst, HLEdgeList = null){
     if(HLNodeLst.length != 0){
       if(!HLEdgeList){
         var HLEdgeList = [];
         //create edgeId list:

         for(var i = 0; i < HLNodeLst.length-1; i++){
             var edgeId = HLNodeLst[i].toString() + "-" + HLNodeLst[i+1].toString();
             HLEdgeList.push(edgeId);
         }
        }
      await this.color(HLEdgeList, HLNodeLst);
    }
  }
}

class treeNode{

  constructor(num, counter){
    this.key = num;
    this.id = counter;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.layout = null;
    this.position = null;
    this.sideToParent = null;
    this.leftEdge = null;
    this.rightEdge = null;
    this.strenchTimes = 0;

  }
  setNode(){
    if(!this.parent){
      this.layout = {
      "id": this.id.toString(),
      "label": this.key.toString(),
      "x": 0,
      "y": -100,
      "size": 12,
      "color": EdgeNodeCOLOR,
    }; 
    this.position = {
      x: 0,
      y: -100,
    };

    }
    else{
      if (this.sideToParent == "left"){
        this.position = {
          x: this.parent.position.x - 30,
          y: this.parent.position.y + 30,
        }
      }
      else{
        this.position = {
          x: this.parent.position.x + 30,
          y: this.parent.position.y + 30,
        }
      }
      this.layout = {
      "id": this.id.toString(),
      "label": this.key.toString(),
      "x": this.position.x,
      "y": this.position.y,
      "size": 12, 
      "color" : EdgeNodeCOLOR,
     }
   }

  }

}

