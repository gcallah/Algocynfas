/**
 * algocynfas.js: a library of routines for animating algorithms.
 * Created by Vainika and Prof. C on 12/01/17.
 */

const DEFAULT_DELAY = 2000;
const DEF_ELEM_HEIGHT = 60;
const DEF_ELEM_WIDTH = 60;
const PCT_FONT_BOX = .72;
const DEF_FONT = Math.floor(DEF_ELEM_HEIGHT * PCT_FONT_BOX);
const DEF_BG_COLOR = '#ffff99';
const DEF_HL_COLOR = '#99ccff';
const DEF_HLK_COLOR = '#0073e6';
const SWAP_COLOR = '#ffb380';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const CENTER = 'center';

const HORIZ = 0;
const VERTICAL = 1;


class DataElem {

  constructor(name = 'Data', key = null, shape = null) {
      this.name = name;
      this.key = key;
      this.shape = shape;
  }

  draw() {
  }
}


class ListElem extends DataElem {

  constructor(key, shape = null) {
      super('ListElem', key);
      this.shape = this.setShape(key);
      this.dispText = this.setText(key);
      this.group = this.setGroup(this.shape, this.dispText);
  }

  draw(canvas, x, y) {
      canvas.add(this.setGroup(this.shape, this.dispText, x, y));
  }

  setShape(id) {
      return new fabric.Rect({
          fill: DEF_BG_COLOR,
          originX: CENTER,
          originY: CENTER,
          width: DEF_ELEM_WIDTH,
          height: DEF_ELEM_HEIGHT,
          id: id,
      });
  }

  setText(val) {
      return new fabric.Text(String(val),
              {fontSize: DEF_FONT, originX: CENTER, originY: CENTER});
  }

  setGroup(shape, dispText, x) {
      return new fabric.Group([ shape, dispText ],
                      {left: x, top: 40, angle: 0});
  }
}

class DataStructure extends DataElem {

  constructor() {
      super('DataStructure');
      this.dataElems = [];
  }

  add(elem) {
      this.dataElems.push(elem);
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
      console.log("Trying to remove elem ", key, " at pos ", i)
      if(i >= 0) {
        console.log("Removing elem ", key, " at pos ", i)
        this.dataElems.splice(i, 1)
      }
  }

  getDSPos(canvasWidth) {
      return canvasWidth/2 - DEF_ELEM_WIDTH * (this.size() / 2);
  }

  positionElem(canvasWidth, elemIndex) {
      return null;
  }

  size() {
      return this.dataElems.length
  }
}

class List extends DataStructure {

  constructor(list = null) {
      super('List');
      this.setList(list);
  }

  setList(list) {
      for (var index in list) {
          super.add(new ListElem(list[index]));
      }
  }

  positionElem(canvasWidth, elemIndex) {
      return super.getDSPos(canvasWidth) + (DEF_ELEM_WIDTH + 1) * elemIndex;
  }

  draw(canvas, x, y) {
      for (var i in this.dataElems) {
          x = this.positionElem(canvas.width, i)
          // console.log("Drawing elem: ", i, " at pos x: ", x, ", y: ", y)
          this.dataElems[i].draw(canvas, x, y);
          i++;
      }
      canvas.renderAll();
  }
}
