function check_and_Delay(){
    if(document.getElementById('Fast').checked)
    {
       document.getElementById('Fast').checked = false;
       return 100;
    }
    else if(document.getElementById('Medium').checked)
    {
       return 500;
    }
    else
    {
       document.getElementById('Slow').checked = false;
       return 1000;
    }
    
}

function drawListOnScreen(currentNumbersList) {
    canvas.clear();
    fList = window.createList(canvas, currentNumbersList);
}

function stopAnime() {
    animeRunning = false;
    }


function inputNumberToArray() {
    clearNumberGroup();
    list=[]
    canvas.clear();
    let an_input = document.getElementById("number-input").value;
    var list_num = an_input.split(",");
    if(list_num.length == 0 || list_num.length == 1){
      alert("Please enter a valid list without '[]' "); 
      document.getElementById("number-input").value = "";
      return;
    } 
    var all_valid = true;
    for (var i = 0; i<list_num.length; i++) {
      list_num[i]=parseInt(list_num[i]);
      if (!Number.isInteger(list_num[i]) ||list_num[i] < -99 || list_num[i] > 99 ){
           all_valid= false;
           alert("The element on index " + i + " is not valid "); 
      }
    }
    if(all_valid){
      document.getElementById("number-input").value = "";
      for(var i=0;i<list_num.length;i++){
        numberGroupTemplate = document.getElementsByClassName("number-group")[0].cloneNode(true);
        numberGroupTemplate.childNodes[1].innerText = list_num[i];
        numberGroupTemplate.style.display = "inherit";
        numbersGroup.appendChild(numberGroupTemplate);

        list.push(list_num[i]);
      
       }
       drawListOnScreen(list);
    
      
    }

}

function clearNumberGroup() {
    let numbersGroupChildren = numbersGroup.getElementsByClassName("number-group");
    let size = numbersGroupChildren.length;
    for (let i = 1; i < size; i++) {
       numbersGroup.removeChild(numbersGroupChildren[1]);
    }
}

function deleteNumberGroup(e) {
    if (e.target.nodeName === "SPAN") {
      let clickedNumberGroup = e.target.parentElement.parentElement.parentElement;
      let number = parseInt(
        clickedNumberGroup.getElementsByClassName("number-group-number")[0].innerText);
      let numbersGroupList = numbersGroup.getElementsByClassName("number-group");

      for (let i = 0; i < numbersGroupList.length; i++) {
        if (clickedNumberGroup === numbersGroupList[i]) {  // Index 0 element always be template, so need to minus one.
          list.splice(i - 1, 1);
        }
      }
      numbersGroup.removeChild(clickedNumberGroup);

      drawListOnScreen(list);
    }
}


function create_legend() {
    const legend = {    
        "data": [{
                    "title": "Item Swapped",
                    "color": SWAP_COLOR,
                },
                {
                    "title": "Item Being Compared",
                    "color": DEF_HL_COLOR,
                        },]
    };
    return legend;
}

function display_legend() {
  var legend = create_legend();
  return document.getElementById("legend").innerHTML =
  `<ul class='list-group col-3'>
    <li class='list-group-item' style = background-color:${legend.data[0].color}>
    ${legend.data[0].title}
    </li>
    <li class='list-group-item' style = background-color:${legend.data[1].color}>
    ${legend.data[1].title}
    </li>
  </ul>`;
}