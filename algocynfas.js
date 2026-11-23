/**
 * algocynfas.js: a library of routines for animating algorithms.
 * Created by Vainika and Prof. C on 12/01/17.
 */

 const DEFAULT_DELAY = 1000;
 const DEF_ELEM_HEIGHT = 60;
 const DEF_ELEM_WIDTH = 60;
 const PCT_FONT_BOX = .72;
 const DEF_FONT = Math.floor(DEF_ELEM_HEIGHT * PCT_FONT_BOX);
 const DEF_BG_COLOR = '#e3e8ec';
 const DEF_HL_COLOR = '#a6dfe8';
 const DEF_HLK_COLOR = '#0073e6';
 const SWAP_COLOR = '#cbb8ea';
 const LEFT = 'LEFT';
 const RIGHT = 'RIGHT';
 const CENTER = 'center';
 const DEF_X = 40;
 const DEF_Y = 40;
 const HORIZ = 0;
 const VERTICAL = 1;
 const HashTableMargin = 10;
 const DEF_FONT_FAMILY = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
// How boxes and their numbers look: rounded corners, a faint outline and a soft shadow.
const BOX_STYLE = {rx: 7, ry: 7, stroke: 'rgba(28, 40, 51, 0.22)', strokeWidth: 1,
                   shadow: 'rgba(20, 40, 60, 0.22) 0px 2px 4px'};
const CELL_STYLE = {rx: 4, ry: 4, stroke: 'rgba(28, 40, 51, 0.12)', strokeWidth: 1};
const TEXT_STYLE = {fontFamily: DEF_FONT_FAMILY, fontWeight: '600', fill: '#1c2833'};


 // Shrink the font for keys longer than two characters so they stay inside the box.
 function fitFont(val) {
   var len = String(val).length;
   return len > 2 ? Math.floor(DEF_FONT * 1.7 / len) : len == 2 ? Math.floor(DEF_FONT * 0.85) : DEF_FONT;
 }

 class DataElem {

  constructor(name = 'Data', key = null, shape = null, orientation = HORIZ) {
    this.name = name;
    this.key = key;
    this.shape = shape;
    this.delayTime = DEFAULT_DELAY;
    this.color = DEF_BG_COLOR;
    this.orientation = orientation;
  }

  draw(canvas, x, y, init=false) {
  }

  reOrder() {
  }

  getKey() {
    return this.key;
  }

  setDelay(newDelay) {
    this.delayTime = newDelay;
  }
}


class ListElem extends DataElem {

  constructor(key, shape = null) {
    super('ListElem', key, 'Rect');
    this.shape = this.setShape();
    this.text = this.setText(this.key);
    this.group = this.setGroup(this.shape, this.text, this.key);
  }
  draw(canvas, x, y, init=false) {
    if(init) {
      this.shape.set('fill', this.color);
      this.text = this.setText(this.key);
      this.group = this.setGroup(this.shape, this.text, this.key);
      this.group.left = x;
      this.group.top = y;
      canvas.add(this.group);
      return;
    }
    this.shape.set('fill', this.color);
    this.group.left = x;
    this.group.top = y;
  }

  setShape() {
    return new fabric.Rect({
      fill: this.color,
      originX: CENTER,
      originY: CENTER,
      // A little smaller than the slot, so neighbouring boxes don't touch.
      width: DEF_ELEM_WIDTH - 5,
      height: DEF_ELEM_HEIGHT - 5,
      ...BOX_STYLE,
    });
  }

  setText(val) {
    return new fabric.Text(String(val),
      {fontSize: fitFont(val), ...TEXT_STYLE, originX: CENTER, originY: CENTER});
  }

  // Change the key shown in this box (for algorithms that write into arrays).
  setKey(key) {
    this.key = key;
    this.text.set({text: String(key), fontSize: fitFont(key)});
    this.group.set('dirty', true);
  }

  setGroup(shape, dispText, id) {
    return new fabric.Group([ shape, dispText ],
      {angle: 0, id: id});
  }

  highlight() {
    this.setColor(DEF_HL_COLOR);
  }

  unhighlight() {
    this.setColor(DEF_BG_COLOR);
  }

  highlightSwap() {
    this.setColor(SWAP_COLOR);
  }

  setColor(color) {
    this.color = color;
  }

  reOrder() {
  }

}

class DataStructure extends DataElem {

  constructor(name, canvas) {
    super('DataStructure');
    this.dataElems = [];
    this.canvas = canvas;
  }

  insert(elem) {
    this.dataElems.push(elem);
  }

  elemAt(index) {
    return this.dataElems[index]
  }

  indexOf(key) {
    for (var i in this.dataElems) {
      if(this.dataElems[i].key === key) {
        return i;
      }
    }
    return -1;
  }

  remove(key) {
    var i = this.indexOf(key);
      // removing from the dataElems
      if(i >= 0) {
        this.dataElems.splice(i, 1)
      }
      //removing from the convas
      this.canvas.getObjects().map((node) => {
        node.id === key ? this.canvas.remove(node) : '';
      });
    }


    getDSPos() {
      return this.orientation === HORIZ ?
      (this.canvas.width / 2 - DEF_ELEM_WIDTH * (this.size() / 2)):
      this.canvas.height / 2 - DEF_ELEM_HEIGHT * (this.size() / 2);
    }

    positionElem(elemIndex) {
      return null;
    }

    size() {
      return this.dataElems.length;
    }

    sliceToHalf(){
      
    }

    swap(i, j) {
      var temp;
      temp = this.dataElems[i];
      this.dataElems[i] = this.dataElems[j];
      this.dataElems[j] = temp;
    }

    async pause (time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time)
      })
    }

    [Symbol.iterator]() {
      let index = 0;
      return {
        next: () => {
          let value = this.dataElems[index];
          let done = index >= this.dataElems.length;
          index++;
          return { value, done };
        }
      };
    };

// for debugging:
iterator() {
  let iterator = this.dataElems[Symbol.iterator]();
  console.log(iterator.next());
      // for (let item, val of this.dataElems) {
      //     console.log(item, val);
      // }
    }
  }

  class List extends DataStructure {

    constructor(canvas, list = null) {
      
      super('List', canvas);
      this.list = list;
      this.setList(this.list);
    }

    setList(list) {
      for (var index in this.list) {
        super.insert(new ListElem(list[index]));
      }
    }

    positionElem(elemIndex) {
      return this.orientation == HORIZ ?
      [this.getDSPos() + (DEF_ELEM_WIDTH + 1) * elemIndex, DEF_Y]
      : [DEF_X, this.getDSPos() + (DEF_ELEM_HEIGHT + 1) * elemIndex];
    }

    async draw(init=false, orientation=HORIZ) {
      var x, y;
      if(init) {
        this.orientation = orientation;
      }
      if(this.dataElems != []){
        for (var i in this.dataElems) {
          [x, y] = this.positionElem(i);
          await this.dataElems[i].draw(this.canvas, x, y, init);
        }
      }
      this.canvas.renderAll();
      await super.pause(this.delayTime);
    }

    highlight(i, j=0) {
      var k = i;
      do {
        this.dataElems[k].highlight();
        k++;
      }
      while (k <= j);
    }


    unhighlight(i, j=0) {
      var k = i;
      do {
        this.dataElems[k].unhighlight();
        k++;
      }
      while (k <= j);
    }

    highlightSwap(i) {
      this.dataElems[i].highlightSwap();
    }

    async pause (time) {
      this.delayTime = time;
      await super.pause(this.delayTime);
    }

    removeAll(){
      this.canvas.clear();
    }

    // Write a new key into slot i (e.g. B[i] = A[j] in counting sort).
    setKey(i, key) {
      this.dataElems[i].setKey(key);
    }

    // Colour one slot with any colour (e.g. to mark a found item).
    colorElem(i, color) {
      this.dataElems[i].setColor(color);
    }

    // Colour every slot with the default background.
    unhighlightAll() {
      for (var elem of this.dataElems) {
        elem.unhighlight();
      }
    }

    // Write the index under each box. CLRS arrays start at 1, so start = 1 by default.
    drawIndices(start = 1) {
      this._removeTagged('index');
      for (var i = 0; i < this.size(); i++) {
        var [x, y] = this.positionElem(i);
        this.canvas.add(new fabric.Text(String(i + start), {
          left: x + DEF_ELEM_WIDTH / 2, top: y + DEF_ELEM_HEIGHT + 4,
          originX: CENTER, fontSize: 14, fill: '#5b6770',
          fontFamily: DEF_FONT_FAMILY, selectable: false, tag: 'index'}));
      }
    }

    // Label slots with pointer names above them, e.g. {p: 0, q: 3, r: 7}.
    // Pass {} to clear the labels.
    setMarkers(markers) {
      this._removeTagged('marker');
      var byIndex = {};
      for (var name in markers) {
        var i = markers[name];
        if (i === null || i === undefined || i < 0 || i >= this.size()) continue;
        (byIndex[i] = byIndex[i] || []).push(name);
      }
      for (var i in byIndex) {
        var [x, y] = this.positionElem(i);
        this.canvas.add(new fabric.Text(byIndex[i].join(','), {
          left: x + DEF_ELEM_WIDTH / 2, top: y - 24,
          originX: CENTER, fontSize: 16, fontWeight: 'bold', fill: '#6b4fa0',
          fontFamily: DEF_FONT_FAMILY, selectable: false, tag: 'marker'}));
      }
    }

    // Write a name to the left of the array, e.g. "A" or "C".
    drawName(name) {
      this._removeTagged('name');
      var [x, y] = this.positionElem(0);
      this.canvas.add(new fabric.Text(name, {
        left: x - 12, top: y + DEF_ELEM_HEIGHT / 2, originX: 'right', originY: CENTER,
        fontSize: 22, fontWeight: 'bold', fill: '#1c2833',
        fontFamily: DEF_FONT_FAMILY, selectable: false, tag: 'name'}));
    }

    _removeTagged(tag) {
      for (var obj of this.canvas.getObjects().slice()) {
        if (obj.tag === tag) this.canvas.remove(obj);
      }
    }
  }


  class HashTable extends List {


    constructor(canvas, list = null) {
      super(canvas, list);
      if(list!=null){
        for(var i=0; i<list.length; i++)
        {
          super.highlight(i);
        }
        var len = list.length; 
        this.HeadLists=[];
        while(len!=0){
          this.HeadLists.push([]);
          len-=1;
        }

      }
    }

    getDSPos() {
      return this.orientation === HORIZ ?
      (this.canvas.width / 2 - DEF_ELEM_WIDTH * (this.size() / 2)):HashTableMargin;
    }
    
    setHList(ListWHead_index, value){
      this.canvas.clear();
      super.draw(true,orientation=VERTICAL);
      this.HeadLists[ListWHead_index].push(value);
      for(var i=0; i<this.HeadLists.length;i++){
        if (this.HeadLists[i].length>14)
        {
          noticeErr("Sorry we are unable to handle these many items in one chain!");
        }
        createListWithHead(this.canvas,this.HeadLists[i], i);
      }
      
    }

    setHValue(ListWHead_index, value){
      this.canvas.clear();
      super.draw(true,orientation=VERTICAL);
      for(var i = ListWHead_index ; i<ListWHead_index+this.list.length ; i++)
      {
        if(this.HeadLists[i%(this.list.length)].length==0)
        {
          this.HeadLists[i%(this.list.length)].push(value);
          break;
        }
      }

      for(var i=0; i<this.HeadLists.length;i++){
        createListWithHead(this.canvas,this.HeadLists[i], i);
      }
      
    }
  }

  class ListWithHead extends List{
    constructor(canvas, list = null, head = 0 ){
      super(canvas,list);
      this.Head = head;
        this.line=new Line(); // draw a line between the hash indedx and the hashed values
        this.line.draw(this.canvas, 100, 15 + (head * (DEF_ELEM_HEIGHT + 1)) , true); //tried value to adjust the line position
      } 

      getDSPos() {
        return this.orientation === HORIZ ?
        150:
        this.canvas.height / 2 - DEF_ELEM_HEIGHT * (this.size() / 2);
      }

      positionElem(elemIndex) {
        return this.orientation == HORIZ ?
        [this.getDSPos() + (DEF_ELEM_WIDTH + 1) * elemIndex, (HashTableMargin+this.Head*(DEF_ELEM_HEIGHT + 1))]
        : [DEF_X, this.getDSPos() + (DEF_ELEM_HEIGHT + 1) * elemIndex];
      }


    }

    class Line extends ListElem{
      constructor() {
        super(" ");
      }

      draw(canvas, x, y, init=false) {
        this.shape.set('fill', "black")
        this.group.left = x;
        this.group.top = y;
        if(init) {
          canvas.add(this.group);
        }
      }

      setShape(){
       return new fabric.Rect({
        fill: DEF_HLK_COLOR,
        originX: CENTER,
        originY: CENTER,
        width: 40,
        height: 3,   
      });

     }
     
   }
  /**
   * Grid: a 2-D table of boxes, for dynamic-programming tables and matrices
   * (e.g. the c table of LCS-LENGTH or the D matrices of Floyd-Warshall).
   * Rows and columns are 0-based here; labels say what the reader sees.
   */
  class Grid {
    constructor(canvas, rows, cols, opts = {}) {
      this.canvas = canvas;
      this.rows = rows;
      this.cols = cols;
      this.cellW = opts.cellW || 48;
      this.cellH = opts.cellH || 38;
      this.fontSize = opts.fontSize || 18;
      // Leave room on the left and top for the labels.
      this.x0 = opts.x0 !== undefined ? opts.x0 : 70;
      this.y0 = opts.y0 !== undefined ? opts.y0 : 56;
      this.cells = [];
      for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < cols; c++) {
          row.push(this._makeCell(r, c));
        }
        this.cells.push(row);
      }
    }

    _makeCell(r, c) {
      var rect = new fabric.Rect({
        fill: DEF_BG_COLOR, originX: CENTER, originY: CENTER,
        width: this.cellW, height: this.cellH, ...CELL_STYLE});
      var text = new fabric.Text(' ', {
        fontSize: this.fontSize, ...TEXT_STYLE,
        originX: CENTER, originY: CENTER});
      var group = new fabric.Group([rect, text], {
        left: this.x0 + c * (this.cellW + 1), top: this.y0 + r * (this.cellH + 1),
        selectable: false});
      this.canvas.add(group);
      return {rect: rect, text: text, group: group, key: null, color: DEF_BG_COLOR};
    }

    setKey(r, c, key) {
      var cell = this.cells[r][c];
      cell.key = key;
      cell.text.set({text: String(key)});
      cell.group.set('dirty', true);
    }

    getKey(r, c) {
      return this.cells[r][c].key;
    }

    colorCell(r, c, color) {
      var cell = this.cells[r][c];
      cell.color = color;
      cell.rect.set('fill', color);
      cell.group.set('dirty', true);
    }

    uncolorAll() {
      for (var r = 0; r < this.rows; r++) {
        for (var c = 0; c < this.cols; c++) {
          this.colorCell(r, c, DEF_BG_COLOR);
        }
      }
    }

    // Labels above the columns and left of the rows. Each label may have up to
    // two lines, e.g. "j=3\nB" for an index and a character.
    setLabels(rowLabels, colLabels) {
      for (var obj of this.canvas.getObjects().slice()) {
        if (obj.tag === 'gridLabel') this.canvas.remove(obj);
      }
      var style = {fontSize: 14, fontFamily: DEF_FONT_FAMILY, fill: '#5b6770',
                   selectable: false, tag: 'gridLabel', textAlign: CENTER};
      colLabels.forEach((label, c) => this.canvas.add(new fabric.Text(String(label), Object.assign({
        left: this.x0 + c * (this.cellW + 1) + this.cellW / 2, top: this.y0 - 6,
        originX: CENTER, originY: 'bottom'}, style))));
      rowLabels.forEach((label, r) => this.canvas.add(new fabric.Text(String(label), Object.assign({
        left: this.x0 - 8, top: this.y0 + r * (this.cellH + 1) + this.cellH / 2,
        originX: 'right', originY: CENTER}, style))));
    }

    draw() {
      this.canvas.renderAll();
    }
  }

   function createList(canvas, list) {
    l = new List(canvas, list);
    l.draw(true);
    return l;
  }

  function createHashTable(canvas, list) {
    l = new HashTable(canvas, list);
    l.draw(true, orientation=VERTICAL);
    return l;
  }

  function createListWithHead(canvas, list, head){
    l = new ListWithHead(canvas, list , head);
    l.draw(true);
    return l;
  }

