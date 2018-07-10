

function setSample(){
  let selectedBox = getHTML("sampleChoice");
  var sampleSelected = selectedBox.selectedIndex;

  if (sampleSelected == 0){
        clearGraph();
    }

    if (sampleSelected == 1){
        getHTML("number-input").value = "3,1,6,2,8,5,9";
        
    }

    else if (sampleSelected == 2){
        getHTML("number-input").value = "1,5,3,2,4,8,9";
        
    }
}

function inputNumberToArray() {
    clearNumberGroup();
    list=[]
    canvas.clear();
    let an_input = getHTML("number-input").value;
    var list_num = an_input.split(",");
    if(list_num.length == 0 || list_num.length == 1){
      alert("Please enter a valid list without '[]' "); 
      getHTML("number-input").value = "";
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
      getHTML("number-input").value = "";
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




 async function sort() {
    clearNumberGroup();

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
    else{ //sortType[2].checked
        await window.quickSort(fList);
    }
    


runButton.disabled = false;
addNumberButton.disabled = false;

list = [];   
getHTML("sampleChoice").selectedIndex = 0;
}


let animeRunning = false;
//quick sort below

async function quickSort(myList) {
    
    var delayTime = check_and_Delay();
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




