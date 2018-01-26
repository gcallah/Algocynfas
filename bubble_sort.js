async function bubbleSort(canvas, list) {
    var myList = new List(canvas, list)
    await myList.draw(true);
    for(var i = 0; i < myList.size(); i++) {
        for(var j = myList.size() - 1; j > i; j--) {
            myList.highlightSwap(j);
            await myList.draw();
            if(myList.elemAt(j).getKey() < myList.elemAt(j - 1).getKey()) {
                myList.highlight(j - 1);
                await myList.draw();
                myList.swap(j, j - 1)
                await myList.draw();
            }
            myList.unhighlight(i, j);
            await myList.draw();
        }
    }
}
