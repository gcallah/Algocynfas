function Canvas(title = 'canvas') {
    this.fabricObject = new fabric.Canvas(title);
}

function Circle(x = 50, y = 50, radius = 50, color = 'red') {
    Shape.call(this);
    this.object = new fabric.Circle({
    radius: radius,
    left: x,
    top: y,
    originX: 'center',
    originY: 'center',
    fill: color,
  });
}

function Rectangle(x = 50, y = 50, height = 50, width = 50, color='blue') {
    Shape.call(this);
    this.object = new fabric.Rect({
    left: x,
    top: y,
    height: height,
    width: width,
    fill: color,
    originX: 'originX',
    originY: 'originY',
  });
}

function Shape(object) {
    this.object = object;
    this.rotate = function(angle) {
        this.object.rotate(angle)
    };
}

function Group(shapeArray, left, top) {
    this.object = new fabric.Group(shapeArray, {
    left: x,
    top: y,
  });
}


function SolidArrow(x = 50, y = 50, height = 50, length = 100, color = 'black') {
    Shape.call(this);
    var rectangle = new Rectangle(x, y, height / 2, length, color);
    var triangle = new Triangle(x / 2 + length, y, 50, height, color);
    triangle.rotate(90);
    this.object = new Group([rectangle, triangle], x, y)
}

function Triangle(x = 50, y = 50, width = 50, height = 50, color = 'yellow') {
    Shape.call(this);
    this.object = new fabric.Triangle({
    left: x,
    top: y,
    height: height,
    width: width,
    fill: color,
    originX: 'originX',
    originY: 'originY',
  });
}

function createSolidArrow(x = 50, y = 50, height = 50, length = 100, color = 'black') {
    var rectangle = createRectangle(x, y, height / 2, length, color);
    var triangle = createTriangle(x / 2 + length, y, 50, height, color);
    rotate(triangle, 90);
}

function createText(text, x = 50, y = 50, color = 'black', fontSize = 30) {
  return new fabric.Text(text, {
    fontSize: fontSize,
    left: x,
    top: y,
    originX: 'originX',
    originY: 'originY',
    fill: color
  });
}

function createTextCircle(text, x=50, y=50, radius = 50, textColor = 'black', circleColor = 'red') {
  var circle = createCircle(x, y, radius, circleColor);
  var text = createText(text, x, y, textColor, radius / 2);
  var group = new fabric.Group([circle, text], {
    left: x,
    top: y,
  });
  return group;
}

function createTextRectangle(text, x=50, y=50, height=50, width=50, textColor = 'black', rectColor = 'blue') {
  var rect = createRectangle(x, y, height, width, rectColor);
  var text = createText(text, x, y, textColor, height/2);
  var group = new fabric.Group([rect, text], {
    left: x,
    top: y,
  });
  return group;
}

function create() {
  var canvas = new Canvas().fabricObject;
 
  //Testing parent class
  var shape = new Shape(new fabric.Circle({
    radius: 10,
    left: 20,
    top: 20,
    originX: 'center',
    originY: 'center',
    fill: 'white',
  })).object;
  canvas.add(shape);
    
  var circle = new Circle(x = 100).object;
  canvas.add(circle);
    
  var rectangle = new Rectangle(x = 200, y = 100).object;
  rectangle.rotate(30);
  canvas.add(rectangle);
  
  var triangle = new Triangle(x = 300, y = 75).object;
  triangle.rotate(100);
  canvas.add(triangle);
    
  //ar arrow = new SolidArrow().object;
    
  //var text = createText('text', 50, 50, 'black', 50/2);
  //canvas.add(text);
  //var textCircle = createTextCircle('textCircle', 200, 50);
  //canvas.add(textCircle);
  //var textRectangle = createTextRectangle('textRect', 300, 50);
  //canvas.add(textRectangle);

  //
  //canvas.add(arrow);
  //rotate(textRectangle, 90);
}
