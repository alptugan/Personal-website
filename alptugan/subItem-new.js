

var subItem = function(subI) {


  subI.globalX = 0;
  subI.globalY = 0;
  subI.txt = "";
  subI.rad = 0.0;
  subI.posx = 0.0;
  subI.posy = 0.0;
  subI.clr = color(0,0,0);
  //subI.animate = false;

  subI.id = 0;

  subI.selected = false;
  subI.dragging = false;
  subI.tween;
  subI.bezierTween;

  subI.initialPosx = 0;
  subI.initialPosy = 0;
  subI.active = false;
  subI.randomMovementX, subI.randomMovementY, subI.randX, subI.randY, subI.dirX, subI.dirY;

  var updateBezierPoint;
  subI.subCanvas;

  subI.pause = true;
  subI.openComple;

  subI.obj = {
    toX: subI.initialPosx,
    toY: subI.initialPosy,
    opacity: 255,
    scaleFacTxt: 0,
    scaleFac: 0.3
  };

  subI.bez = {
    x: subI.initialPosx,
    y: subI.initialPosy
  };

  subI.delta = 25;
  subI.hoverAnim;
  subI.scaleFacY = 1;
  subI.isActive = true;


  subI.setPosition = function(_globalX, _globalY) {
      subI.globalX = _globalX;
      subI.globalY = _globalY;

  }
  subI.initialize = function(txt, _id, rad, posx, posy, clr, animate) {

    subI.txt = txt;
    subI.rad = rad;
    subI.posx = posx;
    subI.posy = posy;
    subI.clr = clr;
    //subI.animate = animate;

    subI.id = _id;


    subI.tween = TweenMax.to(subI.obj, 0.8, {
      toX: subI.posx,
      toY: subI.posy,
      opacity: 255,
      scaleFac: 1,
      scaleFacTxt: 1,
      ease: Expo.easeOut,
      delay: 0.035 * subI.id,
      onComplete: subI.openComplete,
      onCompleteParams: [subI.id]
    });


    subI.bezierTween = TweenMax.to(subI.bez, 0.8, {
      bezier: {
        values: [{
          x: subI.bez.x,
          y: subI.bez.y
        }, {
          x: subI.posx / 4,
          y: subI.posy / 2
        }, {
          x: subI.posx,
          y: subI.posy
        }]
      },
      ease: Power4.easeOut,
      onUpdate: subI.updateBezierPoint,
      onUpdateParams: [subI.bez.x, subI.bez.y],
      delay: 0.02 * subI.id

    });

    subI.tween.play();
    subI.bezierTween.play();

    // generate random movement velocity
    subI.randomMovementX = random(0.005, 0.3);
    subI.randomMovementY = random(0.005, 0.3);
    subI.randX = 0;
    subI.randY = 0;
    subI.dirX = 1;
    subI.dirY = 1;


  }
  /*
   * *******************************************************************
   * SETUP
   * *******************************************************************
   */
  subI.setup = function() {


  };


  subI.updateBezierPoint = function(re, ro) {

    //console.log(" updating :" + re);
  }

  subI.backToHome = function() {


    subI.tween = TweenMax.to(subI.obj, 0.8, {
      toX: subI.initialPosx,
      toY: subI.initialPosy,
      opacity: 1,
      scaleFac: 0.2,
      scaleFacTxt: 0,
      ease: Power4.easeOut,
      delay: 0.035 * subI.id
    });


    subI.bezierTween = TweenMax.to(subI.bez, 0.8, {
      bezier: {
        values: [{
          x: subI.bez.x,
          y: subI.bez.y
        }, {
          x: subI.posx / 4,
          y: subI.posy / 2
        }, {
          x: subI.initialPosx,
          y: subI.initialPosx
        }]
      },
      ease: Power4.easeOut,
      onUpdate: subI.updateBezierPoint,
      onUpdateParams: [subI.bez.x, subI.bez.y],
      delay: 0.02 * subI.id,
      onComplete: backToHomeComplete
    });


    subI.tween.play();
    subI.bezierTween.play();


  };

  subI.openComplete = function(id) {
    subI.isActive = true;
    console.log(subI.isActive + " " + id);

  }
  var backToHomeComplete = function() {
    parent.home.backToHomeComplete(subI.id);
    subI.remove();
  };



  /*
   * *******************************************************************
   * DRAW FUNCTION
   * *******************************************************************
   */
  subI.draw = function() {
    /*
    console.log("b :" + subI.bez.y + " x " + subI.bez.x);

    console.log("l :" + subI.obj.toX + " x " + subI.obj.toY);*/
    push();
    translate(subI.globalX,subI.globalY);
    if (!subI.mouseOver()) {
      subI.randX += subI.randomMovementX * subI.dirX;
      subI.randY += subI.randomMovementY * subI.dirY;
    }

    if (subI.randX > 10 || subI.randX < -10)
      subI.dirX *= -1;

    if (subI.randY > 10 || subI.randY < -10)
      subI.dirY *= -1;


    if (subI.pause) {
      subI.randX = 0;
      subI.randY = 0;
    }
    // Draw Lines
    push();
    noFill();
    stroke(255, 255, 255, 255);
    strokeWeight(0.7);
    //line(subI.initialPosx, subI.initialPosy, subI.obj.toX, subI.obj.toY);
    //subI.drawBezier(subI.initialPosx, subI.initialPosy, subI.obj.toX, subI.obj.toY);
    //line(subI.initialPosx, subI.initialPosy, subI.bez.x, subI.bez.y);



    // Draw Curves
    subI.drawBezier(subI.initialPosx, subI.initialPosy, subI.bez.x + subI.randX, subI.bez.y + subI.randY, subI.delta);
    //subI.drawBezier(subI.initialPosx, subI.initialPosy, subI.bez.x + subI.randX, subI.bez.y + subI.randY,random(1,100));
    pop();



    // write text
    textSize(10);
    textAlign(CENTER);
    fill(255, 255, 255, subI.obj.opacity);

    push();
    translate(subI.bez.x + subI.randX, subI.bez.y + subI.randY - subI.obj.scaleFac * subI.rad * 0.75);
    scale(subI.obj.scaleFacTxt, subI.obj.scaleFacTxt);
    stroke(51);
    strokeWeight(5);
    text(subI.id + " • " + subI.txt, 0, 0);
    pop();

    // draw circle
    push();
    translate(subI.bez.x + subI.randX, subI.bez.y + subI.randY);
    scale(subI.obj.scaleFac, subI.obj.scaleFac);
    //scale(obj.myProp,obj.myProp);
    fill(255, 204, 0, subI.obj.opacity);
    //noStroke();
    stroke(51);
    strokeWeight(2);

    ellipse(0, 0, subI.rad, subI.rad);
    pop();


    if (subI.mouseOver() || subI.dragging) {


      subI.obj.scaleFac = subI.animate(0.007, 0.5);

      if (subI.isActive) {
        parent.home.hovered(subI.id);
        parent.hoveredItemExist(subI.id, subI.txt,"sub");
        if (parent.currentItemList.length < 2)
          append(parent.currentItemList, subI);
      }
    } else {

      if (subI.isActive) {
        parent.hoveredItemExist(subI.id, "","");
        if (parent.currentItemList.length > 1)
          shorten(parent.currentItemList);


      }
      hoverAnim = 1;
      subI.obj.scaleFac = 1;
      subI.scaleFacY = 1;
      parent.home.unHovered(subI.id);
    }


    pop();

  };

  subI.animate = function(factor, sVal) {

      return 1 + abs(sin(millis() * factor) * sVal);

      //return hoverAnim;
    };
    /*
     * *******************************************************************
     * GET X and Y
     * *******************************************************************
     */
  subI.getX = function() {

    return subI.bez.x + subI.randX;
  }

  subI.getY = function() {
    return subI.bez.y + subI.randY;
  }

  /*
   * *******************************************************************
   * BEZIER CURVE MOVEMENT & DRAWING
   * *******************************************************************
   */
  subI.drawBezier = function(x1, y1, x2, y2, delta) {
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

  subI.mouseOver = function() {

    var r;
    if (subI.isActive == true)
      r = (mouseX + 8 > subI.bez.x + parent.home.posx - subI.rad * 0.5 && mouseX - 8 < subI.bez.x + parent.home.posx + subI.rad * 0.5 &&
        mouseY + 8 > subI.bez.y + parent.home.posy - subI.rad * 0.5 && mouseY - 14 < subI.bez.y + parent.home.posy + subI.rad * 0.5);
    else
      r = false;

    return r;
    //return (dist(subI.bez.x + windowWidth*0.5, subI.bez.y + windowHeight*0.5, mouseX, mouseY) < subI.rad * 0.5);
  };


  /*
   * *******************************************************************
   * MOUSE PRESSED FUNCTION
   * *******************************************************************
   */
  subI.mousePressed = function() {
    if (subI.mouseOver()) {
      subI.selected = true;
      console.log(subI.txt + " is pressed");

      parent.home.pressedItem(subI.id);

    }
  };

  /*
   * *******************************************************************
   * MOUSE DRAGGED FUNCTION
   * *******************************************************************
   */
  subI.mouseDragged = function(dx, dy) {
    if (subI.selected) {
      subI.bez.x += dx;
      subI.bez.y += dy;

    }
  };

  /*
   * *******************************************************************
   * MOUSE RELEASED FUNCTION
   * *******************************************************************
   */
  subI.mouseReleased = function() {
    if (subI.selected) {
      subI.selected = false;
      parent.ItemClicked(subI.id, subI.txt);
      console.log(subI.txt + " is released");
      subI.active = !subI.active;

    
    }


  };

}
