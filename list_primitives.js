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
var listStartPos = DEF_LIST_START_POS;
var currListPos = listStartPos;
var topPos = Math.floor(width / 10);
var arr = [];
var k = 1;
var hashTable = false;

function addCanvasElem(value, orientation) {
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
    orientation === 0 ? currListPos += DEF_ELEM_WIDTH + 1 : topPos += DEF_ELEM_HEIGHT + 1;
}

function addRowElem(value, next_to = null, place = RIGHT) {
    /* If first elem, place in center. If not, we need LEFT or RIGHT. */
    // create a rectangle object
    resetCanvas();
    redrawList(value, next_to, place);
    drawCanvas();
}

function drawCanvas(orientation) {
    currListPos = calListPos(width, orientation);
    arr.map((item) =>
      addCanvasElem(item, orientation)
    );

}

async function highlight(value) {
    canvas.getObjects().map((item) =>
        item.getObjects().map((node) =>
            node.id === value ? node.set('fill', DEF_HL_COLOR): ''));
    canvas.renderAll();
    await delay(delayTime);
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

async function displayList(array, orientation = HORIZ) {
    hashTable ? '' : resetCanvas();
    createList(array);
    drawCanvas(orientation);
    await delay(delayTime);
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
    displayList(arr);
    await highlightSwap(a, b);
    return [b, a];
}

async function highlightKey(value) {
    canvas.getObjects().map((item) =>
        item.getObjects().map((node) =>
            node.id === value ? node.set('fill', DEF_HLK_COLOR): ''));
    canvas.renderAll();
    await delay(delayTime);
}

function calListPos(width, orientation) {
  var listPos = listStartPos;
  orientation === 0 ? listPos = (width/2) - DEF_ELEM_WIDTH * (arr.length/2) : listPos = DEF_LIST_START_POS;
  hashTable ? listPos = currListPos : '';
  return listPos;
}

async function highlightSwap(a, b) {
    if(arguments.length === 2) {
      canvas.getObjects().map((item) =>
          item.getObjects().map((node) => {
                node.id === a ? node.set('fill', SWAP_COLOR): '';
                node.id === b ? node.set('fill', SWAP_COLOR): '';
              }));
    } else {
      canvas.getObjects().map((item) =>
          item.getObjects().map((node) => {
                node.id === a ? node.set('fill', SWAP_COLOR): ''
              }));
    }
    canvas.renderAll();
    await delay(delayTime);
}

function addArrow() {
    var currListNewPos = DEF_LIST_START_POS + DEF_ELEM_WIDTH + 10;
    var linePos = topPos + DEF_ELEM_HEIGHT / 2;
    var line = new fabric.Line([currListNewPos, linePos, currListNewPos + 100, linePos],
            {stroke: 'black', originX: 'center', originY: 'center'})
    canvas.add(line);
    currListPos = currListNewPos + 110;
 }

 function displayHashTable(table) {
     hashTable = true;
     var indices = []
     console.log("Table length = ", table.table_size);
     for(i = 0; i < table.table_size; i++) {
        console.log("In table loop");
        indices.push(i);
     }
     console.log("Indices = ", indices)
     displayList(indices, VERTICAL);
     calTopPos();
     table.values.map((items, index) => {
        addArrow();
        var listFinal = [];
        for(j in items) {
          j != 0 ? listFinal.push(items[j]) : '';
        }
        displayList(listFinal);
        topPos += DEF_ELEM_HEIGHT + 1;
      });
 }

function calTopPos(){
    topPos = Math.floor(width / 10);
}

function addText(text){
    var text = new fabric.Text(strValue,
            {fontSize: DEF_FONT, originX: 'center', originY: 'center'});
    canvas.add(text);
}
