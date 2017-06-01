function button(txt, posx, posy, id, active = false) {
  this.posx = posx;
  this.posy = posy;
  this.txt = txt;
  this.id = id;
  this.active = active;
  this.selected;
  this.w;
  this.h;


  // write text
  textSize(10);
  textAlign(CENTER);

  this.w = textWidth(this.txt);
  this.h = 20;

  this.getButtonWidth = function() {
    return this.w + 20;
  };

  this.draw = function() {

    push();

    if (this.mouseOver()) {
      fill(30, 255);
      stroke(255, 204, 0, 255);
      if (this.active) {
        noStroke();
        fill(255, 204, 0, 255);
      }
    } else {
      if (this.active) {
        noStroke();
        fill(255, 204, 0, 255);
      } else {
        noStroke();
        fill(30, 255);
      }
    }

    //translate(this.posx + (this.w + 20) * 0.5, this.posy + this.h * 0.5);
    //translate( - (this.w + 20) * 0.5, - this.h * 0.5);
    translate(this.posx, this.posy);
    rect(0, 0, this.w + 20, this.h);

    fill(100);
    noStroke();
    text(this.txt, (20 + this.w) * 0.5, this.h * 0.5 + 4);

    pop();



  };


  this.mouseOver = function() {
    /*return (mouseX > this.posx - this.w * 0.5 && mouseX < this.posx + this.w * 0.5 &&
      mouseY > this.posy - this.h * 0.5 && mouseY < this.posy + this.h * 0.5);*/

    return (mouseX > this.posx && mouseX < this.posx + this.w + 20 &&
      mouseY > this.posy && mouseY < this.posy + this.h);

  };

  this.buttonStateChanged = function() {
    
  };

  this.mousePressed = function() {
    if (this.mouseOver()) {
      this.selected = true;
      console.log(this.txt + " is pressed");
    }
  };

  this.mouseDragged = function(dx, dy) {
    if (this.selected) {
      this.posx += dx;
      this.posy += dy;

    }
  };

  this.mouseReleased = function() {
    if (this.selected) {
      this.selected = false;
      this.active = !this.active;
      
      parent.buttonStateChanged(this.id, this.active);

      console.log(this.txt + " is released");
    }
  };
}