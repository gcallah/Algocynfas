// binarySTree.html. The algorithms and the shared button actions (search,
// min/max, predecessor/successor, walks, delete) are in tree_algos.js; the
// drawing is the BST class in graph.js.

function disableButtons(ifDisable) {
  for (var id of ["createBST-button", "insert-button", "search-button", "minmax-button",
                  "presuc-button", "delete-button", "traversal-button", "clear-button"]) {
    getHTML(id).disabled = ifDisable;
  }
}

function clearBstGraph() {
  clearTree("bstGraphContainer");
}
