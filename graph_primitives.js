/**
 * Created by Varun on 15/08/17.
 * This file contains priitives common to graph animations.
 */

const CENTER = 'center'
var canvas = new fabric.Canvas('canvas')
var height = parseInt(document.getElementById('canvas').getAttribute('height'))
var width = parseInt(document.getElementById('canvas').getAttribute('width'))
var nodeDist = width / 4
var radius = DEF_ELEM_WIDTH / 2
var topStart = radius + 10
var lineLimit = nodeDist - 20


function getCoordinates(angle, initialX, initialY) {
    var coords = {}
    coords.nodeX = Math.abs(Math.cos(angle * Math.PI / 180) * nodeDist + initialX)
    coords.nodeY = Math.abs(Math.sin(angle * Math.PI / 180) * nodeDist - initialY)
    coords.lineX1 = Math.abs(Math.cos(angle * Math.PI / 180) * radius + initialX)
    coords.lineY1 = Math.abs(Math.sin(angle * Math.PI / 180) * radius - initialY)
    coords.lineX2 = Math.abs(Math.cos(angle * Math.PI / 180) * lineLimit + initialX)
    coords.lineY2 = Math.abs(Math.sin(angle * Math.PI / 180) * lineLimit - initialY)
    return coords
}

async function unhighlight (node) {
  await delay(DEFAULT_DELAY)
  node.set({ fill: DEF_BG_COLOR})
}

async function highlight (node) {
  node.set({ fill: DEF_HL_COLOR})
  await delay(DEFAULT_DELAY)
}

async function drawNode(key, nodeX, nodeY) {
  var newNode = new fabric.Circle(
                        {   id:key,
                            radius: radius,
                            left: nodeX,
                            top: nodeY,
                            originX: CENTER,
                            originY: CENTER,
                            fill: DEF_BG_COLOR
                        }
  )
  var text = new fabric.Text(String(key),
                        {
                            fontSize: DEF_FONT,
                            left: nodeX,
                            top: nodeY,
                            originX: CENTER,
                            originY: CENTER
                        }
  )
  await delay(DEFAULT_DELAY)
  canvas.add(newNode)
  canvas.add(text)
  return newNode
}

async function getobject(key) {
    var objects=canvas.getObjects();
    for(i=0;i<objects.length;i++){
        if(objects[i].id==key){
              return objects[i]
        }
    }
}


async function addRoot(key) {
    return drawNode(key, width / 2, topStart)
}

async function addChild(parentNode, key, angle) {
  parentNode=await getobject(parentNode);
  var coordinates = getCoordinates(angle,
          parseInt(parentNode.left), parseInt(parentNode.top))
  newNode = drawNode(key, coordinates.nodeX, coordinates.nodeY)
  await delay(DEFAULT_DELAY)
  addline(coordinates.lineX1, coordinates.lineY1,
          coordinates.lineX2, coordinates.lineY2)
  return newNode
}

function addline (x1, y1, x2, y2) {
  console.log('In addline')
  var line = new fabric.Line([x1, y1, x2, y2],
          {stroke: 'black', originX: CENTER, originY: CENTER})
  canvas.add(line)
}

/*
elements = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

                  0
                /   \
               1     2
              /\     /\
             3  4   5  6
            78 910 1112 1314
          15
*/

async function createBT(elements){
  // Since the height of BT would be logN at atmost
  let limit = Math.log(elements.length) / Math.log(2);
  limit = Math.floor(limit);
  let offset = 90;
  await addRoot(elements[0]);
  let i = 0, j = 0;
  let count = 0;
  visited = [];
  console.log(limit)
  while (i < elements.length && count < elements.length){
    
    for (j = 0; j <= i; j++){
      if ((2*i - j + 1) in visited || (2*i -j +2) in visited || elements.indexOf(i+j) == "-1"){
        console.log(elements.indexOf(i+j));
        continue
      }
      else{
        if (elements[2*i -j + 1] != undefined && elements[2*i -j + 1] != null)
          await addChild(elements[i+j], elements[2*i -j +1], 230 + ((i)*5));
        if (elements[2*i -j + 2] != undefined && elements[2*i -j + 2] != null)
          await addChild(elements[i+j], elements[2*i -j +2], 230 + offset - ((i)*5));
        visited.push(2*i - j + 1);
        visited.push(2*i - j + 2);
        count += 2
      
      }
    }
    i += 1;
  }
}

