 



 async function sort() {
    clearNumberGroup();

    animeRunning = true;

    let runButton = document.getElementById("run-button");
    let addNumberButton = document.getElementById("add-number-button");
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
}


let animeRunning = false;
//quick sort below

async function quickSort(myList) {
    
    var delayTime = check_and_Delay();
    myList.setDelay(delayTime);
    await mySort(myList, 0, myList.size() - 1);
}

async function mySort(myList, low, high) {
    if (!animeRunning) {
        return;
    }

    if(low < high) {
      var pIndex = await partition(myList, low, high);
      myList.unhighlight(low, high);
      await myList.draw();
      await mySort(myList, low, pIndex - 1);
      await mySort(myList, pIndex + 1, high);
    }

}

async function partition(myList, low, high) {
    if (!animeRunning) {
        return;
    }

    var pivot = myList.elemAt(high).getKey();
    myList.highlightSwap(high);
    await myList.draw();
    var i = (low - 1);
    for(var j = low; j < high; j++) {
        if (!animeRunning) {
            return;
        }
        myList.highlight(j);
        await myList.draw();
        if(myList.elemAt(j).getKey() <= pivot) {
            i++;
            myList.swap(i, j);
            await myList.draw();
        }
    }
    myList.swap(i + 1, high);
    await myList.draw();
    return i + 1;
}



//  insertion sort below

async function insertionSort(myList) {
    var j = 0;
    var i = 0;

    var delayTime = check_and_Delay();
    myList.setDelay(delayTime);
    for (let dataElem of myList) {
        if (!animeRunning) break;
        var key = dataElem.getKey();
        i = j - 1; // will be -1 first iteration!
        myList.highlightSwap(j);
        await myList.draw();
        while(i >= 0 && myList.elemAt(i).getKey() > key) {
            if (!animeRunning) break;
            myList.highlight(i);
            await myList.draw();
            myList.swap(i, i + 1)
            i = i - 1;
            await myList.draw();
        }
        await myList.draw();
        myList.unhighlight(i + 1, j);
        await myList.draw();
        j++;
    }
}

// bubble sort below

async function bubbleSort(myList) {

    
    var delayTime = check_and_Delay();
    myList.setDelay(delayTime);
    
    for(let i = 0; i < myList.size(); i++) {
        for(let j = myList.size() - 1; j > i; j--) {
            if (!animeRunning) break;
   

            myList.highlightSwap(j);
            await myList.draw();
            if(myList.elemAt(j).getKey() < myList.elemAt(j - 1).getKey()) {
                myList.highlight(j - 1);
                await myList.draw();
                myList.swap(j, j - 1);
                await myList.draw();
            }
            myList.unhighlight(i, j);
            await myList.draw();
        }
    }

}




