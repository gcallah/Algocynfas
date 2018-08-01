function setSpanningSample(){
  let selectedBox = getHTML("spanningSample");
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
  let selectedBox = getHTML("sampleChoice");
  selectedBox.selectedIndex = 0;
}

function clearSpanningGraph(){
   $( ".spanningGraphContainer" ).empty();
   getHTML("nodeNum").value = "";
   getHTML("edges").value = "";
   getHTML("weights").value = "";
   let selectedBox = getHTML("spanningSample");
  selectedBox.selectedIndex = 0;

}


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
