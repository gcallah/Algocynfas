/**
 * Created by Vainika on 09/24/17.
 */

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const HORIZ = 0;
const VERTICAL = 1;

var height = parseInt(document.getElementById("canvas").getAttribute("height"));
var width = parseInt(document.getElementById("canvas").getAttribute("width"));
const DEF_LIST_START_POS = width / 2;
var listStartPos = DEF_LIST_START_POS
var currListPos = listStartPos
var topPos = Math.floor(width / 10)
var arr = [];
var k = 1;

function addCanvasElem(value) {
    var rect = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        fill: DEF_BG_COLOR,
        width: DEF_ELEM_WIDTH,
        height: DEF_ELEM_HEIGHT,
        id: value,
    });
    var strValue = String(value);
    var text = new fabric.Text(strValue,
            {fontSize: DEF_FONT, originX: 'center', originY: 'center'});
    var group = new fabric.Group([ rect, text ],
            {left: currListPos, top: topPos, angle: 0, id: value});
    canvas.add(group);
    currListPos += DEF_ELEM_WIDTH + 1;
}

function addRowElem(value, next_to = null, place = RIGHT) {
    /* If first elem, place in center. If not, we need LEFT or RIGHT. */
    // create a rectangle object
    resetCanvas();
    redrawList(value, next_to, place);
    drawCanvas();
}

function drawCanvas() {
    currListPos = calListPos(width);
    arr.map((item) =>
      addCanvasElem(item)
    );

}

async function highlight(value) {
    canvas.getObjects().map((item) =>
        item.getObjects().map((node) =>
            node.id === value ? node.set('fill', DEF_HL_COLOR): ''));
    canvas.renderAll();
    await delay(DEFAULT_DELAY);
}

function resetCanvas() {
    canvas.clear();
    canvas.setWidth(width);
}

function redrawList(value, next_to, place) {
    if(next_to) {
        var eleIndex = arr.indexOf(next_to);
        place === 'LEFT' ? arr.splice(eleIndex, 0, value) :
            arr.splice(eleIndex + 1, 0, value)
    } else {
        arr.push(value);
    }
}

async function displayList(array, orientation=HORIZ) {
    resetCanvas();
    createList(array);
    drawCanvas();
    await delay(DEFAULT_DELAY);
}

function createList(array) {
    arr = [];
    for(i in array) {
        arr.push(parseInt(array[i]));
    }
}

async function swapElem(a, b) {
    await highlight(a);
    await highlight(b);
    var temp;
    var eleIndexA = arr.indexOf(a);
    var eleIndexB = arr.indexOf(b);
    temp = arr[eleIndexA];
    arr[eleIndexA] = arr[eleIndexB];
    arr[eleIndexB] = temp;
    return [b, a];
}

async function highlightKey(value) {
    canvas.getObjects().map((item) =>
        item.getObjects().map((node) =>
            node.id === value ? node.set('fill', DEF_HLK_COLOR): ''));
    canvas.renderAll();
    await delay(DEFAULT_DELAY);
}

function calListPos(width){
  var listPos = listStartPos;
  listPos = (width/2) - DEF_ELEM_WIDTH * (arr.length/2);
  return listPos;
}
