async function quickSort(myList) {
    mySort(myList, 0, myList.size() - 1);
}

async function mySort(myList, low, high) {
    if(low < high) {
      var pIndex = await partition(myList, low, high);
      myList.unhighlight(low, high);
      await myList.draw();
      mySort(myList, low, pIndex - 1);
      mySort(myList, pIndex + 1, high);
    }
}

async function partition(myList, low, high) {
    var pivot = myList.elemAt(high).getKey();
    myList.highlightSwap(high);
    await myList.draw();
    var i = (low - 1);
    for(var j = low; j < high; j++) {
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
