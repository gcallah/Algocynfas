async function insertionSort(elements) {
    displayList(elements);
    await delay(DEFAULT_DELAY);
    for(var j = 1; j < elements.length; j++) {
        var key = elements[j];
        var i = j -1;
        highlightKey(key);
        resetCanvas();
        displayList(elements);
        while(i >= 0 && elements[i] > key) {
            highlight(elements[i]);
            await delay(DEFAULT_DELAY);
            resetCanvas();
            displayList(elements);
            elements[i + 1] = elements[i];
            i = i - 1
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
