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

function createNodes(){

  rawInput = document.getElementById("nodeNum").value;

// first determine how nodes are named:
  if (inputType == "num"){
    var inputNum = parseInt(rawInput);
  }
  else{
    var nameList = rawInput.split(",");
    var inputNum = nameList.length;
  }

  if(inputNum > 0 && inputNum < 17)
  {
    correctErr("nodeNum");  // undo any error display
    var nodeLayout = sixteenArrange[inputNum];  // get correct arrangement
    g = {
      nodes: nodeLayout,
      edges: [],
    }; 

    if(inputType == "name"){
      for (var i = 0; i < nameList.length; i++){
        g.nodes[i].label = nameList[i];
      }
      nodeList = rawInput;

    }

    createGraph();

  }
  else{
    noticeErr("Please give a valid input!", "nodeNum");

  }

}


function createEdges(){
  var prepare = ((document.getElementById('edges').value).split(" ")).join("");
  var edgeList = prepare.split(",");
  var e = [];
  var aAscii = "a".charCodeAt(0);
  var counter = 0;  
  var WEIGHT = null;
  var listWeight =  (((document.getElementById('weights').value).split(" ")).join("")).split(",");
  if(dir == 1){
    var shape = "arrow";
  }
  else{
    var shape = "line";
  }

  for(var i = 0; i < edgeList.length; i++ ){
   var nodesToConnect = edgeList[i].split("-");
   for(var j = 0; j < nodesToConnect.length - 1; j++){
    if (weight != 0){
      
        WEIGHT = parseInt(listWeight[counter]);
        if (Number.isInteger(WEIGHT)){
          correctErr("weights");
          WEIGHT = WEIGHT.toString();
        }
        else{

          noticeErr("Please enter valid weights!", "weights");
          return;
        }
    }

    correctErr("weights");
    if (inputType == "num"){
      e.push({
       "id": nodesToConnect[j]+"-"+nodesToConnect[j+1],
       "source": (nodesToConnect[j].charCodeAt(0) - aAscii).toString(),
       "target": (nodesToConnect[j+1].charCodeAt(0) - aAscii).toString(),
       "size" :5,
       "label" : WEIGHT,
       "type" : shape,
     });
    }
    else{
      e.push({
       "id": nodesToConnect[j]+"-"+nodesToConnect[j+1],
       "source": find(nodesToConnect[j]).toString(),
       "target": find(nodesToConnect[j+1]).toString(),
       "size" :5,
       "label" : WEIGHT,
       "type" : shape,
     });
    }
    counter += 1;
  }
}

  g.edges= e;
  try{
    createGraph();
    correctErr("edges");
    if (counter < listWeight.length){
     noticeErr("Please make sure if the weight number matches edge number!", "weights");
   }
   else{
     correctErr("weights");
   }
  }
  catch(error){
    noticeErr("Please make sure if the nodes existed and if the weight!", "edges");
  }
}


function find(name){
  var prepare = (nodeList.split(" ")).join("");
  var List = prepare.split(",");
  for(var i =0; i < List.length; i++){
    if (name == List[i]){
      return i;
    }
  }

  return -1;
}

function createGraph(){
  $( ".graph" ).empty();
   s = new sigma({

      graph: g,
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
    enableDrag();
}
 
function enableDrag()
{
    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

    dragListener.bind('startdrag', function(event) {

    });
    dragListener.bind('drag', function(event) {

    });
    dragListener.bind('drop', function(event) {

    });
    dragListener.bind('dragend', function(event) {
 
    });
}


