async function insertionSort(canvas, list) {
    var myList = new List(canvas, list)
    await myList.draw(true);
    //iterator
    myList.iterator();
    for(var j = 1; j < list.length; j++) {
        var key = list[j];
        var i = j - 1;
        myList.highlightSwap(key);
        await myList.draw();
        while(i >= 0 && list[i] > key) {
            myList.highlight(list[i]);
            await myList.draw();
            list[i + 1] = list[i];
            i = i - 1
        }
        list[i + 1] = key;
        myList.reOrder();
        await myList.draw();
        for(var h = j; h > i; h--) {
            myList.unhighlight(list[h]);
        }
        await myList.draw();
    }
}
