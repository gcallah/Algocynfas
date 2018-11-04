
class GraphicElems { // an abstract class

  constructor() {
    if (this.constructor === GraphicElems) {
      throw new TypeError('Abstract class "GrapicElems" cannot be instantiated directly.');
    }
    this.object = null;
  }

  draw(canvas) {
    canvas.add(this.object);
  }

  getX() {
    return this.object.left;
  }

  getY() {
    return this.object.top;
  }
    
  rotate(angle) {
    this.object.rotate(angle);
  }

  setAngle(angle) {
      this.object.angle = angle;
  }
}

class Circle extends GraphicElems {
    
  constructor(x = 50, y = 50, radius = 50, color = 'red') {
    super();
    var circle = new fabric.Circle({
      radius: radius,
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      fill: color,
    });

    this.object = circle;
    this.left = x;
    this.top = y;
    this.radius = radius;
    this.color = color;
  }
}

class Group extends GraphicElems {
  constructor(shapeArray, left = 50, top = 50) {
    super();
    var group = new fabric.Group(shapeArray, {
      left: left,
      top: top,
    });

    this.object = group;
    this.left = left;
    this.top = top;
  }
}

class Line extends GraphicElems {
  constructor(){

  }
}

class Rectangle extends GraphicElems {

  constructor(x = 50, y = 50, height = 50, width = 50, color = 'blue') {

    super();
    var rectangle = new fabric.Rect({
      left: x,
      top: y,
      height: height,
      width: width,
      originX: 'originX',
      originY: 'originY',
      fill: color,
    });

    this.object = rectangle;
    this.left = x;
    this.top = y;
    this.height = height;
    this.width = width;
    this.color = color;
  }
}

class Text extends GraphicElems {
  constructor(text, x = 50, y = 50, color = 'black', fontSize = 30) {
    super();
    var textElem = new fabric.Text(text, {
      fontSize: fontSize,
      left: x,
      top: y,
      originX: 'originX',
      originY: 'originY',
      fill: color
    });

    this.object = textElem;
    this.left = x;
    this.top = y;
    this.color = color;
    this.fontSize = fontSize;
  }
}

class Triangle extends GraphicElems {
    
  constructor(x = 50, y = 50, width = 50, height = 50, color = 'yellow') {
    super();
    var triangle = new fabric.Triangle({
      left: x,
      top: y,
      height: height,
      width: width,
      originX: 'originX',
      originY: 'originY',
      fill: color,
    });

    this.object = triangle;
    this.left = x;
    this.top = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

// Derived Classes
class Arc extends GraphicElems {
  constructor(x = 50, y = 50, radius = 50, color = 'black', angle = 0, startAngle = 0, endAngle = Math.PI / 3, width = 3) {
    super();
    var arc = new fabric.Circle({
      radius: radius,
      left: x,
      top: y,
      angle: angle,
      startAngle: startAngle,
      endAngle: endAngle,
      stroke: color,
      originX: 'center',
      originY: 'center',
      fill: '',
      strokeWidth: width
    });

    this.object = arc;
    this.left = x;
    this.top = y;
    this.radius = radius;
    this.color = color;
  }
}

class CircleChart extends Group {
  constructor() {
    super();
      
  }
}

class SolidArrow extends GraphicElems {
  
  constructor(x = 50, y = 50, height = 50, length = 100, color = 'black') {
  
    super();
    var rectangle = new Rectangle(x, y, height / 2, length, color);
    var triangle = new Triangle(x + length - height / 2, y, height, height, color);
    triangle.rotate(90);
      
    triangle.draw(canvas);
    rectangle.draw(canvas);
    var group = new Group([rectangle.object, triangle.object], x, y);
      
    this.object = group.object;
    this.left = x;
    this.top = y;
    this.color = color;
    this.from = null;
    this.to = null;
  }

  point(from, to) {
      this.from = from;
      this.to = to;
      var originX = from.getX();
      var originY = from.getY();
      var finalX = to.getX();
      var finalY = to.getY();
      
      var slope = (finalY - originY)/(finalX - originX);
      var radian = Math.atan(slope);
      var degree = radian * (180 / Math.PI);
      this.object.angle = degree;
      this.object.top = (finalY - originY) / 2 + (from.object.height - to.object.height) / 2;
      this.object.left = (finalX - originX) / 2;
  }
}

// Global Variables
var canvas = createCanvas(800, 800);

// functions below:

function createCanvas(canvasHeight, canvasWidth) { //don't have to be a class
  var canvas = new fabric.Canvas('canvas');
  canvas.setHeight(canvasHeight);
  canvas.setWidth(canvasWidth);
  return canvas;
}

function create() {

  var circle = new Circle();
  var text = new Text('aaa');
  circle.draw(canvas)
  text.draw(canvas)
  var group = new Group([circle.object, text.object], 200, 300);
  group.draw(canvas);

  var rectangle = new Rectangle();
  rectangle.draw(canvas);
  rectangle.setAngle(45);

  var triangle = new Triangle(x = 300, y = 200);
  triangle.rotate(100);
  triangle.draw(canvas);

  var arrow = new SolidArrow(x = 500, y = 500);
  arrow.draw(canvas);
  arrow.point(rectangle, triangle);
  arrow.draw(canvas);
    
  var arc = new Arc(x = 500, y = 500, radius = 250, color = 'green', angle = 0, startAngle = 0, endAngle = Math.PI / 5, width = 5);
  arc.draw(canvas);
}
  
