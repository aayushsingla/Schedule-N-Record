
var currentPage = "Home";

$(document).ready(function(){
	$("#container").load("./home.html", function(){
		loadHome();
	});	
	var addAlarmbutton = document.getElementById("addSchedule");
	console.log(addAlarmbutton);
	addAlarmbutton.addEventListener("click", loadAddAlarmBody);
	
	var aayush = document.getElementById("aayush");
	console.log(aayush);
	aayush.addEventListener("click", loadAayush);
	
	var hardik = document.getElementById("hardik");
	console.log(hardik);
	hardik.addEventListener("click", loadHardik);
	
	var source = document.getElementById("source");
	console.log(source);
	source.addEventListener("click", loadSource);

	var sync = document.getElementById("syncButton");
	console.log(sync);
	sync.addEventListener("click", sync_google);


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
	  			populateHome();
				currentPage = "Home";
		  		$("#addSchedule").removeClass("fa-home");
		  		$("#addSchedule").addClass(" fa-calendar-plus-o");
		  	
			});
		}
	}
	
	function sync_google(){
		console.log("Syncing...");
		isSignedIn(function(bool){
			if(!bool){
				showSnackbar("Please Sign In to sync with Google Calendar");
			}else{
				showSnackbar("Syncing with your Google Account. Please Wait.");
				populateHome();
			}

		});
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


function isSignedIn(callback){
	console.log("about to start");
	chrome.identity.getAuthToken({interactive: false}, function (token) {
		console.log(token);
	    if (!token) {
	        console.log("not signed in");
	        callback(false);
	    } else {
	        console.log("signed in");
	        callback(true);	
	    }
    
	});
}


function getUserEmail(){
	chrome.identity.getProfileUserInfo(function(object){
		console.log(object.email);

	});	
}



