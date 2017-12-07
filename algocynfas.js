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

  constructor(name = 'Data', val = null, shape = null) {
      this.name = name;
      this.val = val;
      this.shape = shape;
  }

  draw() {
  }
}


class ListElem extends DataElem {

  constructor(val, shape = null) {
      super('ListElem', val);
      this.shape = this.setShape(val);
      this.dispText = this.setText(val);
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

  setListPos(canvasWidth) {
      return canvasWidth/2 - DEF_ELEM_WIDTH * (this.dataElems.length/2);
  }

  setListElemPos(canvasWidth, elemIndex) {
      return this.setListPos(canvasWidth) + (DEF_ELEM_WIDTH + 1) * elemIndex;
  }

}

class List extends DataStructure {

  constructor(list = null) {
      super('List');
      this.setList(list);
  }

  setList(list) {
      for (var valIndex in list) {
          super.add(new ListElem(list[valIndex]));
      }
  }

  draw(canvas, x, y) {
      for (var elemIndex in this.dataElems) {
          x = super.setListElemPos(canvas.width, elemIndex)
          this.dataElems[elemIndex].draw(canvas, x, y);
          //x += DEF_ELEM_WIDTH;
      }
      canvas.renderAll();
  }
}
