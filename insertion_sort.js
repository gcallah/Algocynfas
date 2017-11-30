async function insertionSort(elements) {
    await displayList(elements);
    for(var j = 1; j < elements.length; j++) {
        var key = elements[j];
        var i = j - 1;
        await highlightSwap(key);
        while(i >= 0 && elements[i] > key) {
            await highlight(elements[i]);
            elements[i + 1] = elements[i];
            i = i - 1
        }
        elements[i + 1] = key;
        displayList(elements);
        for(var h = j; h > i + 1; h--) {
          highlight(elements[h]);
        }
        await highlightSwap(key);
        await displayList(elements);
    }
    await displayList(elements);
}
