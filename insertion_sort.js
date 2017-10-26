async function insertionSort(elements) {
    await displayList(elements);
    for(var j = 1; j < elements.length; j++) {
        var key = elements[j];
        var i = j - 1;
        await displayList(elements);
        await highlightKey(key);
        while(i >= 0 && elements[i] > key) {
            await highlight(elements[i]);
            console.log("Highlighting element to swap ", elements[i])
            elements[i + 1] = elements[i];
            i = i - 1
        }
        elements[i + 1] = key;
    }
    resetCanvas();
    displayList(elements);
}
