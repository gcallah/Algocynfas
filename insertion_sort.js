animeRunning = false;

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
    return myList
}

