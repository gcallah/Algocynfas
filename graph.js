const EdgeNodeCOLOR = "#0039e6";
const HIGHLIGHT = "#F5B041";
const RESULTCOLOR = "#FF5733";
const ErrorCOLOR = "#FF0000";
const RED = "#FF0000";
const BLACK = "#000000";
adjustPosition = false;
const NUM_NODES = 0;
NUM_ENTRY_WIDTH = 200;
LIST_ENTRY_WIDTH = 400;

// Pages for algorithms that handle negative edge weights (e.g. Bellman-Ford)
// set `const ALLOW_NEGATIVE_WEIGHTS = true;`. Other pages reject them.
function negativeWeightsAllowed() {
  return typeof ALLOW_NEGATIVE_WEIGHTS !== "undefined" && ALLOW_NEGATIVE_WEIGHTS;
}

function typeChange() {
  var choice = getHTML("choices").selectedIndex;
  var inputBox = getHTML("nodeNum");
  if (choice == NUM_NODES) {
    inputBox.style.width = NUM_ENTRY_WIDTH;
    inputBox.placeholder = "Enter number of nodes (max 16 nodes)";
    inputType = "num";
  } else {
    inputBox.style.width = LIST_ENTRY_WIDTH;
    inputBox.placeholder = "Enter node names separate by comma, max 16 nodes";
    inputType = "name";
  }
}

function createGraph(ifEdge, container) {
  var graph = new ourGraph();
  graph.setGraph(ifEdge, container);
  Graph = graph;
}

function createTree(ifEdge) {
  var graph = new tree();
  graph.setGraph(ifEdge, "treeGraphContainer");
  Graph = graph;
}

// The Create (type 1) and Insert (type 2) buttons on the tree pages; buildTree
// is in tree_algos.js.
function createBST(type) {
  return buildTree(BST, type);
}

function createAVL(type) {
  return buildTree(AVL, type);
}

function createRBT(type) {
  return buildTree(RBT, type);
}

function setTreeSample() {
  
  let selectedBox = getHTML("treeSample");
  var sampleSelected = selectedBox.selectedIndex;
  $(".graph").empty();

  if (sampleSelected == 0) {
    getHTML("treeList").value = "";
  }

  if (sampleSelected == 1) {
    getHTML("treeList").value = "15,4,29,1,63,17";
  } else if (sampleSelected == 2) {
    getHTML("treeList").value = "10,7,15,3,21,5,11,18,8,9,4,6,19,2,1";
  }
  getHTML("random").checked == false;
}

//////////wrapper class implementation

class ourGraph {
  constructor() {
    this.sigma = null;
    this.graph = null;
    this.edgeLayout = [];
    this.nodes = [];
    this.edges = [];
    this.weights = null;
    this.nodeSet = null;
    //only for weighted graph
    this.weightEdgeMap = null;
    this.position = true;
  }

  setGraph(ifEdge, container) {
    //Node part
    var rawInput = getHTML("nodeNum").value;

    if (inputType == "num") {
      var inputNum = parseInt(rawInput);
    } else {
      var nameList = splitInput(rawInput);
      var inputNum = nameList.length;
      this.nodes = nameList;
    }

    // begin to do graphing prepare
    if (inputNum == 0) {
      return;
    }

    if (inputNum > 0 && inputNum < 17) {
      correctErr("nodeNum");

      if (inputType == "num") {
        var defaultList = [];
        var counter = 0;
        while (counter != inputNum) {
          var elem = letterNumConvert(counter);
          defaultList.push(elem);
          counter += 1;
        }
        this.nodes = defaultList;
      }

      var nodeLayout = sixteenArrange[inputNum];
      this.edgeCheck(ifEdge);

      let g = {
        nodes: nodeLayout,
        edges: this.edgeLayout
      };

      this.graph = g;

      if (inputType == "name") {
        this.setName();
      }
    } else {
      noticeErr("Please give a valid input!", "nodeNum");
    }

    try {
      console.log(container);
      this.createGraph(container);
      if (this.edges.length == 0) {
        correctErr("edges");
      }
    } catch (error) {
      noticeErr("Please make sure if the nodes existed!", "edges");
    }
  }

  edgeCheck(ifEdge) {
    if (ifEdge == true) {
      var edgeList = splitInput(getHTML("edges").value, true);
      this.edges = edgeList;
      var counter = 0;
      if (dir == 1) {
        var shape = "arrow";
      } else {
        var shape = "line";
      }

      for (var i = 0; i < edgeList.length; i++) {
        var nodesToConnect = edgeList[i].split("-");
        if (
          nodesToConnect.length != 2 ||
          nodesToConnect[0] == nodesToConnect[1]
        ) {
          noticeErr(
            "Please enter edges in valid format (a-b,b-c), no self loop allowed !",
            "edges"
          );
          return;
        }
        var missing = nodesToConnect.filter((v) => !this.hasVertex(v));
        if (missing.length) {
          this.edges = edgeList.slice(0, i);
          noticeErr(
            "Edge " + edgeList[i] + " uses " + missing.join(" and ") +
              ", which is not a vertex of this graph",
            "edges"
          );
          return;
        }
        correctErr("edges");

        if (weight == 1) {
          var listWeight = splitInput(getHTML("weights").value, true);
          this.weights = listWeight;
          var WEIGHT = parseInt(listWeight[counter]);
          if (Number.isInteger(WEIGHT) && (WEIGHT >= 0 || negativeWeightsAllowed())) {
            correctErr("weights");
            WEIGHT = WEIGHT.toString();
          } else {
            noticeErr(
              "Please make sure the weight input and the number of weight inputs are valid!",
              "weights"
            );
            return;
          }
        } else {
          WEIGHT = null;
        }

        correctErr("weights");
        this.setGraphEdges(edgeList[i], nodesToConnect, WEIGHT, shape);
        counter += 1;
      }
      if (weight == 1) {
        if (counter < this.weights.length) {
          noticeErr(
            "Please make sure if the weight number matches edge number!",
            "weights"
          );
        } else {
          correctErr("weights");
        }
      }
    }
  }

  hasVertex(name) {
    if (inputType == "num") {
      var index = letterNumConvert(name);
      return index !== undefined && index < this.nodes.length;
    }
    return this.find(name) != -1;
  }

  setGraphEdges(edge, nodesToConnect, WEIGHT, shape) {
    if (inputType == "num") {
      this.edgeLayout.push({
        id: edge,
        source: letterNumConvert(nodesToConnect[0]).toString(),
        target: letterNumConvert(nodesToConnect[1]).toString(),
        size: 5,
        label: WEIGHT,
        type: shape,
        color: EdgeNodeCOLOR
      });
    } else {
      this.edgeLayout.push({
        id: edge,
        source: this.find(nodesToConnect[0]).toString(),
        target: this.find(nodesToConnect[1]).toString(),
        size: 5,
        label: WEIGHT,
        type: shape,
        color: EdgeNodeCOLOR
      });
    }
  }

  createGraph(containerName) {
    var container = "." + containerName;
    $(container).empty();
    let s = new sigma({
      graph: this.graph,
      renderer: {
        container: containerName,
        type: "canvas"
      },
      settings: {
        defaultNodeColor: EdgeNodeCOLOR,
        enableCamera: false,
        autoRescale: false,
        defaultEdgeLabelSize: 15
      }
    });

    this.sigma = s;

    this.enableDrag();
  }

  adjustPos(dir, node) {
    if (dir == "left") {
      node.layout.x -= 30;
      node.position.x -= 30;
    } else {
      node.layout.x += 30;
      node.position.x += 30;
    }
    if (node.position.x >= 550 || node.position.x <= -550) {
      if (this.position) {
        noticeErr(
          "Sorry the graph is too big to fit in the container, try randomize!"
        );
        this.position = false;
      }
    }
    if (node.left) {
      this.adjustPos(dir, node.left);
    }
    if (node.right) {
      this.adjustPos(dir, node.right);
    }
  }

  strench(adjustList) {
    for (var i = 0; i < adjustList.length; i++) {
      adjustList[i].strenchTimes += 1;
      this.adjustPos(adjustList[i].sideToParent, adjustList[i]);
    }
  }

  enableDrag() {
    var dragListener = sigma.plugins.dragNodes(
      this.sigma,
      this.sigma.renderers[0]
    );

    dragListener.bind("startdrag", function(event) {});
    dragListener.bind("drag", function(event) {});
    dragListener.bind("drop", function(event) {});
    dragListener.bind("dragend", function(event) {});
  }

  setName() {
    for (var i = 0; i < this.nodes.length; i++) {
      this.graph.nodes[i].label = this.nodes[i];
    }
  }

  find(name) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (name == this.nodes[i].split(" ").join("")) {
        return i;
      }
    }

    return -1;
  }

  makeSets() {
    var nodeList = [];
    for (var i = 0; i < this.nodes.length; i++) {
      nodeList.push(i);
    }
    this.nodeSet = nodeList;
  }

  createWeightEdgeMap() {
    var weMap = new Map();
    for (var i = 0; i < this.weights.length; i++) {
      try {
        var list = weMap.get(this.weights[i]);
        list.push(this.edges[i]);
        weMap.set(this.weights[i], list);
      } catch (error) {
        weMap.set(this.weights[i], [this.edges[i]]);
      }
    }
    this.weightEdgeMap = weMap;
  }

  unionFind(node1Index, node2Index) {
    var list = this.nodeSet;
    var afterVal = list[node1Index];
    var beforeVal = list[node2Index];
    for (var i = 0; i < list.length; i++) {
      if (list[i] == beforeVal) {
        list[i] = afterVal;
      }
    }
    return list;
  }

  getNodes(edge) {
    var node1 = edge.split("-")[0];
    var node2 = edge.split("-")[1];
    var node1Index = letterNumConvert(node1);
    var node2Index = letterNumConvert(node2);
    return {
      n1: node1Index,
      n2: node2Index
    };
  }

  findMinIndex(Q) {
    // for prim
    var min = Infinity;
    var ind = 0;
    for (var i = 0; i < Q.length; i++) {
      if (Q[i] != null) {
        if (parseInt(Q[i].key) < min) {
          min = Q[i].key;
          ind = i;
        }
      }
    }
    return ind;
  }

  findConnectionMap() {
    var connectionMap = [];
    for (var j = 0; j < this.nodes.length; j++) {
      connectionMap.push([]);
    }

    for (var i = 0; i < this.edges.length; i++) {
      var nodesToConnect = this.edges[i].split("-");

      connectionMap[letterNumConvert(nodesToConnect[0])].push({
        connectedTo: nodesToConnect[1],
        cost: parseInt(this.weights[i])
      });

      connectionMap[letterNumConvert(nodesToConnect[1])].push({
        connectedTo: nodesToConnect[0],
        cost: parseInt(this.weights[i])
      });
    }

    return connectionMap;
  }

  async color(path, nodes = null, theColor = HIGHLIGHT, pause = true) {
    var pathEdges = this.sigma.graph.edges(path);
    if (nodes) {
      var pathNodes = this.sigma.graph.nodes(nodes);
    }
    for (var i = 0; i < pathEdges.length; i++) {
      if (animeRunning) {
        try {
          if (nodes) {
            pathNodes[i].color = theColor;
            Graph = this;
            graphRefresh();
            if (pause) {
              await this.pause();
            }
          }
          pathEdges[i].color = theColor;
        } catch (error) {
          var str = path[i];
          str = str.split("-");
          path[i] = str[1] + "-" + str[0];

          console.log(pathEdges[i]);
          pathEdges[i] = this.sigma.graph.edges(path[i]);
          pathEdges[i].color = theColor;
        }
        Graph = this;
        graphRefresh();
        if (pause) {
          await this.pause();
        }
      } else {
        break;
      }
    }
    if (nodes && animeRunning) {
      pathNodes[pathNodes.length - 1].color = theColor;
      Graph = this;
      graphRefresh();
      await this.pause();
    }
  }

  async pause(time = 0) {
    if (time == 0) {
      var time = check_and_Delay();
    }
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  }

  /// kruskal

  kruskal() {
    //refer to CLRS P631 Kruskal's Algorithm
    if (this.edges.length == 0) {
      noticeErr("Please input edge first!", "edges"); // A != []
      return;
    }
    correctErr("edges");
    this.createWeightEdgeMap();
    var path = [];

    this.makeSets(); //MAKE-SET(v)
    var sortedWeight = this.weights.sort(function(a, b) {
      return a - b;
    }); // sort the edges of G.E into nondecreasing order by weight w
    for (var i = 0; i < sortedWeight.length; i++) {
      // // for each edge (u,v) in G.E, taken in nondecreasing order by weight
      var edges = this.weightEdgeMap.get(sortedWeight[i]); // (Achieved by mapping weights to the edges in the method createWeightEdgeMap())
      for (var j = 0; j < edges.length; j++) {
        var nodes = this.getNodes(edges[j]);

        if (
          this.nodeSet[nodes.n1] != this.nodeSet[nodes.n2] // if FIND-SET(u)!= FIND-SET(v)
        ) {
          path.push(edges[j]); // A = A U {(u,v)}
          this.nodeSet = this.unionFind(nodes.n1, nodes.n2); // Union (u,v)
        }
      }
    }

    var color = true;
    for (var i = 1; i < this.nodeSet.length; i++) {
      var final = this.nodeSet[0];
      if (this.nodeSet[i] != final) {
        noticeErr("Sorry this is an disconnected graph so no kruskal's path!");
        color = false;
        break;
      }
    }
    if (color) {
      this.color(path);
    }
  }

  // prim
  prim() {
    // Refer to CLRS P634's prim's algorithm
    var path = [];
    var color = true;
    var connectionMap = this.findConnectionMap();
    if (this.edges.length == 0) {
      noticeErr("Please input edge first!", "edges"); // G.V != []
      return;
    }
    correctErr("edges");
    var Q = []; // Note: In this algorithm, an array is used instead of a minimum piority queue
    for (var ind = 0; ind < this.nodes.length; ind++) {
      // for each u in G.V

      var u = {
        vertex: this.nodes[ind],
        key: Infinity, // u.key = infinity
        parent: null // u.p = NIL
      };

      Q.push(u);
    }
    var r = Q[0]; //(Choose the first of the list as root)
    r.key = 0; // r.key = 0;
    var minInd = 0;
    var size = Q.length;

    while (size != 0) {
      //while Q != []
      var u = Q[minInd]; // u = Extract - min(Q)
      try {
        var adjU = connectionMap[letterNumConvert(u.vertex)];
      } catch (error) {
        noticeErr("Sorry this is an disconnected graph so no Prim's path!");
        color = false;
        break;
      }
      for (var i = 0; i < adjU.length; i++) {
        //for each v in G.adj[u];
        var nodeIndex = letterNumConvert(adjU[i].connectedTo);
        if (Q[nodeIndex] && adjU[i].cost < Q[nodeIndex].key) {
          // if v in Q.V and w(u,v) < v.key
          Q[nodeIndex].parent = u.vertex; // v.p = u
          Q[nodeIndex].key = adjU[i].cost; // v.key = w(u,v)
        }
      }
      if (size != Q.length) {
        path.push(u.parent + "-" + u.vertex);
      }

      delete Q[minInd];
      minInd = this.findMinIndex(Q);

      size -= 1;
    }

    if (color) {
      this.color(path);
    }
  }
}

class tree extends ourGraph {
  constructor() {
    super();
  }

  setGraph(ifEdge, container) {
    super.setGraph(ifEdge, container);
    if (this.edges.length != 0) {
      var result = this.isTree();
      if (result == "true") {
        correctErr("edges");
        return;
      } else if (result == "cir") {
        noticeErr("A tree cannot has circles!", "edges");
      } else if (result == "disconnected") {
        noticeErr("A tree cannot be disconnected!", "edges");
      } else {
        noticeErr("A tree cannot be disconnected or contains circle!", "edges");
      }
    }
  }

  isTree() {
    var result = "true";
    var circledge = [];
    var circledSet = [];
    this.makeSets();
    for (var i = 0; i < this.edges.length; i++) {
      var nodes = this.getNodes(this.edges[i]);
      if (this.nodeSet[nodes.n1] != this.nodeSet[nodes.n2]) {
        var list = this.nodeSet;
        var afterVal = list[nodes.n1];
        var beforeVal = list[nodes.n2];
        for (var j = 0; j < list.length; j++) {
          if (list[j] == beforeVal) {
            list[j] = afterVal;
          }
        }
      } else {
        result = "cir";
        circledge.push(this.edges[i]);
        circledSet.push(circledge);
        circledge = [];
      }
      circledge.push(this.edges[i]);
    }

    var final = this.nodeSet[0];
    for (var i = 1; i < this.nodeSet.length; i++) {
      if (this.nodeSet[i] != final) {
        if (result == "cir") {
          result += "disconnected";
        } else {
          result = "disconnected";
        }
        break;
      }
    }

    for (var i = 0; i < circledSet.length; i++) {
      this.color(circledSet[i], null, ErrorCOLOR, false);
    }
    return result;
  }
}

class treeNode {
  constructor(num, counter) {
    this.key = num;
    this.id = counter;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.layout = null;
    this.position = null;
    this.sideToParent = null;
    this.leftEdge = null;
    this.rightEdge = null;
    this.strenchTimes = 0;
    
  }
  setNode(defaultColor = EdgeNodeCOLOR) {
    if (!this.parent) {
      this.layout = {
        id: this.id.toString(),
        label: this.key.toString(),
        x: 0,
        y: -100,
        size: 12,
        color: defaultColor
      };
      this.position = {
        x: 0,
        y: -100
      };
    } else {
      if (this.sideToParent == "left") {
        this.position = {
          x: this.parent.position.x - 30,
          y: this.parent.position.y + 30
        };
      } else {
        this.position = {
          x: this.parent.position.x + 30,
          y: this.parent.position.y + 30
        };
      }
      this.layout = {
        id: this.id.toString(),
        label: this.key.toString(),
        x: this.position.x,
        y: this.position.y,
        size: 12,
        color: defaultColor
      };
    }
  }
}

// The three search trees. The algorithms are in tree_algos.js; these classes
// draw them. Nodes live in treeNodes, indexed by id (null once deleted), and the
// tree is laid out again from its shape every time it is drawn, so rotations
// and deletions never leave stale positions behind.
class BST extends ourGraph {
  constructor(container = "bstGraphContainer") {
    super();
    this.container = container;
    this.deleteBox = "deleteBox";
    this.root = null;
    this.treeNodes = [];
    this.nodeLayout = [];
  }

  newNode(key) {
    return new treeNode(key, this.treeNodes.length);
  }

  nodeColor(node) {
    return EdgeNodeCOLOR;
  }

  // Hooks for the balanced trees.
  afterInsert(node) {}
  afterDelete(changed) {}

  // Insert a key without drawing; false (and a warning) if it isn't an integer.
  insertChecked(key, box) {
    if (!Number.isInteger(key)) {
      noticeErr("Please input a valid integer", box);
      return false;
    }
    correctErr(box);
    var node = this.newNode(key);
    this.root = treeInsert(this.root, node).root;
    this.treeNodes.push(node);
    this.afterInsert(node);
    return true;
  }

  removeNode(z) {
    var result = treeDelete(this, z);
    this.afterDelete(result.changed);
  }

  // The ids on the way down from the root to where key belongs.
  pathTo(key) {
    var path = [];
    for (var x = this.root; x; x = key < x.key ? x.left : x.right) {
      path.push(x.id);
    }
    return path;
  }

  setStatus(text) {
    var status = getHTML("tree-status");
    if (status) {
      status.textContent = text;
    }
  }

  // Lay the nodes out from the tree's shape: x from the in-order position,
  // y from the depth. Sigma's origin is the middle of the container.
  relayout() {
    var order = [];
    var maxDepth = 0;
    var walk = (n, depth) => {
      if (!n) return;
      walk(n.left, depth + 1);
      n.depth = depth;
      order.push(n);
      maxDepth = Math.max(maxDepth, depth);
      walk(n.right, depth + 1);
    };
    walk(this.root, 0);

    var box = getHTML(this.container);
    var width = Math.min(1100, Math.max(800, order.length * 40 + 80));
    var levelGap = 50;
    var height = Math.max(300, (maxDepth + 1) * levelGap + 60);
    box.style.width = width + "px";
    box.style.height = height + "px";
    var step = order.length > 1 ? Math.min(60, (width - 80) / (order.length - 1)) : 0;

    this.nodeLayout = [];
    this.edgeLayout = [];
    for (var i = 0; i < order.length; i++) {
      var n = order[i];
      n.position = {
        x: (i - (order.length - 1) / 2) * step,
        y: -height / 2 + 30 + n.depth * levelGap
      };
      n.layout = {
        id: n.id.toString(),
        label: n.key.toString(),
        x: n.position.x,
        y: n.position.y,
        size: 12,
        color: this.nodeColor(n)
      };
      this.nodeLayout.push(n.layout);
    }
    for (var n of order) {
      n.leftEdge = n.left ? this.edgeTo(n, n.left) : null;
      n.rightEdge = n.right ? this.edgeTo(n, n.right) : null;
    }
    this.graph = { nodes: this.nodeLayout, edges: this.edgeLayout };
  }

  edgeTo(parent, child) {
    var edge = {
      id: parent.id + "-" + child.id,
      source: parent.id.toString(),
      target: child.id.toString(),
      size: 4,
      color: EdgeNodeCOLOR
    };
    this.edgeLayout.push(edge);
    return edge;
  }

  draw() {
    this.relayout();
    if (this.sigma) {
      this.sigma.kill();
    }
    this.createGraph(this.container);
  }

  // Light up a path of node ids; consecutive nodes are parent and child
  // (either way round).
  async highLight(ids, edges = null) {
    if (ids.length == 0 || !this.sigma) {
      return;
    }
    if (!edges) {
      edges = [];
      for (var i = 0; i < ids.length - 1; i++) {
        var a = this.treeNodes[ids[i]];
        var b = this.treeNodes[ids[i + 1]];
        edges.push(b.parent == a ? a.id + "-" + b.id : b.id + "-" + a.id);
      }
    }
    await this.color(edges, ids);
  }

  // The Insert button: show the path down to where the key goes, then insert it.
  async insert(key) {
    if (!Number.isInteger(key)) {
      noticeErr("Please input a valid integer", "treeNode");
      return;
    }
    if (this.root) {
      this.draw();
      await this.highLight(this.pathTo(key));
    }
    this.insertChecked(key, "treeNode");
    this.setStatus(this.insertMessage(key));
    this.draw();
    await this.highLight([this.treeNodes.length - 1]);
  }

  insertMessage(key) {
    return "Inserted " + key + ".";
  }

  async search() {
    var input = parseInt(getHTML("searchBox").value);
    if (!Number.isInteger(input)) {
      noticeErr("Please input a valid integer", "searchBox");
      return;
    }
    correctErr("searchBox");
    var result = treeSearch(this.root, input); // TREE-SEARCH
    await this.highLight(result.path);
    if (!result.node) {
      noticeErr(input + " not found in the tree", "searchBox");
    }
  }

  async minMax() {
    if (getHTML("minMaxChoice").selectedIndex == 0) {
      var result = treeMin(this.root); // TREE-MINIMUM
      await this.highLight(result.HLNodeId);
      var message = "The minimum is " + result.min.key;
    } else {
      var result = treeMax(this.root); // TREE-MAXIMUM
      await this.highLight(result.HLNodeId);
      var message = "The maximum is " + result.max.key;
    }
    if (animeRunning) {
      alert(message);
    }
  }

  async preSuc() {
    var input = parseInt(getHTML("preSucBox").value);
    if (!Number.isInteger(input)) {
      noticeErr("Please give a valid input!", "preSucBox");
      return;
    }
    var node = treeSearch(this.root, input).node;
    if (!node) {
      noticeErr("Node is not in this tree", "preSucBox");
      return;
    }
    correctErr("preSucBox");
    if (getHTML("preSucChoice").selectedIndex == 0) {
      var result = treePredecessor(node); // TREE-PREDECESSOR
      await this.highLight(result.HLNodeId);
      var message = result.pre === null
        ? input + " is the smallest key, so it has no predecessor"
        : "The predecessor is " + result.pre;
    } else {
      var result = treeSuccessor(node); // TREE-SUCCESSOR
      await this.highLight(result.HLNodeId);
      var message = result.suc === null
        ? input + " is the largest key, so it has no successor"
        : "The successor is " + result.suc;
    }
    if (animeRunning) {
      alert(message);
    }
  }

  async traversal() {
    var index = getHTML("treeWalkChoice").selectedIndex;
    if (index == 0) {
      var result = preorderTreeWalk(this.root);
    } else if (index == 1) {
      var result = inorderTreeWalk(this.root);
    } else {
      var result = postorderTreeWalk(this.root);
    }
    var keys = result.node.map((id) => this.treeNodes[id].key);
    this.setStatus(getHTML("treeWalkChoice").selectedOptions[0].text.trim() + ": " + keys.join(", "));
    await this.highLight(result.node, result.edge);
  }

  async delete() {
    var input = parseInt(getHTML(this.deleteBox).value);
    if (!Number.isInteger(input)) {
      noticeErr("Please give a valid input!", this.deleteBox);
      return;
    }
    correctErr(this.deleteBox);
    var searched = treeSearch(this.root, input);
    await this.highLight(searched.path);
    var z = searched.node;
    if (!z) {
      noticeErr("Node is not in this tree", this.deleteBox);
      return;
    }
    if (z.left && z.right) {
      // Two children: show the way to the successor, which takes z's place.
      var path = treeMin(z.right).HLNodeId;
      path.unshift(z.id);
      await this.highLight(path);
    }
    this.removeNode(z);
    this.treeNodes[z.id] = null;
    this.setStatus(this.deleteMessage(input));
    this.draw();
  }

  deleteMessage(key) {
    return "Deleted " + key + ".";
  }
}

// AVL trees rebalance with rotations after every insert and delete
// (avlRebalance in tree_algos.js).
class AVL extends BST {
  constructor() {
    super("AVLGraphContainer");
    this.rotations = [];
  }

  newNode(key) {
    var node = super.newNode(key);
    node.height = 1;
    return node;
  }

  afterInsert(node) {
    this.rotations = avlRebalance(this, node.parent);
  }

  afterDelete(changed) {
    this.rotations = avlRebalance(this, changed);
  }

  rotationText() {
    return this.rotations.length
      ? " Rebalanced with " + this.rotations.join(", then ") + "."
      : " No rotations needed.";
  }

  insertMessage(key) {
    return super.insertMessage(key) + this.rotationText();
  }

  deleteMessage(key) {
    return super.deleteMessage(key) + this.rotationText();
  }
}

// Red-black trees recolor and rotate after every insert and delete
// (rbInsertFixup and rbDelete in tree_algos.js).
class RBT extends BST {
  constructor() {
    super("rbtGraphContainer");
    this.deleteBox = "deleteRbBox";
  }

  newNode(key) {
    var node = super.newNode(key);
    node.color = RED;
    return node;
  }

  nodeColor(node) {
    return node.color;
  }

  afterInsert(node) {
    rbInsertFixup(this, node);
  }

  removeNode(z) {
    rbDelete(this, z);
  }
}

class heap extends ourGraph {
  constructor(cmp = heap_less, lst = fList) {
    super();
    this.data = []; // elements are treeNode
    this.data.push(null); // ignore index 0 to make child/parent computation easier
    this.arrayList = lst; // heap array form
    this.cmp = cmp; // compare function, determine min/max-heap
    this.id = 0; // assign incremental ids to nodes and edges of the sigma graph
    this.highLightNodes = [];
    this.highLightEdges = [];
    this.nodeLayout = [];
  }

  // parent index
  parent(i) {
    return Math.floor(i / 2);
  }

  // leftIndex
  left(i) {
    return 2 * i;
  }

  // rightIndex
  right(i) {
    return 2 * i + 1;
  }

  is_left(i) {
    return this.parent(i) * 2 == i;
  }

  is_right(i) {
    return !this.is_left(i);
  }

  has_left(i) {
    return this.left(i) < this.data.length;
  }

  has_right(i) {
    return this.right(i) < this.data.length;
  }

  //return a list of keys, instead of treeNode
  getDataList() {
    list = [];
    for (var i = 1; i < this.data.length; i++) {
      list.push(this.data[i].key);
    }

    return list;
  }

  //build heap bottom-up
  async build_heap(lst) {
    for (var i = 0; i < lst.length; i++) {
      var node = new treeNode(lst[i], this.id++);
      this.data.push(node);
    }

    this.data[1].setNode();
    for (var i = 2; i < this.data.length; i++) {
      this.posAdjust(i);
    }

    for (var i = Math.floor(this.data.length / 2); i >= 1; i--) {
      await this.down_heap(i, this.data.length);
    }
  }

  async down_heap(i, end) {
    if (!animeRunning) {
      return;
    }
    this.highLightNodes.push(i);
    this.arrayList.highlightSwap(i - 1);
    this.startGraph(false, "heapCanvas");
    await this.pause();
    while (this.left(i) < end) {
      this.arrayList.highlightSwap(i - 1);
      var min_child = this.left(i);
      this.highLightNodes.push(this.left(i));
      this.arrayList.highlight(this.left(i) - 1);

      if (this.right(i) < end) {
        this.highLightNodes.push(this.right(i));
        this.arrayList.highlight(this.right(i) - 1);
        if (this.cmp(this.data[this.right(i)], this.data[min_child])) {
          min_child = this.right(i);
        }
      }

      this.startGraph(false, "heapCanvas");
      await this.pause();

      if (this.cmp(this.data[min_child], this.data[i])) {
        this.highLightEdges.push([this.data[i].id, this.data[min_child].id]);

        [this.data[i].key, this.data[min_child].key] = [
          this.data[min_child].key,
          this.data[i].key
        ];
        this.arrayList.swap(i - 1, min_child - 1);
        this.startGraph(false, "heapCanvas");
        await this.pause();

        this.arrayList.unhighlight(i - 1);
        this.arrayList.unhighlight(this.left(i) - 1);
        if (this.right(i) < end) {
          this.arrayList.unhighlight(this.right(i) - 1);
        }

        i = min_child;
      } else {
        this.highLightNodes = [];
        this.highLightEdges = [];
        this.arrayList.unhighlight(i - 1);
        this.arrayList.unhighlight(this.left(i) - 1);
        if (this.right(i) < end) {
          this.arrayList.unhighlight(this.right(i) - 1);
        }
        this.startGraph(false, "heapCanvas");
        return;
      }
    }

    this.highLightNodes = [];
    this.highLightEdges = [];
    this.arrayList.unhighlight(i - 1);
    this.startGraph(false, "heapCanvas");
  }

  async up_heap(i) {
    if (!animeRunning) {
      return;
    }

    this.highLightNodes.push(i);
    this.arrayList.highlightSwap(i - 1);
    this.startGraph(false, "heapCanvas");
    await this.pause();

    while (i > 1) {
      var p = this.parent(i);
      this.highLightNodes.push(p);
      this.arrayList.highlightSwap(i - 1);
      this.arrayList.highlight(p - 1);
      this.startGraph(false, "heapCanvas");
      await this.pause();
      if (this.cmp(this.data[i], this.data[p])) {
        this.highLightEdges.push([this.data[i].id, this.data[p].id]);

        [this.data[i].key, this.data[p].key] = [
          this.data[p].key,
          this.data[i].key
        ];

        this.arrayList.swap(i - 1, p - 1);

        this.startGraph(false, "heapCanvas");
        await this.pause();

        this.arrayList.unhighlight(i - 1);
        this.arrayList.unhighlight(p - 1);
        i = p;
      } else {
        this.highLightNodes = [];
        this.highLightEdges = [];
        this.arrayList.unhighlight(i - 1);
        this.arrayList.unhighlight(p - 1);
        this.startGraph(false, "heapCanvas");
        return;
      }
    }

    this.highLightNodes = [];
    this.highLightEdges = [];
    this.arrayList.unhighlight(i - 1);
    this.startGraph(false, "heapCanvas");
  }

  posAdjust(i) {
    if (i > 1) {
      this.data[i].parent = this.data[this.parent(i)];

      if (this.is_left(i)) {
        this.data[i].sideToParent = "left";
        this.data[i].parent.left = this.data[i];
      } else {
        this.data[i].sideToParent = "right";
        this.data[i].parent.right = this.data[i];
      }
    }

    this.data[i].setNode();

    var cur = this.data[i];
    var adjustList = [];

    while (cur && cur.parent) {
      if (
        cur.parent.sideToParent &&
        cur.sideToParent != cur.parent.sideToParent
      ) {
        adjustList.push(cur.parent);
      }

      cur = cur.parent;
    }
    this.strench(adjustList);
  }

  async insert(val) {
    var node = new treeNode(val, this.id++);

    this.data.push(node); // add the treenode

    this.arrayList.insert(new ListElem(val));

    this.posAdjust(this.data.length - 1);

    this.startGraph(false, "heapCanvas");
    await this.pause();

    await this.up_heap(this.data.length - 1);
  }

  async remove() {
    //heap is already empty
    if (this.data.length == 1) return;
    var result = this.data[1];

    this.highLightNodes.push(1);
    this.arrayList.highlightSwap(0);
    this.startGraph(false, "heapCanvas");
    await this.pause();

    // pop last element
    if (this.data.length == 2) {
      this.data.pop();
      this.arrayList.dataElems.pop();
      this.highLightNodes.pop();
      this.startGraph(false, "heapCanvas");
      await this.pause();
      return result;
    }

    this.highLightNodes.push(this.data.length - 1);
    this.arrayList.highlightSwap(this.data.length - 2);
    this.startGraph(false, "heapCanvas");
    await this.pause();

    [this.data[1].key, this.data[this.data.length - 1].key] = [
      this.data[this.data.length - 1].key,
      this.data[1].key
    ];
    this.arrayList.swap(0, this.data.length - 2);
    this.startGraph(false, "heapCanvas");
    await this.pause();

    this.data.pop();
    this.arrayList.dataElems.pop();

    this.highLightNodes.pop();

    await this.down_heap(1, this.data.length);

    return result;
  }

  //connet two nodes in the heap tree
  connectEdge(s, t) {
    this.edgeLayout.push({
      id: this.id++,
      source: s,
      target: t,
      size: 5,
      label: 0,
      type: "line",
      color: EdgeNodeCOLOR
    });
  }

  highlightEdge(s, t) {
    for (var i = 0; i < this.edgeLayout.length; i++) {
      if (this.edgeLayout[i].source == s && this.edgeLayout[i].target == t) {
        this.edgeLayout[i].color = HIGHLIGHT;
      } else if (
        this.edgeLayout[i].source == t &&
        this.edgeLayout[i].target == s
      ) {
        this.edgeLayout[i].color = HIGHLIGHT;
      }
    }
  }

  startGraph(ifEdge, container) {
    this.nodeLayout = [];
    this.edgeLayout = [];

    //add nodeLayout
    for (var i = 1; i < this.data.length; i++) {
      this.data[i].layout.label = this.data[i].key.toString();
      this.data[i].layout.color = EdgeNodeCOLOR;
      this.nodeLayout.push(this.data[i].layout);
    }

    //highlight nodes
    for (var i = 0; i < this.highLightNodes.length; i++) {
      this.nodeLayout[this.highLightNodes[i] - 1].color = HIGHLIGHT;
    }

    //add edges
    for (var i = 1; i < this.data.length; i++) {
      if (this.has_left(i)) {
        this.connectEdge(this.data[i].id, this.data[this.left(i)].id);
      }

      if (this.has_right(i)) {
        this.connectEdge(this.data[i].id, this.data[this.right(i)].id);
      }
    }

    //highlight edges
    for (var i = 0; i < this.highLightEdges.length; i++) {
      this.highlightEdge(this.highLightEdges[i][0], this.highLightEdges[i][1]);
    }

    $("#heapCanvas").empty();

    this.graph = {
      nodes: this.nodeLayout,
      edges: this.edgeLayout
    };

    this.createGraph(container);

    //draw heap array form

    canvas.clear();
    this.arrayList.draw(true);
  }
}
