async function insertionSort(elements) {
    displayList(elements);
    for(var j = 1; j < elements.length; j++) {
        var key = elements[j];
        var i = j -1;
        highlightKey(key);
        while(i >= 0 && elements[i] > key) {
            highlight(elements[i]);
            elements[i + 1] = elements[i];
            i--;
    }
    elements[i + 1] = key;
    await delay(DEFAULT_DELAY);
    resetCanvas();
    displayList(elements);
    }
    await delay(DEFAULT_DELAY);
    resetCanvas();
    displayList(elements);
}
