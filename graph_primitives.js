/**
 * Created by Varun on 15/08/17.
 * This file contains priitives common to graph animations.
 */
var canvas = new fabric.Canvas('canvas')
var height = parseInt(document.getElementById('canvas').getAttribute('height'))
var width = parseInt(document.getElementById('canvas').getAttribute('width'))
var distance = 200
var radius = 20
var linelimit = 180


function calculate (angle, initialx, initialy) {
  var pointx = Math.abs(Math.cos(angle * Math.PI / 180) * distance + initialx)
  var pointy = Math.abs(Math.sin(angle * Math.PI / 180) * distance - initialy)
  var initiallinex = Math.abs(Math.cos(angle * Math.PI / 180) * radius + initialx)
  var initialliney = Math.abs(Math.sin(angle * Math.PI / 180) * radius - initialy)
  var finallinex = Math.abs(Math.cos(angle * Math.PI / 180) * linelimit + initialx)
  var finalliney = Math.abs(Math.sin(angle * Math.PI / 180) * linelimit - initialy)
  var result = [pointx, pointy, initiallinex, initialliney, finallinex, finalliney]
  return result
}

async function unhighlight (node) {
  await delay(delaytime)
  node.set({ fill: 'yellow'})
}
async function highlight (node) {
  node.set({ fill: 'yellow'})
  var x = await delay(delaytime)
}

async function addRoot (value) {
  var value = String(value)
  var x = new fabric.Circle({radius: radius, left: width / 2, fill: 'red', top: radius, originX: 'center', originY: 'center', fill: 'red'})
  var text = new fabric.Text(value, {fontSize: 10, originX: 'center', originY: 'center', left: width / 2, top: radius})
  var temp = await delay(1000)
  canvas.add(x)
  canvas.add(text)
  return x
}

function addline (x1, y1, x2, y2) {
  console.log('In addline')
  var line = new fabric.Line([x1, y1, x2, y2], {stroke: 'black', originX: 'center', originY: 'center'})
  canvas.add(line)
}

async function addNode (node1, node2, angle) {
  var initialx = parseInt(node1.left)
  var initialy = parseInt(node1.top)
  var drawvalues = calculate(angle, initialx, initialy)
  pointx = drawvalues[0]
  pointy = drawvalues[1]
  initiallinex = drawvalues[2]
  initialliney = drawvalues[3]
  finallinex = drawvalues[4]
  finalliney = drawvalues[5]
  var x = new fabric.Circle({ radius: radius, originX: 'center', originY: 'center', fill: 'red', left: pointx, top: pointy})
  var value1 = String(node2)
  var text = new fabric.Text(value1, {fontSize: 10, originX: 'center', originY: 'center', left: pointx, top: pointy})
  var temp = await delay(1000)
  canvas.add(x)
  canvas.add(text)
  var temp = await delay(1000)
  addline(initiallinex, initialliney, finallinex, finalliney)
  return x
}
