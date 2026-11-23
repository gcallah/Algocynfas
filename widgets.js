
// logic layer (need to be tested)
function splitInput(input,space = false){
  if (space){
    return (input.split(" ").join("")).split(",");     
  }
  return input.split(",");
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


  function create_legend(title1, title2 , c1, c2) {   
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

  function stopAnime() {               
    animeRunning = false;
  }



// display layer


  function getHTML(id) {
    return document.getElementById(id);       
  }                                

  function check_and_Delay(){       
    if(getHTML('Fast').checked)        
    {
     
     return getHTML('Fast').value;   
   }
   else if(getHTML('Medium').checked)
   {
     return getHTML('Medium').value;
   }
   else
   {
     return getHTML('Slow').value;
   }

 }

 function noticeErr(message,id="") {         
  if(id!=""){
    getHTML(id).style.background="red";
  }
  alert(message);
}

function correctErr(id) {
  getHTML(id).style.background="";
}


function drawListOnScreen(currentNumbersList) {                 
  canvas.clear();
  fList = window.createList(canvas, currentNumbersList);
}


function graphRefresh(){

  Graph.sigma.refresh();

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



// The two-entry legend used by the older pages; drawn the same way as
// display_legend_list.
function display_legend(id, title1, title2, c1 = '#cbb8ea', c2 = '#a6dfe8') {
  return display_legend_list(id, [[title1, c1], [title2, c2]]);
}


// A legend with any number of entries: items is a list of [title, colour] pairs.
function display_legend_list(id, items) {
  // White text on dark swatches, dark text on light ones.
  var textFor = (hex) => {
    var [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b < 150 ? '#fff' : '#1c2833';
  };
  var rows = items.map(([title, color]) =>
    `<div class='list-group-item' style='background-color:${color}; color:${textFor(color)}'>${title}</div>`);
  return getHTML(id).innerHTML =
    `<div class='list-group legend-list'>${rows.join('')}</div>`;
}

// Read a comma/space separated list of integers between lo and hi.
// Returns the list, or null (after telling the user) if the input is bad.
function parseIntList(text, lo, hi, maxLen) {
  var parts = text.split(/[\s,]+/).filter((s) => s !== '');
  if (parts.length < 1) {
    noticeErr("Please enter some numbers separated by commas.");
    return null;
  }
  if (parts.length > maxLen) {
    noticeErr("Please enter at most " + maxLen + " numbers.");
    return null;
  }
  var nums = [];
  for (var i = 0; i < parts.length; i++) {
    if (!/^-?\d+$/.test(parts[i]) || parseInt(parts[i]) < lo || parseInt(parts[i]) > hi) {
      noticeErr("\"" + parts[i] + "\" is not an integer between " + lo + " and " + hi + ".");
      return null;
    }
    nums.push(parseInt(parts[i]));
  }
  return nums;
}

// Show a line of explanation under the controls while an algorithm runs.
function setStatus(text, id = "status") {
  var el = getHTML(id);
  if (el) el.textContent = text;
}


// testing part (logic layer)

// For the Jest tests in __tests__; browsers have no module object.
if (typeof module !== "undefined") module.exports = {
  func1: function letterNumConvert(key){
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
    },

    func2: function create_legend(title1, title2 , c1, c2) {   
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
    },

    func3: function splitInput(input,space = false){
      if (space){
        return (input.split(" ").join("")).split(",");    
      }
      return input.split(",");
    },


  };




