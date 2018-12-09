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
  constructor(x = 0, y = 0, radius = 50, color = 'red') {
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
    this.originX = 'center';
    this.originY = 'center';
    this.radius = radius;
    this.color = color;
  }
}

class Group extends GraphicElems {
  constructor(shapeArray, left = 0, top = 0) {
    super();

    var group = new fabric.Group(shapeArray, {
      left: left,
      top: top,
      originX: 'center',
      originY: 'center',
    });

    this.object = group;
    this.left = left;
    this.top = top;
  }

  add(shape) {
    shape.set('left', this.left + shape.left)
    shape.set('top', this.top + shape.top)
    this.object.addWithUpdate(shape)
  }

}

class Rectangle extends GraphicElems {

  constructor(x = 0, y = 0, height = 50, width = 50, color = 'blue') {

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
  constructor(text, x = 0, y = 0, color = 'black', fontSize = 30) {
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

  constructor(x = 0, y = 0, width = 50, height = 50, color = 'yellow') {
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
  constructor(x = 0, y = 0, radius = 50, color = 'black', angle = 0, startAngle = 0, endAngle = Math.PI / 3, width = 3) {
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

class SolidArrow extends GraphicElems {

  constructor(x = 0, y = 0, height = 50, length = 100, color = 'black') {

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
    var originX = from.getX() + from.width / 2;
    var originY = from.getY() + from.height / 2;
    var finalX = to.getX() + to.width / 2;
    var finalY = to.getY() + to.height / 2;

    var slope = (finalY - originY) / (finalX - originX);
    var radian = Math.atan(slope);
    var degree = radian * (180 / Math.PI);
    this.object.angle = degree;
    this.object.top = (finalY - originY) / 2 + (from.object.height - to.object.height) / 2;
    this.object.left = (finalX - originX) / 2;
  }
}

class CircleChart extends Group {
  constructor(nodes = ['A', 'B', 'C', 'D', 'E'], color = ['orange', 'gray', 'yellow', 'blue', 'green'], x = 300, y = 300, circleRadius = 80, chartRadius = 200, arcWidth = 20) {
    super();
    length = nodes.length
    for (var i = 0; i < length; i++) {
      var currX = x + Math.sin(2 * Math.PI * i / length) * chartRadius;
      var currY = y - Math.cos(2 * Math.PI * i / length) * chartRadius;
      var offset = Math.atan(circleRadius / chartRadius)
      var arc = new Arc(x, y, chartRadius, color[i], 0, 2 * Math.PI * i / length - Math.PI / 2 - offset, 2 * Math.PI * (i + 1) / length - Math.PI / 2 - offset, arcWidth);
      this.add(arc.object)
      var circle = new Circle(currX, currY, circleRadius, color[i])
      this.add(circle.object)
      var text = new Text(nodes[i], currX, currY)
      this.add(text.object)
    }

  }
}

class CurvedArrow extends Group {
  constructor(x = 250, y = 250, radius = 50, color = 'black', angle = Math.PI, width = 25) {

    super();
    var arc = new Arc(x, y, radius, color, 0, 0, angle, width);
    var triangle = new Triangle(x + radius, y - width / 2, width, width, color);

    triangle.draw(canvas);
    arc.draw(canvas);
    var group = new Group([arc.object, triangle.object], x, y);

    this.object = group.object;
  }
}

class InfinitySymbol extends Group {
  constructor(x = 250, y = 250, radius = 75, color = 'black', width = 25) {
    super();
    var circleLeft = new Arc(x + 1.4 * radius, y, radius, 'black', 0, 0, 1.5 * Math.PI, width)
    var circleRight = new Arc(x - 1.4 * radius, y, radius, 'black', 0, 0, 1.5 * Math.PI, width)
    circleRight.rotate(45);
    circleLeft.rotate(225);
    var length = Math.PI * radius * 3.5 / 5;
    var rect1 = new Rectangle(x, y, length, width, color);
    var rect2 = new Rectangle(x, y, length, width, color);
    rect1.rotate(-45);
    rect2.rotate(45);


    this.add(circleLeft.object);
    this.add(circleRight.object);
    this.add(rect1.object);
    this.add(rect2.object);
  }
}

class Line extends Rectangle {
  constructor(initialX = 100, initialY = 100, finalX = 25, finalY = 300, width = 1, color = 'black') {
    var length = Math.sqrt(Math.pow(Math.abs(initialX - finalX), 2) + Math.pow(Math.abs(initialY - finalY), 2))
    var slope = (finalY - initialY) / (finalX - initialX);
    var radian = Math.atan(slope);
    var degree = radian * (180 / Math.PI);

    super(initialX, initialY, width, length, color);
    this.setAngle(degree);
  }
}

class PathChart extends Group {
  constructor(pathLeft = ['Agile Adoption', 'Differential Testing Services', 'Continuous'], pathRight = ['Remote Support', 'Managed Services', 'Outcome Based Models'], pathCenter = ['IT Transformation', 'IT Consulting'], goal = "DevOp Services!", x = 300, y = 300, rectangleHeight = 50, rectangleWidth = 150, fontSize = 15) {
    super();
    var goalBox = new Rectangle(x, y, rectangleHeight, rectangleWidth);
    this.add(goalBox.object);
    var goalText = new Text(goal, x, y, 'black', fontSize);
    this.add(goalText.object);
      
    var centerX = x;
    var rightX = x + rectangleWidth * 1.5;
    var leftX = x - rectangleWidth * 1.5;
      
    // For the center path
    var topCenterY = y - rectangleHeight * 6;
    var bottomCenterY = y - rectangleHeight * 3;
    
    var topCenterArrowY = y - rectangleHeight * 4.5;
    var bottomCenterArrowY = y - rectangleHeight * 1.5;
      
    // For the side paths
    var topSideY = y - rectangleHeight * 6;
    var midSideY = y - rectangleHeight * 4;
    var botSideY = y - rectangleHeight * 2;
    
    var topSideArrowY = y - rectangleHeight * 5;
    var midSideArrowY = y - rectangleHeight * 3;
    var botSideArrowY = y
    
    var botRightArrowX = x + rectangleWidth;
    var botLeftArrowX = x - rectangleWidth;
    var botArrowExtensionY = botSideArrowY - 25;
    
      
    // Component creation
    var pathCenterTop = new Rectangle(centerX, topCenterY, rectangleHeight, rectangleWidth);
    this.add(pathCenterTop.object);
    var pathCenterTopText = new Text(pathCenter[0], centerX, topCenterY, 'black', fontSize);
    this.add(pathCenterTopText.object);

    var pathCenterBottom = new Rectangle(centerX, bottomCenterY, rectangleHeight, rectangleWidth);
    this.add(pathCenterBottom.object);
    var pathCenterBottomText = new Text(pathCenter[1], centerX, bottomCenterY, 'black', fontSize);
    this.add(pathCenterBottomText.object);
    
    var pathRightTop = new Rectangle(rightX, topSideY, rectangleHeight, rectangleWidth);
    this.add(pathRightTop.object);
    var pathRightTopText = new Text(pathRight[0], rightX, topSideY, 'black', fontSize);
    this.add(pathRightTopText.object);
      
    var pathRightMid = new Rectangle(rightX, midSideY, rectangleHeight, rectangleWidth);
    this.add(pathRightMid.object);
    var pathRightMidText = new Text(pathRight[1], rightX, midSideY, 'black', fontSize);
    this.add(pathRightMidText.object);
      
    var pathRightBot = new Rectangle(rightX, botSideY, rectangleHeight, rectangleWidth);
    this.add(pathRightBot.object);
    var pathRightBotText = new Text(pathRight[2], rightX, botSideY, 'black', fontSize);
    this.add(pathRightBotText.object);
      
    var pathLeftTop = new Rectangle(leftX, topSideY, rectangleHeight, rectangleWidth);
    this.add(pathLeftTop.object);
    var pathLeftTopText = new Text(pathLeft[0], leftX, topSideY, 'black', fontSize);
    this.add(pathLeftTopText.object);
      
    var pathLeftMid = new Rectangle(leftX, midSideY, rectangleHeight, rectangleWidth);
    this.add(pathLeftMid.object);
    var pathLeftMidText = new Text(pathLeft[1], leftX, midSideY, 'black', fontSize);
    this.add(pathLeftMidText.object);
      
    var pathLeftBot = new Rectangle(leftX, botSideY, rectangleHeight, rectangleWidth);
    this.add(pathLeftBot.object);
    var pathLeftBotText = new Text(pathLeft[2], leftX, botSideY, 'black', fontSize);
    this.add(pathLeftBotText.object);
      
    // Arrows
    var pathCenterArrowTop = new SolidArrow(centerX, topCenterArrowY, 50, rectangleHeight, 'black');
    pathCenterArrowTop.rotate(90);
    this.add(pathCenterArrowTop.object);

    var pathCenterArrowBottom = new SolidArrow(centerX, bottomCenterArrowY, 50, rectangleHeight, 'black');
    pathCenterArrowBottom.rotate(90);
    this.add(pathCenterArrowBottom.object);
      
    var pathRightArrowTop = new SolidArrow(rightX, topSideArrowY, 50, rectangleHeight, 'black');
    pathRightArrowTop.rotate(90);
    this.add(pathRightArrowTop.object);
      
    var pathRightArrowMid = new SolidArrow(rightX, midSideArrowY, 50, rectangleHeight, 'black');
    pathRightArrowMid.rotate(90);
    this.add(pathRightArrowMid.object);
      
    var pathLeftArrowTop = new SolidArrow(leftX, topSideArrowY, 50, rectangleHeight, 'black');
    pathLeftArrowTop.rotate(90);
    this.add(pathLeftArrowTop.object);
      
    var pathLeftArrowMid = new SolidArrow(leftX, midSideArrowY, 50, rectangleHeight, 'black');
    pathLeftArrowMid.rotate(90);
    this.add(pathLeftArrowMid.object);
      
    var pathRightArrowBot = new SolidArrow(botRightArrowX, botSideArrowY, 50, rectangleHeight * 1.75, 'black');
    pathRightArrowBot.rotate(180);
    this.add(pathRightArrowBot.object);
    var pathRightArrowExtension = new Rectangle(rightX, botArrowExtensionY, 75, 25, 'black');
    this.add(pathRightArrowExtension.object);
    
    var pathLeftArrowBot = new SolidArrow(botLeftArrowX, botSideArrowY, 50, rectangleHeight * 1.75, 'black');
    this.add(pathLeftArrowBot.object);
    var pathLeftArrowExtension = new Rectangle(leftX, botArrowExtensionY, 75, 25, 'black');
    this.add(pathLeftArrowExtension.object);
  }
}

class Person extends Group {
  constructor() {
    super();
    var head = new Circle(50, 50, 20, 'black');
    this.add(head.object);
    var body = new Rectangle(50, 100, 100, 10, 'black');
    this.add(body.object);
    var leftHand = new Rectangle(30, 100, 50, 10, 'black');
    leftHand.rotate(45);
    this.add(leftHand.object);
    var rightHand = new Rectangle(70, 100, 50, 10, 'black');
    rightHand.rotate(-45);
    this.add(rightHand.object);
    var leftLeg = new Rectangle(30, 160, 50, 10, 'black');
    leftLeg.rotate(45);
    this.add(leftLeg.object);
    var rightLeg = new Rectangle(70, 160, 50, 10, 'black');
    rightLeg.rotate(-45);
    this.add(rightLeg.object);
  }

  withBug(){
    var bugBox = new Rectangle(100,100,50,50,'black');
    this.add(bugBox.object);
    var bugText = new Text('Bug',100,100,'white');
    this.add(bugText.object);
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
  //var person = new Person();
  //person.withBug();
  //person.draw(canvas);
  // var circle = new Circle();
  // var text = new Text('aaa');
  // circle.draw(canvas)
  // text.draw(canvas)
  // var group = new Group([circle.object, text.object], 200, 300);
  // group.draw(canvas);
  //
  // var rectangle = new Rectangle();
  // rectangle.draw(canvas);
  // rectangle.setAngle(45);
  //
  // var triangle = new Triangle(x = 300, y = 200);
  // triangle.rotate(100);
  // triangle.draw(canvas);
  //
  // var arrow = new SolidArrow(x = 500, y = 500);
  // arrow.draw(canvas);
  // arrow.point(rectangle, triangle);
  // arrow.draw(canvas);

  //var chart = new CircleChart()
  //chart.draw(canvas)

  // var line = new Line();
  // line.draw(canvas);

  // var curvedArrow = new CurvedArrow(250, 250, 50, 'black', angle = Math.PI / 2, width = 25);
  // curvedArrow.draw(canvas);

  //var infinitySymbol = new InfinitySymbol();
  //infinitySymbol.draw(canvas);

  var pathChart = new PathChart();
  pathChart.draw(canvas);
}
