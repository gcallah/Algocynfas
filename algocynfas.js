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
    super('ListElem', val)
    this.shape = new fabric.Rect({
        fill: DEF_BG_COLOR,
        width: DEF_ELEM_WIDTH,
        height: DEF_ELEM_HEIGHT,
        id: val,
    });
    this.dispText = new fabric.Text(String(val),
            {fontSize: DEF_FONT, originX: CENTER, originY: CENTER});
    this.group = new fabric.Group([ this.shape, this.dispText ],
                    {left: 400, top: 40, angle: 0, id: val});
  }

  draw(canvas, x, y) {
      this.shape.originX = CENTER;
      this.shape.originY = CENTER;
      canvas.add(this.group)
  }
}

class DataStructure extends DataElem {
  constructor() {
    super('DataStructure')
    this.dataElems = []
  }

  add(elem) {
    this.dataElems.push(elem)
  }
}

class List extends DataStructure {
  constructor(list = null) {
    super();
    this.setList(list);
  }

  setList(list) {
      for (var valIndex in list) {
          super.add(new ListElem(list[valIndex]))
      }
  }

  draw(canvas, x, y) {
    for (var elemIndex in this.dataElems) {
        this.dataElems[elemIndex].draw(canvas, x, y)
        x += DEF_ELEM_WIDTH
    }
    canvas.renderAll()
  }
}
