function setSortSample(){                                          // Display layer
  let selectedBox = getHTML("sortSample");
  var sampleSelected = selectedBox.selectedIndex;
  if (sampleSelected == 1){
    getHTML("number-input").value = "3,1,6,2,8,5,9,7";
  }
  if (sampleSelected == 2){
    getHTML("number-input").value = "1,5,3,2,4,8,9,10";

  }
}


function inputNumberToArray(){                                  // Display layer
  list=[]
  canvas.clear();
  let an_input = getHTML("number-input").value;
  var result = checkInput(an_input);

  if(result == "invalid list"){
    alert("Please enter a valid list without '[]' "); 
    getHTML("number-input").value = "";
    return;
  } 

  if(Number.isInteger(result)){
    alert("The element on index " + result.toString() + " is not valid "); 
    return;
  }
    list = result;
    drawListOnScreen(list);
}


function checkInput(an_input) { // Logic layer: to test
    var list_num = an_input.split(/[ ,]+/);
    if (list_num.length == 0 || list_num.length == 1) {
        return "invalid list"
    }

    for (var i = 0; i < list_num.length; i++) {
        for (var j = 0; j < list_num[i].length; j++) {
            if ((list_num[i][j].charCodeAt(0) < 48 ||
                list_num[i][j].charCodeAt(0) > 57) &&
                list_num[i][j] != '-') {
                return i;
            }
        }

        list_num[i] = parseInt(list_num[i]);
        if (!Number.isInteger(list_num[i]) || list_num[i] < -99 || list_num[i] > 99) {
            return i;
        }
    }

    var v_list = []
    for (var i = 0; i < list_num.length; i++) {
        v_list.push(list_num[i]);
    }
    return v_list;
}





async function run() {                                    // Display layer
  animeRunning = true;
  let runButton = getHTML("run-button");
  let addNumberButton = getHTML("add-number-button");
  let sortType = document.getElementsByName("sort");
  runButton.disabled = true;
  addNumberButton.disabled = true;
  if(sortType[0].checked){
    await window.insertionSort(fList);
  }
  else if( sortType[1].checked){
    await window. bubbleSort(fList);
  }
  else if(sortType[2].checked){
    await window.quickSort(fList);
  }
  else if(sortType[3].checked){
    await window.selectionSort(fList);
  }
  else if(sortType[4].checked){
    var mergeList = mergePrepare();
    var delayTime = check_and_Delay();
    fList.setDelay(delayTime);
    mer.setDelay(delayTime);
    try{
      await window.mergeSort(fList,mergeList);
    }
    catch(error){
    }
    if(animeRunning){
      fList.unhighlight(0,fList.size()-1);
      await fList.draw();
    }
      mergeClear();
      mer.setList([]);
      mer.draw();
      getHTML("mergeCanvas").style.display = "none";
      getHTML("mergeTitle").style.display = "none";
    
  } else if(sortType[5].checked){
    document.getElementsByClassName("canvas-container")[0].style.height = "0px";
    getHTML("heapCanvas").style.display = "block";
    getHTML("heapTitle").style.display = "block";
    await window.heapSort(fList);

    document.getElementsByClassName("canvas-container")[0].style.height = "144px";
    getHTML("heapCanvas").style.display = "none";
    getHTML("heapTitle").style.display = "none";
  }

  runButton.disabled = false;
  addNumberButton.disabled = false;
  list = [];   
  getHTML("sortSample").selectedIndex = 0;
}


let animeRunning = false;
//quick sort below

async function quickSort(myList) {                                    // Logic layer: to test

  var delayTime = check_and_Delay   
  myList.setDelay(delayTime);
  await mySort(myList, 0, myList.size() - 1);
}

async function mySort(myList, low, high) {                    // Refer to CLRS P 171
  if (!animeRunning) {
    return;
  }

    if(low < high) {                                          // if (p < r)
      var pIndex = await partition(myList, low, high);       // q= partition( A, p, r)
      myList.unhighlight(low, high);
      await myList.draw();
      await mySort(myList, low, pIndex - 1);                 // QuickSort(A, p, q-1)
      await mySort(myList, pIndex + 1, high);                // QuickSort(A, q+1, r)
    }

  }

async function partition(myList, low, high) {                //partition(A, p, r)
  if (!animeRunning) {
    return;
  }
    var pivot = myList.elemAt(high).getKey();                // x = A[r]
    myList.highlightSwap(high);
    await myList.draw();
    var i = (low - 1);                                       // i = p-1
    for(var j = low; j < high; j++) {                        // for j = p to r - 1
      if (!animeRunning) {
        return;
      }
      myList.highlight(j);
      await myList.draw();
        if(myList.elemAt(j).getKey() <= pivot) {              // if A[j] <= x
            i++;                                              // i = i+1
            myList.swap(i, j);                                // exchange A[i] A[j]
            await myList.draw();
          }
        }
    myList.swap(i + 1, high);                              // exchange A[j+1] with A[r]
    await myList.draw();
    return i + 1;                                          // return i+1
  }



//  insertion sort below

async function insertionSort(myList) {                // Refer to CLRS P18
  var j = 0;
  var i = 0;
  var delayTime = check_and_Delay();
  myList.setDelay(delayTime);
  for (let dataElem of myList) {                  
    if (!animeRunning) break;
        var key = dataElem.getKey();                        // key = A[j];􏰀
        i = j - 1; // will be -1 first iteration!           // Insert A[j] 􏰀 into the sorted sequence A[1----j-1] i=j-1
        myList.highlightSwap(j);
        await myList.draw();
        while(i >= 0 && myList.elemAt(i).getKey() > key) {   //while i > 0 and A[i] > key
          if (!animeRunning) break;
          myList.highlight(i);
          await myList.draw(); 
            myList.swap(i, i + 1)                           // A [i+1] = A [i]
            i = i - 1;                                     // i = i -1
            await myList.draw();
          }
          await myList.draw();
        myList.unhighlight(i + 1, j);                    // A[i+1] = key
        await myList.draw();
        j++;
      }
    }

// bubble sort below
 async function bubbleSort(myList) {                      // Refer to CLRS P 40  
  var delayTime = check_and_Delay();
  myList.setDelay(delayTime);  
    for(let i = 0; i < myList.size(); i++) {                    // for i = 0 to A.length -1 
        for(let j = myList.size() - 1; j > i; j--) {               // for j= A.length downto i+1
          if (!animeRunning) break;
          myList.highlightSwap(j);
          await myList.draw();
            if(myList.elemAt(j).getKey() < myList.elemAt(j - 1).getKey()) {     // if A[j] < A [j-1]
              myList.highlight(j - 1);
              await myList.draw();
                myList.swap(j, j - 1);                                        // Exchange A[j] A[j-1] 
                await myList.draw();
              }
              myList.unhighlight(i, j);
              await myList.draw();
            }
          }
        }

// selectionSort below
async function selectionSort(myList){       //CLRS EXCERCISE 2.2-2  SELECTION-SORT(A)
  var delayTime = check_and_Delay();
  myList.setDelay(delayTime);
    for(var i = 0; i < myList.size() - 1; i++){   // for i = 1 to A.length - 1
      if (!animeRunning) break;
        var min = i;                          // min = i
        myList.highlight(i);
        await myList.draw();
        for(var j = i+1; j < myList.size(); j++){   //for j = i + 1 to A.length
          if (!animeRunning) break;
            if(myList.elemAt(j).getKey() < myList.elemAt(min).getKey()){    //if A[j] < A[min]
              if(min != i){
                myList.unhighlight(minInd);
              }
                min = j;                        // min = j
                myList.highlightSwap(j);
                await myList.draw();
              }
              else{
                myList.highlight(j);
                await myList.draw();
                myList.unhighlight(j);
              }
            }    
        myList.swap(i,min);                  //swap (i,min)
        await myList.draw();
        myList.unhighlight(i, min);
        await myList.draw();
      }
    }
    function mergeClear(){
     mergeCanvas.clear();
     mer.dataElems = [];
     getHTML("mergeCanvas").style.display = "block";
   }


   async function mergeSort(myList,list){
     if(!animeRunning){
      return;
    }
    if(list.length != 1){
     var leftHalf = list;
     var rightHalf = list.splice((list.length+1) / 2);
     var left = await mergeSort(myList,leftHalf);
     var right = await mergeSort(myList,rightHalf);
     var leftAndRight = left.concat(right);
     for(var i = 0; i < leftAndRight.length; i++){
      myList.highlight(leftAndRight[i].originalInd);
      await myList.draw();
    } 
    var result = await merge(left,right);
    for(var i = 0; i < leftAndRight.length; i++){
     if(!animeRunning){
      break;
    }
    leftAndRight[i].key = result[i];
    myList.highlightSwap(leftAndRight[i].originalInd);
    myList.dataElems[leftAndRight[i].originalInd].key = result[i];
    canvas.clear();
    await myList.draw(true);

  }

  return leftAndRight;
} 
return list;


}

async function merge(left,right){
 var displayList = [];
 while(left.length != 0){
  if(!animeRunning){
    break;
  }
  while(right.length != 0 && right[0].key < left[0].key){
    displayList.push(right[0].key);
    right.shift();
    mergeClear();                         
    mer.list = displayList;
    mer.setList(displayList);
    await mer.draw(true);
  }
  displayList.push(left[0].key);
  left.shift();
  mergeClear();
  mer.list = displayList;
  mer.setList(displayList);
  await mer.draw(true);
}
while(right.length != 0){
 if(!animeRunning){
  break;
}
displayList.push(right[0].key);
right.shift();
mergeClear();
mer.list = displayList;
mer.setList(displayList);
await mer.draw(true);
}
return displayList;
}


function mergePrepare(){
  getHTML("mergeCanvas").style.display = "block";
  getHTML("mergeTitle").style.display = "block";
  var mergeList = [];   
  for(var i = 0; i < list.length; i++){
    mergeList.push({
      key:   list[i],
      originalInd: i,
    });
  }
  return mergeList;

}

async function heapSort(myList){           //CLRS P 160

  console.log(myList)

  if (!animeRunning) {
    return;
  }
  
  var h = new heap(function(t1,t2) {
    return parseInt(t1.key) > parseInt(t2.key);
  }, myList);

  getHTML("heapTitle").innerHTML = "<b>Building the heap from bottom-up ... </b>"
  await h.build_heap(myList.list);
  
  getHTML("heapTitle").innerHTML = "<b> Extracting the Max and sorting... <b>"
  for(var i = h.data.length - 1; i >= 2; i--) {
    console.log(fList)
    if (!animeRunning) {
      fList.list = h.getDataList();
      return;
    }

    h.highLightNodes.push(1);
    h.highLightNodes.push(i);
    h.arrayList.highlightSwap(0);
    h.arrayList.highlightSwap(i-1);
    h.startGraph(false, "heapCanvas");
    await h.pause();

    [h.data[1].key, h.data[i].key] =  [h.data[i].key, h.data[1].key];
    h.arrayList.swap(0, i-1);
    h.startGraph(false, "heapCanvas");
    await h.pause();

    h.highLightNodes = [];
    h.arrayList.unhighlight(0);
    h.arrayList.unhighlight(i-1);
    h.startGraph(false, "heapCanvas");
    await h.pause();
    await h.down_heap(1, i);

  }


}


async function pause () {
  return new Promise(function (resolve) {
    setTimeout(resolve, 1000)
  })
}

//tests

module.exports = {
  func1: function checkInput(an_input){                            // Logic layer: to test
  var list_num = an_input.split(",");
  if(list_num.length == 0 || list_num.length == 1){
    return "invalid list"
  }
  for (var i = 0; i<list_num.length; i++) {
    list_num[i]=parseInt(list_num[i]);
    if (!Number.isInteger(list_num[i]) ||list_num[i] < -99 || list_num[i] > 99 ){
       return i;
   }
 }
  var v_list = []
  for(var i=0;i<list_num.length;i++){
    v_list.push(list_num[i]);
  }
  return v_list;
}


}




