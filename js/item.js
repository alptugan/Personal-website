Namespace("com.alptugan");
com.alptugan.Item = function( name,color,rad = 15)
{

  // public variable
  this.value = name || "ddd"; // set default value to 0xFFFFFF for parameter if it isn’t defined
  this.color = color || "#FFCC00";
  this.rad   = rad;




  // private variable
  // get screen size
  var w = window,
  d = document,
  e = d.documentElement,
  g = d.getElementsByTagName('body')[0],
  sw = w.innerWidth || e.clientWidth || g.clientWidth,
  sh = w.innerHeight|| e.clientHeight|| g.clientHeight;

  var _name = this.color;
  var x = rad;
  var y = rad;
  var dx = 0.05;
  var dy = 4;
  var gapYText = 6;
  var ctx;
  var WIDTH;
  var HEIGHT;
  var canvas = document.getElementById('canvas');

  // Event Listener for page resize
  var windowResized = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
    } else {
      object["on"+type] = callback;
    }
  };

  // Event Callback Windows resized
  windowResized(window, "resize", function(event) {
    sw = w.innerWidth || e.clientWidth || g.clientWidth;
    sh = w.innerHeight|| e.clientHeight|| g.clientHeight;
  });

  // Event Callback mousedown
  canvas.addEventListener("mousedown",onMouseDown,false);

  // Event Callback mouseup
  canvas.addEventListener("mouseup",onMouseUp,false);

  /*
  // Event Callback mouseover
  canvas.addEventListener("mouseover",onMouseOver,false);

  // Event Callback mouseout
  canvas.addEventListener("mouseout",onMouseOut,false);
  */
  // Event Callback mousemove
  canvas.addEventListener("mousemove",onMouseMove,false);

  function onMouseDown(event) {
    //console.log( event.screenY + " x " +  event.pageY)
    if(event.pageX >  (x - rad) && event.pageX < (x + rad) && event.pageY > (y - rad) && event.pageY < (y + rad)) {
      console.log("mouse down");
    }
  }

  function onMouseUp(event) {
    if(event.pageX >  (x - rad) && event.pageX < (x + rad) && event.pageY > (y - rad) && event.pageY < (y + rad)) {
      console.log("mouse up");

      event.preventDefault();

      if (window.CustomEvent) {
        var ctmEvent = new CustomEvent("clicked", {
          detail: {
            message: "hop",
            time: new Date(),
          },
          bubbles: true,
          cancelable: true
        });

        event.currentTarget.dispatchEvent(ctmEvent);
      }

    }
  }

  /*
  function onMouseOver(event) {
  if(event.pageX >  (x - rad) && event.pageX < (x + rad) && event.pageY > (y - rad) && event.pageY < (y + rad)) {
  console.log("mouse over");
}
}

function onMouseOut(event) {
if(event.pageX >  (x - rad) && event.pageX < (x + rad) && event.pageY > (y - rad) && event.pageY < (y + rad)) {
console.log("mouse out");
}
}
*/

function onMouseMove(event) {
  if(event.pageX >  (x - rad) && event.pageX < (x + rad) && event.pageY > (y - rad) && event.pageY < (y + rad)) {
    console.log("mouse over");
    dx = 0.2;
    name = "YES YOU CAN CLICK ON ME :)";
  }else{
    dx = 0.05;
    name = "HOME";
    console.log("mouse out");
  }
}


// public function
this.getName = function( )
{
  return this.value; // or name
}


// private function
function drawItem(x,y,rad)
{
  if (canvas.getContext){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    ctx.font="10px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText(name, x, y - rad - gapYText);
  }
}


function init() {

  console.log(sw + "  " + sh);

  canvas.width = sw;
  canvas.height = sh;

  ctx = canvas.getContext("2d", {alpha: true});

  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  return setInterval(draw, 10);
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// DRAW METHOD

function draw() {
  clear();

  x = sw * 0.5;
  y = sh * 0.5;


  drawItem(x, y, rad);

  if(rad > 20) {
    rad = 15;
  }


  rad +=dx;
  /* BOUNCE
  if (x + dx > WIDTH || x + dx < 0)
  dx = -dx;
  if (y + dy > HEIGHT || y + dy < 0)
  dy = -dy;

  x += dx;
  y += dy;
  */
}

init();

};
