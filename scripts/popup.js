
// chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
//   // Use the token.
//   console.log(token)
// });
var currentPage = "Alarm";

$(document).ready(function(){
	var addAlarmbutton = document.getElementById("addSchedule");
	addAlarmbutton.addEventListener("click", loadAddAlarmBody);
	
	var aayush = document.getElementById("aayush");
	aayush.addEventListener("click", loadAayush);
	
	var hardik = document.getElementById("hardik");
	hardik.addEventListener("click", loadHardik);
	
	var source = document.getElementById("source");
	source.addEventListener("click", loadSource);

	document.getElementById('date').valueAsDate = new Date();

	var incrementArrow = document.getElementById("increment");
	incrementArrow.addEventListener("click", incrementDate);
	
	var decrementArrow = document.getElementById("decrement");
	decrementArrow.addEventListener("click", decrementDate);
	
	loadAddAlarmBody();
	
	function loadAddAlarmBody(){
		
		if(currentPage == "Home"){
			 $("#container").load("./addAlarm.html", function(){
		  		console.log("Add Alarm Loaded");
		  		loadAddAlarm();
		  		currentPage = "Alarm";
				$("#warning").text(""); 
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
				$("#warning").text("");
		  	
			});
		}
	}

	function incrementDate(){
		var date_schedule = $('#date').datepicker().val();
		date_schedule = new Date(date_schedule);
		document.getElementById('date').valueAsDate = new  Date(date_schedule.getTime()+1000*60*60*24);
	}

	function decrementDate(){
		var date_schedule = $('#date').datepicker().val();
		date_schedule = new Date(date_schedule);
		document.getElementById('date').valueAsDate = new  Date(date_schedule.getTime()-1000*60*60*24);
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



  

