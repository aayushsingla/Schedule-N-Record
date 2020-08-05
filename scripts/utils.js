
function loadAddAlarm(){

	var addAlarmbutton = document.getElementById("addAlarmButton");
	addAlarmbutton.addEventListener("click", createCustomAlarm);
	$("#DatePicker").css({"display":"none"});
	
	$( "#alarmType" ).change(function() {
		var selectedItem = $('#alarmType').find(":selected").val();
		if(selectedItem == "once"){
			$('#AddAlarmDatePicker').css({"display":"block"});
			$('#checkbox-table').css({"display":"none"});

		} else {
			$('#AddAlarmDatePicker').css({"display":"none"});
			$('#checkbox-table').css({"display":"block"});
		}
		

	});

}

function createCustomAlarm(){
//	var x = document.getElementById("myCheck").checked;
	var startTime=$("#start").val();
	console.log(startTime);
	var endTime=$("#end").val();
	console.log(endTime);
	var url=$("#url").val();
	console.log(url);
	var destinationFile = $("#destination").val();
	console.log(destinationFile);

	var type = $('#alarmType').find(":selected").val();
	console.log(type);
	var name = Date.now();
	console.log("id "+ name);
	var purpose = "start";
	var source = "custom";
		
	if(type == "once"){
		var date = $('#dateSchedule').datepicker({ dateFormat: 'dd,MM,yyyy' }).val();	
		console.log("Date: " + date);
	
		//setting alarm to start recording 


		var jsonobject = getJSONAlarm(name,startTime,endTime,url,destinationFile,date ,type, purpose,source);
		if(jsonobject != null){
			var delayInMinutes = calculateDelay(startTime, date);
			console.log("minutes delay: "+ delayInMinutes);

		 	chrome.storage.sync.set(jsonobject, function() {
		    	
		    	console.log('Storage set to' + JSON.stringify(jsonobject));
				createAlarm(name, delayInMinutes);
				showSnackbar("Alarm Created!"); 

		    });
			
		} else{
			showSnackbar("Schedule not created.") 
			return;
		}

	}else{

		// var day = (new Date()).getDay();
		// var days = getDaysForAlarm();
		// console.log(days);
		// var jsonobject = getJSONAlarm(name,startTime,endTime,url,destinationFile,date ,type, purpose);
		// if(jsonobject != null){
		// 	var delayInMinutes = calculateDelay(startTime, date);
		// 	console.log("minutes delay: "+ delayInMinutes);

		//  	chrome.storage.sync.set(jsonobject, function() {
		    	
		//     	console.log('Storage set to' + JSON.stringify(jsonobject));
		// 		createAlarm(name, delayInMinutes);
		// 		$("#warning").text("Alarm Created!"); 

		//     });
		


	}
}




/*	returns an array of integers 1 and 0 depending on checkbox state for all 7 days
	or null if no checkbox is checked
*/
function getDaysForAlarm(){
	var selecteditems = []
	var isOneMarked = false;
	$("#checkbox-table").find("input").each(function (i, ob) { 
    	var value = $(ob).is(":checked");
    	selecteditems.push(value);
    	if(value == true)
    		isOneMarked = value;
	});

	if(!isOneMarked){
		selecteditems = null;
	}
	return selecteditems;
}

function getJSONAlarm(name,startTime,endTime,url,destinationFile, date,type,purpose, source){
	var areParametersCorrect = true;  	
	// var today = new Date();
	// var hour = today.getHours();
	// var minute =today.getMinutes();
	// var day = today.getDay();

	if(!url.includes("meet.google.com")){
		if(areParametersCorrect == true)
			areParametersCorrect = false;

		showSnackbar("provided url is not a google meet url."); 
		console.log("URL provided is not a google meet url");
	}


	/* {TODO::}

	A check for destination exits needs to be added here. */

	if(type == null || purpose == null){
		console.log("Type or purpose not provided");
		return null;
	}

 	if(type == "once"){
		/* 	[TODO:]
			check if Date, startTime are in future 			
		*/
		var minutes = calculateDelay(startTime, date);
		console.log("minutes: "+ minutes);
		if(minutes < 1){
			showSnackbar("Start Time is Invalid"); 
			console.log("Start Time is Invalid");

			return null;
		}
	}

	if(areParametersCorrect){
		obj = {    
			[name]:{
				"name":name,
				"startTime": startTime,
				 "endTime":endTime,
				 "url":url,
				 "destinationFile": destinationFile,
				 "type": type,
				 "date":date,
				 "delay": minutes,
				 "purpose": purpose,
				 "source":source
				}
			}
	} else {
		obj = null;
	}

	return obj;
};


function calculateDelay(alarmTime, date){

	var alarmTime = alarmTime.split(":");
	date = date.split("-");
	console.log(date);
	
	
	var today = new Date();
	console.log(today.toString());
	var end = new Date(date[0], date[1]-1, date[2], alarmTime[0], alarmTime[1], 0,0)
	console.log(end.toString());

	var minutes =  Math.round((end - today)/60000); // minutes

	return minutes;	
}
