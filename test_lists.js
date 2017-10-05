/**
 * Created by Vainika on 09/24/17.
 */

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
var height=parseInt(document.getElementById("canvas").getAttribute("height"));
var width=parseInt(document.getElementById("canvas").getAttribute("width"));
var position = width/2;
var arr = [];

function addCanElem(value) {
  var rect = new fabric.Rect({
    originX: 'center',
    originY: 'center',
    fill: 'red',
    width: 20,
    height: 20,
    id: value,
  });
  var strValue=String(value);
  var text= new fabric.Text(strValue, {fontSize: 10, originX: 'center', originY: 'center'});
  var group = new fabric.Group([ rect, text ], {left:position, top: 40, angle:0, id:value});
  canvas.add(group);
  position += 21;
}

function addRowElem(value, next_to = null, place = RIGHT) {
    /* If first elem, place in center. If not, we need LEFT or RIGHT. */
    // create a rectangle object
    createList(value,next_to,place);
    arr.map((item) =>
      addCanElem(item)
    );
}

function colorElem(value) {
  canvas.getObjects().map((item) =>
  item.getObjects().map((node) =>
  node.id === value ? node.set('fill','pink'): ''
  ));
}

function removeElem() {
  canvas.clear();
  position = width/2;
}

function createList(value, next_to, place) {
  removeElem();
  if(next_to) {
  var eleIndex = arr.indexOf(next_to);
  place === 'LEFT' ? arr.splice(eleIndex, 0, value) : arr.splice(eleIndex + 1, 0, value)
  } else {
   arr.push(value);
  }
}
