function subItem(txt, id, rad, posx, posy, clr) {

console.log();
  this.txt = txt;
  this.rad = rad;
  this.posx = posx;
  this.posy = posy;
  this.clr = clr;
  this.selected = false;
  this.dragging = false;
  this.id = id;
  this.active = false;


  this.tween;
  this.bezierTween;

  this.initialPosx = 0;
  this.initialPosy = 0;

  this.randomMovementX, this.randomMovementY, this.randX, this.randY, this.dirX, this.dirY;

  var updateBezierPoint;
  this.subCanvas;

  this.pause = true;
  this.openComple;

  this.obj = {
    toX: this.initialPosx,
    toY: this.initialPosy,
    opacity: 255,
    scaleFacTxt: 0,
    scaleFac: 0.3
  };

  this.bez = {
    x: this.initialPosx,
    y: this.initialPosy
  };

  this.delta = 25;
  this.hoverAnim;
  this.scaleFacY = 1;
  this.isActive = true;


  /*
   * *******************************************************************
   * SETUP
   * *******************************************************************
   */
  this.setup = function() {

    this.tween = TweenMax.to(this.obj, 0.8, {
      toX: this.posx,
      toY: this.posy,
      opacity: 255,
      scaleFac: 1,
      scaleFacTxt: 1,
      ease: Expo.easeOut,
      delay: 0.035 * this.id,
      onComplete: this.openComplete,
      onCompleteParams: [this.id]
    });

    this.bezierTween = TweenMax.to(this.bez, 0.8, {
      bezier: {
        values: [{
          x: this.bez.x,
          y: this.bez.y
        }, {
          x: this.posx / 4,
          y: this.posy / 2
        }, {
          x: this.posx,
          y: this.posy
        }]
      },
      ease: Power4.easeOut,
      onUpdate: this.updateBezierPoint,
      onUpdateParams: [this.bez.x, this.bez.y],
      delay: 0.02 * this.id

    });

    this.tween.play();
    this.bezierTween.play();

    // generate random movement velocity
    this.randomMovementX = random(0.005, 0.3);
    this.randomMovementY = random(0.005, 0.3);
    this.randX = 0;
    this.randY = 0;
    this.dirX = 1;
    this.dirY = 1;
  };


  this.updateBezierPoint = function(re, ro) {

    //console.log(" updating :" + re);
  }

  this.backToHome = function() {
    this.tween = TweenMax.to(this.obj, 0.8, {
      toX: this.initialPosx,
      toY: this.initialPosy,
      opacity: 1,
      scaleFac: 0.2,
      scaleFacTxt: 0,
      ease: Power4.easeOut,
      delay: 0.035 * this.id
    });


    this.bezierTween = TweenMax.to(this.bez, 0.8, {
      bezier: {
        values: [{
          x: this.bez.x,
          y: this.bez.y
        }, {
          x: this.posx / 4,
          y: this.posy / 2
        }, {
          x: this.initialPosx,
          y: this.initialPosx
        }]
      },
      ease: Power4.easeOut,
      onUpdate: this.updateBezierPoint,
      onUpdateParams: [this.bez.x, this.bez.y],
      delay: 0.02 * this.id,
      onComplete: backToHomeComplete
    });


    this.tween.play();
    this.bezierTween.play();


  };

  this.openComplete = function(id) {
    this.isActive = true;
    console.log(this.isActive + " " + id);

  }
  var backToHomeComplete = function() {
    parent.home.backToHomeComplete(id);
  };



  /*
   * *******************************************************************
   * DRAW FUNCTION
   * *******************************************************************
   */
  this.draw = function() {
    /*
    console.log("b :" + this.bez.y + " x " + this.bez.x);

    console.log("l :" + this.obj.toX + " x " + this.obj.toY);*/

    if (!this.mouseOver()) {
      this.randX += this.randomMovementX * this.dirX;
      this.randY += this.randomMovementY * this.dirY;
    }

    if (this.randX > 10 || this.randX < -10)
      this.dirX *= -1;

    if (this.randY > 10 || this.randY < -10)
      this.dirY *= -1;


    if (this.pause) {
      this.randX = 0;
      this.randY = 0;
    }
    // Draw Lines
    push();
    noFill();
    stroke(255, 255, 255, 255);
    strokeWeight(0.7);
    //line(this.initialPosx, this.initialPosy, this.obj.toX, this.obj.toY);
    //this.drawBezier(this.initialPosx, this.initialPosy, this.obj.toX, this.obj.toY);
    //line(this.initialPosx, this.initialPosy, this.bez.x, this.bez.y);

    // Draw Curves
    this.drawBezier(this.initialPosx, this.initialPosy, this.bez.x + this.randX, this.bez.y + this.randY, this.delta);
    //this.drawBezier(this.initialPosx, this.initialPosy, this.bez.x + this.randX, this.bez.y + this.randY,random(1,100));
    pop();



    // write text
    textSize(10);
    textAlign(CENTER);
    fill(255, 255, 255, this.obj.opacity);

    push();
    translate(this.bez.x + this.randX, this.bez.y + this.randY - this.obj.scaleFac * this.rad * 0.75);
    scale(this.obj.scaleFacTxt, this.obj.scaleFacTxt);
    stroke(51);
    strokeWeight(5);
    text(this.id + " • " + this.txt, 0, 0);
    pop();

    // draw circle
    push();
    translate(this.bez.x + this.randX, this.bez.y + this.randY);
    scale(this.obj.scaleFac, this.obj.scaleFac);
    //scale(obj.myProp,obj.myProp);
    fill(255, 204, 0, this.obj.opacity);
    //noStroke();
    stroke(51);
    strokeWeight(2);
    ellipse(0, 0, this.rad, this.rad);
    pop();


    if (this.mouseOver() || this.dragging) {


      this.obj.scaleFac = this.animate(0.007, 0.5);

      if (this.isActive) {
        parent.home.hovered(this.id);
        parent.hoveredItemExist(this.id, this.txt,"sub");
        if (parent.currentItemList.length < 2)
          append(parent.currentItemList, this);
      }
    } else {

      if (this.isActive) {
        parent.hoveredItemExist(this.id, "","");
        if (parent.currentItemList.length > 1)
          shorten(parent.currentItemList);


      }
      hoverAnim = 1;
      this.obj.scaleFac = 1;
      this.scaleFacY = 1;
      parent.home.unHovered(this.id);
    }




  };

  this.animate = function(factor, sVal) {

      return 1 + abs(sin(millis() * factor) * sVal);

      //return hoverAnim;
    }
    /*
     * *******************************************************************
     * GET X and Y
     * *******************************************************************
     */
  this.getX = function() {

    return this.bez.x + this.randX;
  }

  this.getY = function() {
    return this.bez.y + this.randY;
  }

  /*
   * *******************************************************************
   * BEZIER CURVE MOVEMENT & DRAWING
   * *******************************************************************
   */
  this.drawBezier = function(x1, y1, x2, y2, delta) {
    bezier(x1, y1,
      x1 * delta, y1,
      x2 / delta, y2,
      x2, y2);


    steps = 10;
    for (i = 0; i <= steps; i++) {
      t = i / steps;
      x = bezierPoint(x1, x1 * delta, x2 / delta, x2, t);
      y = bezierPoint(y1, y1, y2, y2, t);
      fill(51);
      ellipse(x, y, 5, 5);
    }


  }

  /*
   * *******************************************************************
   * MOUSE OVER FUNCTION
   * *******************************************************************
   */

  this.mouseOver = function() {

    var r;
    if (this.isActive == true)
      r = (mouseX + 8 > this.bez.x + parent.home.posx - this.rad * 0.5 && mouseX - 8 < this.bez.x + parent.home.posx + this.rad * 0.5 &&
        mouseY + 8 > this.bez.y + parent.home.posy - this.rad * 0.5 && mouseY - 14 < this.bez.y + parent.home.posy + this.rad * 0.5);
    else
      r = false;

    return r;
    //return (dist(this.bez.x + windowWidth*0.5, this.bez.y + windowHeight*0.5, mouseX, mouseY) < this.rad * 0.5);
  };


  /*
   * *******************************************************************
   * MOUSE PRESSED FUNCTION
   * *******************************************************************
   */
  this.mousePressed = function() {
    if (this.mouseOver()) {
      this.selected = true;
      console.log(this.txt + " is pressed");

      parent.home.pressedItem(this.id);

    }
  };

  /*
   * *******************************************************************
   * MOUSE DRAGGED FUNCTION
   * *******************************************************************
   */
  this.mouseDragged = function(dx, dy) {
    if (this.selected) {
      this.bez.x += dx;
      this.bez.y += dy;

    }
  };

  /*
   * *******************************************************************
   * MOUSE RELEASED FUNCTION
   * *******************************************************************
   */
  this.mouseReleased = function() {
    if (this.selected) {
      this.selected = false;
      parent.ItemClicked(this.id, this.txt);
      console.log(this.txt + " is released");
      this.active = !this.active;
    }
  };





}
