function Item(txt, id, rad, posx, posy, clr, animate) {
  this.txt = txt;
  this.rad = rad;
  this.posx = posx;
  this.posy = posy;
  this.clr = clr;
  this.animate = animate;
  this.selected = false;
  this.dragging = false;
  this.id = id;
  this.active = false;
  this.items = [];

  this.teta = [];
  this.x = [];
  this.y = [];

  this.tt = 0;

  this.tx = 0;
  this.ty = 0;

  this.overlapping;
  this.otherX = 0;
  this.otherY = 0;

  this.activateHome = true;

  this.obj = {
    myProp: this.rad
  };

  this.currentSubItem = -1;



  /*
   * *******************************************************************
   * SETUP
   * *******************************************************************
   */
  this.setup = function() {
    this.tween = TweenMax.to(this.obj, 1, {
      myProp: 25,
      repeat: -1,
      yoyo: true,
      ease: Back.easeOut.config(2.7)
    });
  };


  /*
   * *******************************************************************
   * DRAW FUNCTION
   * *******************************************************************
   */
  this.draw = function() {


    push();
    translate(this.posx, this.posy);


    for (var i = 0; i < this.items.length; i++) {
      push();
      stroke(255);

      if (i != 0) {
        //line(this.items[i - 1].getX(), this.items[i - 1].getY(), this.items[i].getX(), this.items[i].getY());
      } else {
        //line(this.items[i].getX(), this.items[i].getY(), this.items[this.items.length - 1].getX(), this.items[this.items.length - 1].getY());
      }

      for (var j = 0; j < this.items.length; j++) {
        var distance = dist(this.items[i].getX(), this.items[i].getY(), this.items[j].getX(), this.items[j].getY());
        if (i != j && distance < 200) {
          strokeWeight(map(distance, 0, 200, 0.3, 0.01));
          line(this.items[i].getX(), this.items[i].getY(), this.items[j].getX(), this.items[j].getY());
        } else {
          //line(this.items[i].getX(), this.items[i].getY(), this.items[this.items.length - 1].getX(), this.items[this.items.length - 1].getY());
        }

      }

      /*
      Draw all of them together

      for (var j = 0; j < this.items.length; j++) {
        if (i != j) {
          line(this.items[i].getX(), this.items[i].getY(), this.items[j].getX(), this.items[j].getY());
        } else {
          //line(this.items[i].getX(), this.items[i].getY(), this.items[this.items.length - 1].getX(), this.items[this.items.length - 1].getY());
        }
      }*/
      pop();
    }

    for (var i = 0; i < this.items.length; i++) {
      this.items[i].draw();
    }


    // write text
    push();

    textSize(10);
    textAlign(CENTER);
    fill(255);

    if (this.animate)
      translate(0, -this.rad * 0.5 - this.obj.myProp + 5);
    else
      translate(0, -this.rad * 0.7);

    strokeCap(ROUND);
    strokeJoin(ROUND);
    stroke(51);
    strokeWeight(8);
    text(this.txt, 0, 0);
    pop();

    // draw circle
    //scale(obj.myProp,obj.myProp);
    fill(255, 204, 0);
    stroke(51);
    if (this.animate)
      ellipse(0, 0, this.rad + this.obj.myProp, this.rad + this.obj.myProp);
    else
      ellipse(0, 0, this.rad, this.rad);




    pop();

    //parent.context._blurRect(this.posx - this.rad * 5, this.posy - this.rad * 5, this.rad * 10, this.rad * 10,0, 1);

    if (this.mouseOver() || this.dragging) {
      //console.log(this.txt + "mouseOver");
      this.tween.pause();
      if(parent.currentItemList.length < 1) {
        append(parent.currentItemList,this);
      }
      parent.hoveredItemExist(this.id,this.txt,"home");



    } else {
      this.tween.play();

      if(parent.currentItemList.length == 1) {
        shorten(parent.currentItemList);
      }

      parent.hoveredItemExist(-1,"","");

    }


  };

  this.mouseOver = function() {
    /*return (mouseX > this.posx - this.rad * 0.5 && mouseX < this.posx + this.rad * 0.5 &&
      mouseY > this.posy - this.rad * 0.5 && mouseY < this.posy + this.rad * 0.5);*/
    return (dist(this.posx, this.posy, mouseX, mouseY) < this.rad * 0.5 + 10);
  };


  this.mousePressed = function() {
    for (var j = 0; j < this.items.length; j++) {
      if (j == this.items.length - 1)
        this.items[j].mousePressed();
    }


    if (this.mouseOver() && this.activateHome) {
      this.selected = true;
      console.log(this.txt + " is pressed");
    }
  };

  this.mouseDragged = function(dx, dy) {
    /*for (var j = 0; j < this.items.length; j++) {
      this.items[j].mouseDragged(dx, dy);
    }*/

    if (this.currentSubItem != -1)
      this.items[this.items.length - 1].mouseDragged(dx, dy);

    if (this.selected) {
      this.posx += dx;
      this.posy += dy;

    }
  };

  this.mouseReleased = function() {

    for (var j = 0; j < this.items.length; j++) {
      if (j == this.items.length - 1)
        this.items[j].mouseReleased();
    }



    if (this.selected && this.activateHome) {
      this.selected = false;
      parent.ItemClicked(this.id, this.txt);
      //console.log(this.txt + " is released");

      if (this.txt == parent.data.homeName) {
        if (!this.active)
          this.showMenuItems();
        else
          this.hideMenuItems();
      }

      this.active = !this.active;
    }
  };


  this.pressedItem = function(id) {

  }

  this.hovered = function(id) {
    this.currentSubItem = id;


    for (var j = 0; j < this.items.length; j++) {
      if (j != this.currentSubItem)
        this.items[j].isActive = false;
      else
        this.items[j].isActive = true;
    }



    // Create temporary item
    /*var tempItem = this.items[id];

    // Switch z depth
    this.items[id] = this.items[this.items.length - 1];
    this.items[this.items.length - 1] = tempItem;

    // Switch Positions
    this.items[id].id = id;
    this.items[this.items.length - 1].id = this.items.length - 1;
*/


    //this.items[id] = this.items[this.items.length - 1];
    //this.items[this.items.length - 1] = tempItem;

  };

  this.unHovered = function(id) {
    this.currentSubItem = id;

    for (var j = 0; j < this.items.length; j++) {

      this.items[j].isActive = true;
    }

    this.currentSubItem = -1;
  }

  this.showMenuItems = function() {

    this.teta = [];
    this.x = [];
    this.y = [];

    /*
    for (var i = 0; i < parent.itemsData.length; i++) {
      this.tt += (radians(10));

      this.tx = cos(this.tt) * 150;
      this.ty = sin(this.tt) * 150;

      this.teta.push(this.tt);

      this.x.push(this.tx);
      this.y.push(this.ty);

    };*/

    while (this.x.length < parent.itemsData.length) {
      this.tt = random(radians(360));


      this.tx = cos(this.tt) * random(150, 250);
      this.ty = sin(this.tt) * random(150, 250);

      this.tx = cos(this.tt) * 150;
      this.ty = sin(this.tt) * 150;

      this.overlapping = false;

      for (var j = 0; j < this.x.length; j++) {
        this.otherX = this.x[j];
        this.otherY = this.y[j];
        if (dist(this.tx, this.ty, this.otherX, this.otherY) < 60) {
          this.overlapping = true;
        }
      }

      if (this.overlapping == false) {
        this.teta.push(this.tt);

        this.x.push(this.tx);
        this.y.push(this.ty);
      }
    }


    for (var i = 0; i < parent.itemsData.length; i++) {

      this.items.push(new subItem(parent.itemsData[i].name, i, parent.data.menuFontSize,
        this.x[i], this.y[i],
        color(parent.data.homeRed, parent.data.homeGreen, parent.data.homeBlue)));

      this.items[i].setup();
    }
  };

  this.hideMenuItems = function() {
    this.activateHome = false;
    for (var i = 0; i < parent.itemsData.length; i++) {
      this.items[i].backToHome();
    }
  };

  this.backToHomeComplete = function(id) {

    //this.items.splice(id,1);
    this.items.pop();
    //console.log(this.items.length);

    if (this.items.length == 0) {
      this.activateHome = true;
    } else {
      this.activateHome = false;
    }
  }






}
