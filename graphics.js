class GrapicElems{     // an abstract class

    constructor(){
        if (this.constructor === GrapicElems) {
            throw new TypeError('Abstract class "GrapicElems" cannot be instantiated directly.'); 
        }
        this.object = null;
    }
    
    rotate(angle){
        this.object.rotate(angle);
    }

    draw(canvas){
        canvas.add(this.object);
    }
    
    getX(){
        return this.object.left;
    }
    
    getY(){
        return this.object.top;
    }
}

class Circle extends GrapicElems{

constructor(x = 50, y = 50, radius = 50, color = 'red'){
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

class Rectangle extends GrapicElems{
    
  constructor(x = 50, y = 50, height = 50, width = 50, color='blue'){

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

class Triangle extends GrapicElems{
  constructor(x = 50, y = 50, width = 50, height = 50, color = 'yellow'){
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

class Group extends GrapicElems{

   constructor(shapeArray,left = 50,top = 50){
     super();
     var group = this.group(shapeArray,left,top);
     this.object = group;
     this.left = left;
     this.top = top;
   }

    group(objectArray,left,top ){
    var objectGroup = new fabric.Group(objectArray, {
      left: left,
      top: top,
    });
    return objectGroup;
   }
}

class Text extends GrapicElems{

  constructor(text, x = 50, y = 50, color = 'black', fontSize = 30){
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
      super(textElem);
  }
}
// functions below:

function createCanvas(canvasHeight, canvasWidth){   //don't have to be a class
     var canvas = new fabric.Canvas('canvas');
     canvas.setHeight(canvasHeight);
     canvas.setWidth(canvasWidth);
     return canvas;
}

function createSolidArrow(){

  var rectangle = new Rectangle(height = 25);
  var triangle = new Triangle();
  triangle.rotate(90);
  var solidArrow = new Group([rectangle,triangle]);
  var canvas = createCanvas(500, 800);               // this canvas can be moved out as a global variable, too
  solidArrow.draw(canvas);
}

function createCircle(text = ""){   // parameter can be more 

  var canvas = createCanvas(500, 800);


  if(text == ""){
    circle = new Circle();
    circle.draw(canvas);
    return;

  }

  var circle = new Circle();
  var text = new Text(text);

  var circleWithText = new Group([circle,text]);
  
  circleWithText.draw(canvas); 
  alert(circle.getX());




}

function SolidArrow(canvas, x = 50, y = 50, height = 50, length = 100, color = 'black') {
    Shape.call(this);
    
    var rectangle = new Rectangle(canvas, x, y, height / 2, length, color);
    var triangle = new Triangle(canvas, x / 2 + length, y, 50, height, color);
    triangle.rotate(90);
    
    this.canvas = canvas;
    this.object = new Group(canvas, [rectangle.object, triangle.object], x, y).object
}

function create() {
    var canvas = createCanvas(800, 800);
 
    var circle = new Circle();
    circle.draw(canvas);
    
    var rectangle = new Rectangle();
    rectangle.draw(canvas);
    rectangle.rotate(15);
    
    var triangle = new Triangle(x = 300, y = 75);
    triangle.rotate(100);
    triangle.draw(canvas);
    
    
    // Testing group
    //createSolidArrow();
  //var arrow = new SolidArrow(canvas);
  //arrow.rotate(10);
  //arrow.updateCanvas();
    
  //var text = new Text(canvas, 'Text Class Test', x = 500, y = 200);
  //text.updateCanvas();
    
  //triangle.addText("Add Text Test");
}
