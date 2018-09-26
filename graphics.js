function createCanvas( title = 'canvas'){
    return new fabric.Canvas(title);
}


function createCircle(x=500, y=500, radius=20)
{
   
return new fabric.Circle(
    {
        radius: radius,
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        fill: 'white'
    });
  

}

function createRectangle(x=500, y=500, height=20, width=20)
{
    return new fabric.Rect(
    {
        left: x,
        top: y,
        height: height,
        width: width,
        fill: 'white'
    });
}




function create(){
    let circle = createCircle();
    let canvas = createCanvas();
    canvas.add(circle);

}