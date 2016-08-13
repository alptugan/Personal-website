var vid = document.getElementById("bgvid");
var pauseButton = document.querySelector("#polina button");

var myObj = {name: "Richard", profession: "Developer"};


(function() {
   // your page initialization code here
   // the DOM will be available here
	 console.log("browser is ready");
	 var color = new nl.stroep.utils.Color(0xFFCC00); // define orange.
		color.green = 0; // remove green.. now it is red..
		color.blue = 255; // add some blue.. now it is purple..
		//alert(color.value.toString(16)) // alerts FF00FF and that is purple.

		var item = new com.alptugan.Item("HOME","#ffcc00");
		console.log(item.color);



})();






/*
function Color( value )
{
    // public variable
    this.value = value || 0xFFFFFF; // set default value to 0xFFFFFF for parameter if it isn’t defined
    // private variable
    var _name = "test";
   // public function
   this.getRandomColor = function( )
  {
     return Math.random() * 0xFFFFFF;
  }
  // private function
  function getNiceColor()
  {
     return 0xffcc00;
  }
}
// create instance of Color
var color = new Color(0xFF0000);
console.log( color.value ); // returns red color
console.log( color.getRandomColor() ); // returns random color
// not possible :
//console.log( color.getNiceColor() );// error in console; property does not exist, because function is private.
console.log( color._name ); // error in console; property does not exist, because variable is private.



/// create namespace like ‘com.yourcompany.projectname’
function Namespace(namespace)
{
    var parts = namespace.split(".");
    var root = window;
    for(var i = 0; i < parts.length; i++)
    {
        if(typeof root[parts[i]] == "undefined")
        {
            root[parts[i]] = {};
        }
        root = root[parts[i]];
    }
}
// creating my own namespace here
Namespace("nl.stroep.utils");
nl.stroep.utils.Color = function(value) // create class inside package
{
  this.value = value || 0xFFFFFF;
}
var myRedColor =  new nl.stroep.utils.Color(0xff0000);
alert(myRedColor.value);

*/
/*
function Employee () {}
Employee.prototype.firstName = "Abhijit";
Employee.prototype.lastName = "Patel";
Employee.prototype.startDate = new Date();
Employee.prototype.signedNDA = true;
Employee.prototype.fullName = function () {
	console.log (this.firstName + " " + this.lastName);
};


var abhijit = new Employee();
console.log(abhijit.fullName()); // Abhijit Patel​
console.log(abhijit.signedNDA); // true
*/



/*pauseButton.addEventListener("click", function() {
	vid.classList.toggle("stopfade");
	if (vid.paused) {
		vid.play();
		pauseButton.innerHTML = "Pause";
	} else {
		vid.pause();
		pauseButton.innerHTML = "Paused";
	}
})*/
