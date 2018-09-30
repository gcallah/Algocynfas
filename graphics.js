function createCanvas(title = 'canvas') {
  return new fabric.Canvas(title);
}

function createCircle(x = 50, y = 50, radius = 50, color = 'red') {
  return new fabric.Circle({
    radius: radius,
    left: x,
    top: y,
    originX: 'center',
    originY: 'center',
    fill: color,
  });
}

function createRectangle(x = 50, y = 50, height = 50, width = 50, color='blue') {
  return new fabric.Rect({
    left: x,
    top: y,
    height: height,
    width: width,
    fill: color,
    originX: 'originX',
    originY: 'originY',
  });
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
  var circle = createCircle(0, 0, radius, circleColor);
  var text = createText(text, 0, 0, textColor, radius / 2);
  var group = new fabric.Group([circle, text], {
    left: x-50,
    top: y-50,
  });
  return group;
}

function createTextRectangle(text, x=50, y=50, height=50, width=50, textColor = 'black', rectColor = 'blue') {
  var rect = createRectangle(0, 0, height, width, rectColor);
  var text = createText(text, 0, 0, textColor, height/2);
  var group = new fabric.Group([rect, text], {
    left: x-50,
    top: y-50,
  });
  return group;
}

function create() {
  var canvas = createCanvas();

  var circle = createCircle(50, 50, 50, 'white');
  canvas.add(circle);
  var text = createText('text', 50, 50, 'black', 50/2);
  canvas.add(text);
  var textCircle = createTextCircle('textCircle', 200, 50);
  canvas.add(textCircle);
  var textRectangle = createTextRectangle('textRect', 300, 50);
  canvas.add(textRectangle);

  var rect = createRectangle();
  canvas.add(rect);
}
