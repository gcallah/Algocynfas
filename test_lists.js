/**
 * Created by Vainika on 09/24/17.
 */

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DEFAULT_DELAY = 2000; // in milliseconds

var height = parseInt(document.getElementById("canvas").getAttribute("height"));
var width = parseInt(document.getElementById("canvas").getAttribute("width"));
var position = width/2;
var arr = [];

function addCanvasElem(value) {
    var rect = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        fill: 'red',
        width: 30,
        height: 30,
        id: value,
    });
    var strValue = String(value);
    var text = new fabric.Text(strValue, {fontSize: 10, originX: 'center', originY: 'center'});
    var group = new fabric.Group([ rect, text ], {left: position, top: 40, angle: 0, id: value});
    canvas.add(group);
    position += 31;
}

function addRowElem(value, next_to = null, place = RIGHT) {
    /* If first elem, place in center. If not, we need LEFT or RIGHT. */
    // create a rectangle object
    resetCanvas();
    redrawList(value, next_to, place);
    drawCanvas();
}

function drawCanvas() {
    arr.map((item) =>
      addCanvasElem(item)
    );
}

function highlight(value) {
    canvas.getObjects().map((item) =>
    item.getObjects().map((node) =>
    node.id === value ? node.set('fill', 'pink'): ''
    ));
}

function resetCanvas() {
    canvas.clear();
    position = width/2;
}

function redrawList(value, next_to, place) {
    if(next_to) {
        var eleIndex = arr.indexOf(next_to);
        place === 'LEFT' ? arr.splice(eleIndex, 0, value) : arr.splice(eleIndex + 1, 0, value)
    } else {
        arr.push(value);
    }
}

function displayList(array) {
    createList(array);
    drawCanvas();
}

function createList(array) {
    for(i in array) {
        arr.push(parseInt(array[i]));
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function swapElem(a, b) {
    highlight(a);
    highlight(b);
    await delay(DEFAULT_DELAY);
    var temp;
    var eleIndexA = arr.indexOf(a);
    var eleIndexB = arr.indexOf(b);
    temp = arr[eleIndexA];
    arr[eleIndexA] = arr[eleIndexB];
    arr[eleIndexB] = temp;
    resetCanvas();
    drawCanvas();
    highlight(a);
    highlight(b);
}
