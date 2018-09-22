//test jest
function a(a, b) {
    return a + b;
}
module.exports = a;

function getHTML(id) {
  return document.getElementById(id);       // daisy
}                                

//formats inputs
function splitInput(input,space = false){
  if (space){
    return (input.split(" ").join("")).split(",");     //daisy
  }
  return input.split(",");
}

//graph.js
function letterNumConvert(key){
    if(Number.isInteger(key)){
      var aAlph = {
        0: "a", 1: "b", 2: "c", 3: "d", 4: "e", 5: "f", 6: "g", 7: "h",
        8: "i", 9: "j", 10: "k", 11: "l", 12: "m", 13: "n", 14: "o", 15: "p"}    // daisy
        return aAlph[key];

      }
    
    var aNum={
        a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, 
        l: 11, m: 12, n: 13,o: 14, p: 15
    }
    return aNum[key];
}
//check what is clicked
function check_and_Delay(){        //daisy
    if(getHTML('Fast').checked)        //returned fast button
    {
       return 300;   
    }
    else if(getHTML('Medium').checked)
    {
       return 800;
    }
    else
    {
       return 2000;
    }
    
}

function noticeErr(message,id="") {         //Yujia
  if(id!=""){
      getHTML(id).style.background="red";
   }
   alert(message);
}

function correctErr(id) {
    getHTML(id).style.background="#FCF5DB";
}


function drawListOnScreen(currentNumbersList) {                  //sort.js and hashTable.js
    canvas.clear();
    fList = window.createList(canvas, currentNumbersList);
}


function graphRefresh(){

  Graph.sigma.refresh();

}

function setWeight(){                 // Yujia
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
function setDir(){                                 //Yujia
    var choice = getHTML("graphType").selectedIndex;
    if(choice == 0){
      dir = 0;
    }
    else{
      dir = 1;
    }
}





function stopAnime() {               // Yujia
    animeRunning = false;
    }




function create_legend(title1, title2 , c1, c2) {   // Daisy
    const legend = {    
        "data": [{
                    "title": title1,
                    "color": c1,
                },
                {
                    "title": title2,
                    "color": c2,
                        },]
    };
    return legend;
}

function display_legend(id,title1, title2, c1= '#ffb380', c2 = '#99ccff') {
  var legend = create_legend(title1, title2, c1, c2);
  return getHTML(id).innerHTML =
  `<div class='list-group col-3'>
    <div class='list-group-item' style = background-color:${legend.data[0].color}>
    ${legend.data[0].title}
    </div>
    <div class='list-group-item' style = background-color:${legend.data[1].color}>
    ${legend.data[1].title}
    </div>
  </div>`;
}