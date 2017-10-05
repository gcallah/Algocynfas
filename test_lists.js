/**
 * Created by Vainika on 09/24/17.
 */

const LEFT = 0;
const RIGHT = 1;

var height=parseInt(document.getElementById("canvas").getAttribute("height"));
var width=parseInt(document.getElementById("canvas").getAttribute("width"));
var position = width/2;

function addRowElem(value, next_to = null, place = RIGHT) {
    /* If first elem, place in center. If not, we need LEFT or RIGHT. */
    // create a rectangle object
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
    var group = new fabric.Group([ rect, text ], {left:position, top: 40, angle:0,});
    canvas.add(group);
    position += 21;
    return group;
}

function colorElem(value) {
  canvas.getObjects().map((item) =>
  item.getObjects().map((node) =>
  node.id === value ? node.set('fill','pink'): ''
  ));
}

function createList()
{
}
