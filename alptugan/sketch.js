// Goto folder of these files in terminal and start server
// http-server -c-1 -o
p5.disableFriendlyErrors = true;

var canvas;
var context;

var x;
var y;

var blurEffect;
var saturationValue;


var scx;
var scy;

var home;

var controlPoints = [];

var obj = {
  myProp: 20
};

var currentItemCount;
var lastItem;

var data;
var itemsData;

var button1, button2;

var blurFilter1 = new PIXI.filters.BlurFilter();

var currentItemList = [];

function preload(src) {
  // LOAD DATA
  data = loadJSON("data.json");
}

var myCanvas;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);
  parseData();

  scx = myCanvas.width * 0.5;
  scy = myCanvas.height * 0.5;


  for (var i = 0; i < itemsData.length; i++) {
    //console.log(itemsData[i].name);
  }

  home = new Item(data.homeName, 0, data.homeFontSize, scx, scy, color(data.homeRed, data.homeGreen, data.homeBlue), true);

  home.setup();



  button1 = new button("Line", 0, 0, 0, true);
  button2 = new button("Bezier", button1.getButtonWidth() + 1, 0, 1, false);
  //var tween = TweenMax.to(obj, 0.8, {myProp: 25,repeat: -1,yoyo: true,ease: Back.easeOut.config(2.7)});

  //var canvas = document.getElementById("canvas");
  //var ctx = canvas.getContext("2d");


  canvas = document.getElementById('defaultCanvas0');
  context = canvas.getContext('2d');

  x = 0;
  y = 0;
  width = 500;
  height = 500;
  blurEffect = 0.01;
  saturationValue = 2;



}

function parseData() {
  itemsData = data.items;
}





function draw() {

  background(51);

  //fill(255);
  //ellipse(20,20,50+obj.myProp,50+obj.myProp);

  /*
      arrayCopy(items, tempItems);

      lastItem = items.length - 1;

      if (i != lastItem) {
        currentItemCount = i;

        items.splice(currentItemCount, 1);
        append(items, tempItems[currentItemCount]);
      }
      console.log(items[lastItem].txt + "mouseOver");
      items[lastItem].tween.pause();

  */

  home.draw();

  button1.draw();
  button2.draw();

  push();

  translate(10, 20);
  fill(255);
  textSize(10);
  textAlign(LEFT);
  text("fps : " + round(frameRate()), 0, 0);
  pop();
  //console.log("len : " + currentItemList.length);
}


function buttonStateChanged(id, isActive) {
  console.log(id + " " + isActive);

  if (id == 0) {
    if (isActive) {
      button2.active = false;

    }
  }

  if (id == 1) {
    if (isActive) {
      button1.active = false;

    }
  }

}

function ItemClicked(id, name) {
  console.log("Click event is received from :" + id + " " + name + " is active: " + home.selected);
}

function hoveredItemExist(id, name,section) {


  if (name != "" ) {
    if (currentItemList.length > 0)
      cursor(HAND);
  } else
    cursor(ARROW);


}

function mousePressed() {
  home.mousePressed();
  button1.mousePressed();
  button2.mousePressed();
  /*for (i = 0; i < items.length; i++) {
    items[i].mousePressed();
  }*/

  //teta = (0.5235); or
  //teta = radians(30);
}

function mouseReleased() {
  home.mouseReleased();
  button1.mouseReleased();
  button2.mouseReleased();
  /*for (i = 0; i < items.length; i++) {
    items[i].mouseReleased();
  }*/
}

function mouseDragged() {
  home.mouseDragged(mouseX - pmouseX, mouseY - pmouseY);

  /*for (i = 0; i < items.length; i++) {
    items[i].mouseDragged(mouseX - pmouseX, mouseY - pmouseY);
  }*/
}
