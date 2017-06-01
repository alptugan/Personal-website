INSTANCE METHOD

/*
var s = function( p ) {

  var x = 0; 
  var y = 0;

  p.setup = function() {
    p.createCanvas(100, 100);
  };

  p.draw = function() {
    p.background(0,0,0,255);
   
    p.fill(255);
    p.rect(x,y,50,50);
    
     p.stroke(255,0,0);
    p.line(0,0,2000,2000);
     p.filter(BLUR,sin(millis()*0.001)+1);
  };
};


*/




// Standard colours and variables
/*
 * Translated to p5js by professorcook.org from
 * www.khanacademy.org/profile/peterwcollingridge/projects
 * All code is owned by its respective author and
 * is made available under the MIT license.
*/
var BACKGROUND;
var GREY;
var BLUE;
var PINK;
var GREEN;
var ORANGE;
var GRIDGREY;
var TEXTCOL;
var TOOLBAR;
var MESSAGEBLUE;

var CONTROL_POINT_SIZE = 12;
var MAX_RESOLUTION = 200;
var ANIMATE_SPLIT = 12;
var ANIMATE_AVERAGE = 30;

var toolbarX;
var toolbarWidth = 135;
var toolbarHeight = 160;
var width2;

var sansFont;
var serifFont;

var showing;

var selected = false;
var myCurve;
var targetPoints;
var toolbar;
var targetCurve;

function setup() {
  createCanvas(400, 400);
  BACKGROUND = color(250, 250, 250);
  GREY = color(100, 100, 100);
  BLUE = color(64, 95, 237);
  PINK = color(255, 0, 175);
  GREEN = color(28, 173, 123);
  ORANGE = color(255, 165, 0);
  GRIDGREY = color(230, 240, 230);
  TEXTCOL = color(20, 20, 20);
  TOOLBAR = color(230, 230, 230, 200);
  MESSAGEBLUE = color(20, 60, 160);
  toolbarX = width * 0.01;
  width2 = width / 2;
  //sansFont = createFont("sans", 14);
  //serifFont = createFont("serif", 16);
  showing = {
    'Control points': true,
    'Control arms': true,
    'Average points': true,
    Curve: true,
  };
  targetPoints = [
    [width2 + height * 0.1, height * 0.6],
    [width2 + height * 0.5, height * 0.4],
    [width2 + height * 0.1, height * 0.8],
    [width2 - height * 0.3, height * 0.4]
  ];
  /**************************************
   * Creation of objects
   ***************************************/

  myCurve = new Curve([
    [width2, height * 0.2],
    [width2 + height * 0.4, height * 0.6],
    [width2, height * 0.9],
    [width2 - height * 0.4, height * 0.6]
  ]);

  //myCurve = new Curve([[300, 100], [350, 140], [330, 200], [270, 200], [250, 140]]);
  //myCurve = new Curve([[300, 100], [350, 135], [350, 190], [300, 225], [250, 190], [250, 135]]);

  toolbar = new Toolbar(toolbarX, toolbarX, toolbarWidth);
  toolbar.addButton("Split", splitCurve);
  toolbar.addButton("Average", averageCurve);
  toolbar.addButton("Reset", resetCurve);
  toolbar.addOptions(showing);
  targetCurve = getCurve(4, targetPoints);
}
/**************************************
 * GUI Slider to vary parameters
 ***************************************/

var Slider = function(x, y, width, min_v, max_v, current_v) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.h = 12;
  this.held = false;

  this.ballR = 8;
  this.ballD = this.ballR * 2;

  this.min = min_v;
  this.max = max_v;
  this.scale = (max_v - min_v) / width;
  this.val = current_v || min_v;
  this.bx = this.x + (this.val - min_v) / this.scale;

  this.held = false;

  this.draw = function() {
    noStroke();
    fill(180);
    //rect(this.x - 8, this.y - this.h / 2, this.width + 16, this.h, 8);

    strokeWeight(1);
    stroke(0, 0, 0, 120);
    fill(180, 180, 250);
    ellipse(this.bx, this.y, this.ballD, this.ballD);
    noStroke();
    //fill(255, 255, 255, 150);
    //ellipse(this.bx - this.ballR * 0.3, this.y - this.ballR * 0.3, 5, 5);

  };

  this.selected = function() {
    this.held = dist(mouseX, mouseY, this.bx, this.y) < this.ballR;
  };

  this.drag = function() {
    if (this.held) {
      var x = constrain(mouseX, this.x, this.x + this.width);
      this.bx = x;
      this.val = this.min + round((x - this.x) * this.scale);
      return true;
    }
  };

  // This is used if you want to update the value in a way other
  // than using the slider (but want the slider to update).
  this.update = function(d) {
    this.val = constrain(this.val + d, this.min, this.max);
    this.bx = (this.val - this.min) / this.scale + this.x;
  };
};

/**************************************
 *  GUI Button
 ***************************************/
{
  var Button = function(x, y, w, h, name, clickFunction) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
    this.defaultCol = TOOLBAR;
    this.highlightCol = color(210, 210, 210, 250);
    this.showing = true;
    this.box = this.h - 6;
    this.clickFunction = clickFunction;
    this.transition = 0;
  };

  Button.prototype.mouseOver = function() {
    return (mouseX >= this.x && mouseX <= this.x + this.w &&
      mouseY >= this.y && mouseY <= this.y + this.h);
  };

  Button.prototype.click = function() {
    if (this.clickFunction) {
      this.clickFunction();
    }
  };

  Button.prototype.draw = function() {
    if (!this.showing) {
      return;
    }

    this.fade();

    if (this.deactivated) {
      fill(200);
      noStroke();
    } else {
      fill(lerpColor(this.defaultCol, this.highlightCol, this.transition / 10));
      strokeWeight(1);
      stroke(200);
    }

    rect(this.x, this.y - 1, this.w, this.h + 3, 12);

    if (this.deactivated) {
      fill(120);
    } else {
      fill(TEXTCOL);
    }
    noStroke();
    //textFont(sansFont, 15);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(this.name, this.x + this.w / 2, this.y + this.h / 2 + 4);
  };

  Button.prototype.fade = function() {
    if (this.mouseOver() || this.selected) {
      this.transition = min(10, this.transition + 1);
    } else {
      this.transition = max(0, this.transition - 1);
    }
  };

  var CheckBox = function(x, y, w, h, name) {
    Button.call(this, x, y, w, h, name);
    this.box = this.h - 6;
    this.bx = this.x + 5;
    this.by = this.y + 3;
  };
  CheckBox.prototype = Object.create(Button.prototype);

  CheckBox.prototype.click = function() {
    showing[this.name] = !showing[this.name];
  };

  CheckBox.prototype.draw = function() {
    if (!this.showing) {
      return;
    }

    this.fade();

    if (this.transition) {
      noStroke();
      fill(lerpColor(this.defaultCol, this.highlightCol, this.transition / 10));
      rect(this.x, this.y, this.w, this.h + 1, 4);
    }

    fill(TEXTCOL); noStroke();
    //textFont(sansFont, 15);
    textSize(15);
    textAlign(LEFT, CENTER);
    text(this.name, this.x + this.box + 9, this.y + this.h / 2 + 1);

    noFill();
    stroke(10);
    strokeWeight(1);
    rect(this.bx, this.y + 3, this.box, this.box);

    if (showing[this.name]) {
      line(this.bx + 1, this.by + 1, this.bx + this.box, this.by + this.box);
      line(this.bx + this.box, this.by + 1, this.bx + 1, this.by + this.box);
    }
  };
}
/**************************************
 *      Toolbar
 *  Contains other GUI elements
 ***************************************/
{
  var Toolbar = function(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 7;

    this.buttons = [];
  };

  Toolbar.prototype.draw = function() {
    noStroke();
    fill(TOOLBAR);
    rect(this.x, this.y, this.w, this.h, 8);

    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw();
    }
  };

  Toolbar.prototype.addButton = function(name, func) {
    var h = 18;
    var x = this.x + 5;
    var y = this.y + this.h;
    var w = this.w - 10;


    this.buttons.push(new Button(x, y, w, h, name, func));
    this.h += h + 8;
  };

  Toolbar.prototype.addOptions = function(options) {
    var x = this.x + 3;
    var y = this.y + this.h + 2;
    var w = this.w - 6;
    var h = 22;

    for (var opt in options) {
      this.buttons.push(new CheckBox(x, y, w, h, opt));
      y += h + 5;
      this.h += h + 5;
    }

    this.h += 2;
  };

  Toolbar.prototype.mouseReleased = function() {
    for (var i = 0; i < this.buttons.length; i++) {
      if (this.buttons[i].mouseOver() && this.buttons[i].selected) {
        this.buttons[i].click();
      }
      this.buttons[i].selected = false;
    }
  };

  Toolbar.prototype.mousePressed = function() {
    for (var i = 0; i < this.buttons.length; i++) {
      if (this.buttons[i].mouseOver()) {
        this.buttons[i].selected = true;
      }
    }
  };
}
/**************************************
 * DraggablePoint
 * A freely draggable point with a position and colour.
 ***************************************/

var DraggablePoint = function(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color || ORANGE;
  this.animation = 0;
};

DraggablePoint.prototype.draw = function() {
  if (selected === this || this.mouseOver()) {
    if (this.animation < 5) {
      this.animation++;
    }
  } else {
    this.animation = 0;
  }

  strokeWeight(1);
  stroke(BACKGROUND);
  fill(0);

  var r = CONTROL_POINT_SIZE + this.animation;
  ellipse(this.x, this.y, r, r);
};

DraggablePoint.prototype.mouseOver = function() {
  return dist(mouseX, mouseY, this.x, this.y) <= CONTROL_POINT_SIZE / 2;
};

DraggablePoint.prototype.move = function() {
  this.x += mouseX - pmouseX;
  this.y += mouseY - pmouseY;
};

/**************************************
 * AveragePoint
 * A point whose position is defined as the weighted
 * average of a list of points.
 *    points is an array of draggablePoints
 *    weights is a mapping of an index in points with a weight
 ***************************************/

var AveragePoint = function(points, weights, color) {
  this.color = color || GREEN;
  this.points = points;
  this.weights = weights;
  this.r = 10;
  this.animation = 12;

  this.update();
  //this.info();
};

AveragePoint.prototype.draw = function(n) {
  strokeWeight(1);
  stroke(BACKGROUND);
  fill(this.color);

  var r = this.r * (1.15 - abs((this.animation - 3) / ANIMATE_SPLIT));

  ellipse(this.x, this.y, r, r);

  if (n !== undefined) {
    fill(255, 0, 0);
    text(n, this.x, this.y);
  }

  if (this.animation) {
    this.animation--;
  }
};

AveragePoint.prototype.update = function() {
  this.x = 0;
  this.y = 0;

  for (var i in this.weights) {
    var w = this.weights[i];
    this.x += this.points[i].x * w;
    this.y += this.points[i].y * w;
  }
};

// Change position using the weights of a second point
// Used for animation
AveragePoint.prototype.move = function(p2, w) {
  this.x = 0;
  this.y = 0;
  var v = 1 - w;

  for (var i in this.weights) {
    var w1 = this.weights[i];
    this.x += this.points[i].x * w1 * w;
    this.y += this.points[i].y * w1 * w;
  }

  for (var i in p2.weights) {
    var w2 = p2.weights[i];
    this.x += p2.points[i].x * w2 * v;
    this.y += p2.points[i].y * w2 * v;
  }
};

AveragePoint.prototype.info = function() {
  println("Point");
  println("(" + this.x + ", " + this.y + ")");
  for (var i in this.weights) {
    println(i + ": " + this.weights[i]);
  }
};

var averageWeights = function(w1, w2, w) {
  w = w || 0.5;
  var d = {};

  for (var i in w1) {
    d[i] = w1[i] * w;
  }

  w = 1 - w;

  for (var i in w2) {
    if (d[i]) {
      d[i] += w2[i] * w;
    } else {
      d[i] = w2[i] * w;
    }
  }

  return d;
};

// Given two AveragePoints,
// return a new averagePoint, which is their average
// weighted by w
var averagePoints = function(p1, p2, w) {
  var d = averageWeights(p1.weights, p2.weights, w);
  return new AveragePoint(p1.points, d);
};

/**************************************
 *      Curve
 * A collection of points, joined by control arms
 * A curve is drawn between the points
 ***************************************/
{
  var Curve = function(points) {
    this.controlPoints = [];
    this.curvePoints = [];
    this.newPoints = [];

    this.mouseoverPoint = false;
    this.labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.animation = 0;
    this.subdivisions = 0;

    // Add control points
    for (var i = 0; i < points.length; i++) {
      var p = new DraggablePoint(points[i][0], points[i][1]);
      this.controlPoints.push(p);
    }

    this.reset();

  };

  Curve.prototype.update = function() {
    for (var i = 0; i < this.curvePoints.length; i++) {
      this.curvePoints[i].update();
    }
  };

  Curve.prototype.reset = function() {
    // Add curve points
    this.curvePoints = [];
    this.subdivisions = 0;

    for (var i = 0; i < this.controlPoints.length; i++) {
      var d = {};
      d[i] = 1;
      var p = new AveragePoint(this.controlPoints, d);
      this.curvePoints.push(p);
    }
    this.update();
  };

  Curve.prototype.draw = function() {
    if (this.animation) {
      this.animation--;

      if (this.animation < 1 && this.newPoints.length) {
        this.curvePoints = this.newPoints;
      } else {
        // Move points towards position of new points
        var p = this.animation / ANIMATE_AVERAGE;

        for (var i = 0; i < this.curvePoints.length; i++) {
          this.curvePoints[i].move(this.newPoints[i], p);
        }
      }
    }

    if (showing.Strings) {
      this.drawStrings();
    }

    if (showing['Control arms']) {
      this.drawControlArms();
    }

    if (showing.Curve) {
      this.drawCurve();
    }

    if (showing['Average points']) {
      this.drawCurvePoints();
    }

    if (showing['Control points']) {
      this.drawControlPoints();
    }
  };

  Curve.prototype.drawControlArms = function() {
    stroke(BLUE);
    strokeWeight(2);

    var n = this.controlPoints.length;
    for (var i = 0; i < n; i++) {
      var p1 = this.controlPoints[i];
      var p2 = this.controlPoints[(i + 1) % n];
      line(p1.x, p1.y, p2.x, p2.y);
    }
  };

  Curve.prototype.drawControlPoints = function() {
    var n = this.controlPoints.length;

    for (var i = 0; i < n; i++) {
      this.controlPoints[i].draw();
    }

    // Labels
    fill(ORANGE);
    noStroke();
    //textFont(serifFont);
    textAlign(CENTER, CENTER);
    for (var i = 0; i < n; i++) {
      var p1 = this.controlPoints[i];
      var p2 = this.controlPoints[(i + 1) % n];
      var p3 = this.controlPoints[(i + n - 1) % n];

      var dx = p2.x + p3.x - 2 * p1.x;
      var dy = p2.y + p3.y - 2 * p1.y;
      var d = sqrt(dx * dx + dy * dy);
      var tx = p1.x - dx / d * 16;
      var ty = p1.y - dy / d * 16;
      text(this.labels.charAt(i), tx, ty + 2);
    }
  };

  Curve.prototype.drawCurve = function() {
    stroke(GREEN);
    strokeWeight(4);
    noFill();

    var n = this.curvePoints.length;

    beginShape();
    for (var i = 0; i < n; i++) {
      var p = this.curvePoints[i % n];
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  };

  Curve.prototype.drawCurvePoints = function() {
    for (var i = 0; i < this.curvePoints.length; i++) {
      this.curvePoints[i].draw();
    }
  };

  // If split is true then points are split,
  // Otherwise points are averaged
  Curve.prototype.createNewPoints = function(split) {
    if (this.animation) {
      return;
    }

    this.newPoints = [];

    var n = this.curvePoints.length;
    for (var i = 0; i < this.curvePoints.length; i++) {
      var p1 = this.curvePoints[i];
      var p2 = this.curvePoints[(i + 1) % n];
      if (split) {
        this.newPoints.push(p1);
      }
      this.newPoints.push(averagePoints(p1, p2));
    }

    if (split) {
      this.curvePoints = this.newPoints;
    } else {
      this.animation = ANIMATE_AVERAGE;
    }
  };

  // Create a new average point between each existing point
  Curve.prototype.split = function() {
    if (this.subdivisions !== -1 && this.subdivisions % 2 === 0) {
      this.subdivisions++;
    } else {
      this.subdivisions = -1;
    }

    this.createNewPoints(true);
  };

  // Average each point with the following point
  Curve.prototype.average = function() {
    if (this.subdivisions !== -1 && this.subdivisions % 2 === 1) {
      this.subdivisions++;
    } else {
      this.subdivisions = -1;
    }

    this.createNewPoints();
  };

  Curve.prototype.selectPoint = function() {
    for (var i = 0; i < this.controlPoints.length; i++) {
      if (this.controlPoints[i].mouseOver()) {
        selected = i;
      }
    }
  };

  Curve.prototype.mouseDrag = function() {
    if (selected !== false) {
      var p = this.controlPoints[selected];
      p.x += mouseX - pmouseX;
      p.y += mouseY - pmouseY;
      this.update();
    }
  };

  // Show mouseover information
  Curve.prototype.mouseMove = function() {
    this.mouseoverPoint = false;

    for (var i = 0; i < this.curvePoints.length; i++) {
      var p = this.curvePoints[i];
      if (dist(mouseX, mouseY, p.x, p.y) <= p.r * 0.5) {
        this.mouseoverPoint = p;
        break;
      }
    }
  };
}

var splitCurve = function() {
  if (myCurve.curvePoints.length < MAX_RESOLUTION) {
    myCurve.split();
  } else {
    toolbar.buttons[0].deactivated = true;
  }
};
var averageCurve = function() {
  myCurve.average();
};
var resetCurve = function() {
  myCurve.reset();
  toolbar.buttons[0].deactivated = false;
};

/**************************************
 *  Node tooltip
 ***************************************/

// Convert decimal to fraction,
// assuming its denominator is a power of 2
var findFraction = function(d) {
  var denom = 1;
  while (round(d * denom) !== d * denom && denom < 20000000) {
    denom *= 2;
  }
  return [d * denom, denom];
};

var drawmouseOverInfo = function() {
  if (myCurve.mouseOverPoint) {
    var weights = myCurve.mouseOverPoint.weights;
    var labels = ["A", "B", "C", "D"];
    var terms = [];

    for (var w in weights) {
      if (weights[w] === 1) {
        terms.push(labels[w]);
      } else {
        var frac = findFraction(weights[w]);
        terms.push("(" + frac[0] + "/" + frac[1] + ")" + labels[w]);
      }
    }

    fill(BLUE);
    textAlign(LEFT, CENTER);
    textSize(13);
    text(terms.join(" + "), 8, height - 10);
  }
};

/**************************************
 *  Draw functions
 ***************************************/

var getCurve = function(resolution, points) {
  var curvePoints = [];
  var q = pow(2, resolution);
  var q2 = q * q;
  var n = points.length;

  for (var i = 0; i < n; i++) {
    var p1 = points[(i + n - 1) % n];
    var p2 = points[i % n];
    var p3 = points[(i + 1) % n];

    for (var t = 0; t < q; t++) {
      var s = q - t - 1;
      var a = (s * s + s) / 2;
      var c = (t * t + t) / 2;
      var b = q2 - a - c;

      var x = (p1[0] * a + p2[0] * b + p3[0] * c) / q2;
      var y = (p1[1] * a + p2[1] * b + p3[1] * c) / q2;
      curvePoints.push({
        x: x,
        y: y
      });
    }
  }

  return {
    points: curvePoints,
    draw: function() {
      beginShape();
      for (var i = 0; i < this.points.length; i++) {
        vertex(this.points[i].x, this.points[i].y);
      }
      endShape(CLOSE);
    }
  };

};

var testShape = function() {
  for (var i = 0; i < targetPoints.length; i++) {
    var p1 = targetPoints[i];
    var match = false;

    //ellipse(p1[0], p1[1], 20, 20);

    for (var j = 0; j < myCurve.controlPoints.length; j++) {
      var p2 = myCurve.controlPoints[j];

      if (dist(p1[0], p1[1], p2.x, p2.y) < 20) {
        match = true;
        break;
      }
    }

    if (!match) {
      return false;
    }
  }

  return true;
};

/**************************************
 *  Draw Message
 ***************************************/

var drawMessage = function(message, x, y) {
  //textFont(sansFont, 15);
  textSize(15);
  textLeading(20);

  var nLines = message.split("\n").length;
  var w = textWidth(message) + 20;
  var h = nLines * 22 + 3;

  strokeWeight(3);
  stroke(MESSAGEBLUE);
  fill(255);
  rect(x - w / 2, y, w, h, 20);

  textAlign(CENTER, CENTER);
  fill(20);
  text(message, x, y + h / 2);
};

var getMessage = function() {
  var message;

  if (myCurve.subdivisions === 0) {
    message = "Try to make a smile shape by moving the nodes\nand using Split and Average buttons.";
  } else if (myCurve.subdivisions === -1) {
    message = "Subdivision requires first splitting and then averaging.\nYou can use the Reset button to start again.";
  } else if (myCurve.subdivisions < 6) {
    message = "Try subdividing the shape again.";
  } else if (testShape()) {
    message = "Excellent! You can keep playing or move to the next task.";
  } else {
    message = "Move the control points to reposition the shape.";
  }

  drawMessage(message, width / 2, 10);
};

/**************************************
 *  Main loop
 ***************************************/

function draw() {
  background(BACKGROUND);

  //getMessage();

  strokeWeight(5);
  stroke(200);
  noFill();
  //targetCurve.draw();

  myCurve.draw();
  toolbar.draw();
  drawmouseOverInfo();
};

/**************************************
 *  Event handling
 ***************************************/

mousePressed = function() {
  myCurve.selectPoint();
  toolbar.mousePressed();
};

mouseReleased = function() {
  selected = false;
  toolbar.mouseReleased();
};

mouseDragged = function() {
  myCurve.mouseDrag();
};

mouseMoved = function() {
  //println(mouseX + " " + mouseY);
  myCurve.mouseMove();
};
