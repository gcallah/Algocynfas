// redBlackTree.html. The algorithms (RB-INSERT-FIXUP, RB-DELETE and its fixup)
// and the shared Delete action are in tree_algos.js; the drawing is the RBT
// class in graph.js.

function disableButtons(ifDisable) {
  for (var id of ["createRBT-button", "insert-rb-button", "delete-rb-button", "clear-rb-button"]) {
    getHTML(id).disabled = ifDisable;
  }
}

function clearRBGraph() {
  clearTree("rbtGraphContainer");
}
