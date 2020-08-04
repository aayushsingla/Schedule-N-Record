
var currentPage = "Alarm";

$(document).ready(function(){
	loadAddAlarmBody();
	
	var addAlarmbutton = document.getElementById("addSchedule");
	addAlarmbutton.addEventListener("click", loadAddAlarmBody);
	
	var aayush = document.getElementById("aayush");
	aayush.addEventListener("click", loadAayush);
	
	var hardik = document.getElementById("hardik");
	hardik.addEventListener("click", loadHardik);
	
	var source = document.getElementById("source");
	source.addEventListener("click", loadSource);


	function loadAddAlarmBody(){
		
		if(currentPage == "Home"){
			 $("#container").load("./addAlarm.html", function(){
		  		console.log("Add Alarm Loaded");
		  		loadAddAlarm();
		  		currentPage = "Alarm";
				$("#addSchedule").removeClass("fa-calendar-plus-o");
				$("#addSchedule").addClass(" fa-home");
			});
		
		}else {
			$("#container").load("./home.html", function(){
	  			console.log("Home Loaded");
	  			loadHome();
				currentPage = "Home";
		  		$("#addSchedule").removeClass("fa-home");
		  		$("#addSchedule").addClass(" fa-calendar-plus-o");
		  	
			});
		}
	}



});


function loadAayush(){
	chrome.tabs.create({"url": "https://aayushsingla.github.io"}, null);			
}


function loadHardik(){
	chrome.tabs.create({"url": "https://www.linkedin.com/in/hardik-gupta-94627412b/"}, null);			
}

function loadSource(){
	chrome.tabs.create({"url": "https://github.com/aayushsingla/Schedule-N-Record"}, null);			
}


function showSnackbar(str) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  x.innerHTML = str;

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}





