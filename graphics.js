


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


    this.object
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



function createCanvas(canvasHeight,canvasWidth){   //don't have to be a class
     var canvas = new fabric.Canvas('canvas');
     canvas.setHeight(canvasHeigh);
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





}








































function Canvas(title = 'canvas', height = 800, width = 1000) {
    this.fabricObject = new fabric.Canvas(title);
    this.fabricObject.setHeight(height);
    this.fabricObject.setWidth(width);
}

function Circle(canvas, x = 50, y = 50, radius = 50, color = 'red') {
    Shape.call(this);  
    this.canvas = canvas;
    this.object = new fabric.Circle({
    radius: radius,
    left: x,
    top: y,
    originX: 'center',
    originY: 'center',
    fill: color,
  });
}

function Group(canvas, array, left, top) {
    Shape.call(this);
    this.canvas = canvas;
    this.object = new fabric.Group(array, {
    left: left,
    top: top,
  });
}

function Rectangle(canvas, x = 50, y = 50, height = 50, width = 50, color='blue') {
    Shape.call(this);
    this.canvas = canvas;
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

function Shape(canvas, object) {
    this.object = object;
    this.canvas = canvas;
    
    this.addText = function(text, color = 'black', fontSize = 30) {
        var text = new Text(canvas, text, this.object.left, y = this.object.top, color, fontSize).object;
        this.canvas.add(text);
        this.object = new Group([this.object, text], this.object.left, this.object.top)
    }
        
    this.rotate = function(angle) {
        this.object.rotate(angle)
    };
    
    this.updateCanvas = function() {
        this.canvas.add(this.object);
    }
}

function SolidArrow(canvas, x = 50, y = 50, height = 50, length = 100, color = 'black') {
    Shape.call(this);
    
    var rectangle = new Rectangle(canvas, x, y, height / 2, length, color);
    var triangle = new Triangle(canvas, x / 2 + length, y, 50, height, color);
    triangle.rotate(90);
    
    this.canvas = canvas;
    this.object = new Group(canvas, [rectangle.object, triangle.object], x, y).object
}

function Text(canvas, text, x = 50, y = 50, color = 'black', fontSize = 30) {
    Shape.call(this);
    this.canvas = canvas;
    this.object = new fabric.Text(text, {
    fontSize: fontSize,
    left: x,
    top: y,
    originX: 'originX',
    originY: 'originY',
    fill: color
  });
}

function Triangle(canvas, x = 50, y = 50, width = 50, height = 50, color = 'yellow') {
    Shape.call(this);
    this.canvas = canvas;
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

function create() {
  var canvas = new Canvas().fabricObject;
 
  //Testing parent class
  var shape = new Shape(canvas, new fabric.Circle({
    radius: 10,
    left: 20,
    top: 20,
    originX: 'center',
    originY: 'center',
    fill: 'white',
  }));
  shape.updateCanvas();
    
  var circle = new Circle(canvas, x = 100);
  circle.updateCanvas();
    
  var rectangle = new Rectangle(canvas, x = 200, y = 100);
  rectangle.updateCanvas();
  
  var triangle = new Triangle(canvas, x = 300, y = 75);
  triangle.rotate(100);
  triangle.updateCanvas();
    
  // Testing group
  var group = new Group(canvas, [circle.object, rectangle.object], 300, 300);
  group.rotate(25);
  group.updateCanvas();
    
  var arrow = new SolidArrow(canvas);
  arrow.rotate(10);
  arrow.updateCanvas();
    
  var text = new Text(canvas, 'Text Class Test', x = 500, y = 200);
  text.updateCanvas();
    
  triangle.addText("Add Text Test");
}
