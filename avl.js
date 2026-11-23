// avl.html. The algorithms (including AVL rebalancing) and the shared button
// actions are in tree_algos.js; the drawing is the AVL class in graph.js.

function disableButtons(ifDisable) {
  for (var id of ["createAVL-button", "insert-button", "search-button", "minmax-button",
                  "presuc-button", "delete-button", "traversal-button", "clear-AVL-button"]) {
    getHTML(id).disabled = ifDisable;
  }
}

function clearAVLGraph() {
  clearTree("AVLGraphContainer");
}
