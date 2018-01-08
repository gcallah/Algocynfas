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
      this.delayTime = DEFAULT_DELAY;
      this.color = DEF_BG_COLOR
  }

  draw(canvas, x, y, init=false) {
  }

}


class ListElem extends DataElem {

  constructor(key, shape = null) {
      super('ListElem', key, 'Rect');
      this.shape = this.setShape();
      this.group = this.setGroup(this.shape, this.setText(this.key),
          this.key);
  }

  draw(canvas, x, y, init=false) {
      this.shape.set('fill', this.color)
      this.group.left = x;
      this.group.top = y;
      if(init) {
        canvas.add(this.group);
      }
  }

  setShape() {
      return new fabric.Rect({
          fill: this.color,
          originX: CENTER,
          originY: CENTER,
          width: DEF_ELEM_WIDTH,
          height: DEF_ELEM_HEIGHT,
      });
  }

  setText(val) {
      return new fabric.Text(String(val),
              {fontSize: DEF_FONT, originX: CENTER, originY: CENTER});
  }

  setGroup(shape, dispText, id) {
      return new fabric.Group([ shape, dispText ],
              {angle: 0, id: id});
  }

  highlight() {
      this.color = DEF_HL_COLOR
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
      return this.canvas.width/2 - DEF_ELEM_WIDTH * (this.size() / 2);
  }

  positionElem(elemIndex) {
      return null;
  }

  size() {
      return this.dataElems.length;
  }

  swap(a, b) {
      var temp;
      var eleIndexA = this.indexOf(a);
      var eleIndexB = this.indexOf(b);
      temp = this.dataElems[eleIndexA];
      this.dataElems[eleIndexA] = this.dataElems[eleIndexB];
      this.dataElems[eleIndexB] = temp;
  }

  async pause (time) {
      return new Promise(function (resolve) {
        console.log("In pause with time of ", time);
        setTimeout(resolve, time)
      })
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
      return super.getDSPos() + (DEF_ELEM_WIDTH + 1) * elemIndex;
  }

  async draw(init=false) {
      console.log(this);
      var x;
      var y = 40;
      for (var i in this.dataElems) {
          x = this.positionElem(i);
          await this.dataElems[i].draw(this.canvas, x, y, init);
      }
      this.canvas.renderAll();
      await super.pause(this.delayTime);
  }

  highlight(key) {
      this.dataElems[super.indexOf(key)].highlight();
  }

  async pause (time) {
      this.delayTime = time;
      await super.pause(this.delayTime);
  }
}
