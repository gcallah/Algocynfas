async function bubbleSort(elements) {
    await displayList(elements);
    for(var i = 0; i < elements.length ; i++) {
        for(var j = elements.length - 1; j > i; j--) {
            if(elements[j] < elements[j - 1]) {
              [elements[j], elements[j - 1]] = await swapElem(elements[j], elements[j - 1]);
                await displayList(elements);
            }
        }
    }
    await displayList(elements);
}
