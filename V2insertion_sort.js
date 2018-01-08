async function insertionSort(canvas, list) {
    var myList = new List(canvas, list)
    await myList.draw(true);
    for(var j = 1; j < list.length; j++) {
        var key = list[j];
        var i = j - 1;
        myList.highlight(key);
        await myList.draw();
        while(i >= 0 && list[i] > key) {
            myList.highlight(list[i]);
            list[i + 1] = list[i];
            i = i - 1
        }
        list[i + 1] = key;
        await myList.draw();
    }
    await myList.draw();
}
