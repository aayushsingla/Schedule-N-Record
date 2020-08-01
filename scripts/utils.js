
function loadAddAlarm(){
	var addAlarmbutton = document.getElementById("addAlarmButton");
	addAlarmbutton.addEventListener("click", createCustomAlarm);
	
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
	var days = getDaysForAlarm();
	console.log(days);
	var startTime=$("#start").val();
	console.log(startTime);
	var endTime=$("#end").val();
	console.log(startTime);
	var url=$("#url").val();
	console.log(url);
	var destinationFile = $("#destination").val();
	console.log(destination);

	var type = $('#alarmType').find(":selected").val();
	console.log(type);

	var purpose = "start";

	calculateDelay(startTime);

	//createAlarm(alarmName, delayInMinutes);
	var jsonobject = getJSONAlarm(name,startTime,endTime,url,destinationFile, type, purpose);
	console.log(jsonobject)
 	chrome.storage.sync.set(jsonobject, function() {
    	console.log('Alarm is set to ' + JSON.stringify(jsonobject));
    });

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
		console.log(isOneMarked)	

	});

	if(!isOneMarked){
		selecteditems = null;
	}
	return selecteditems;
}

function getJSONAlarm(name,startTime,endTime,url,destinationFile, type,purpose){
	obj = {
		"alarms":{
			"name":name,
			"startTime": startTime,
			 "endTime":endTime,
			 "url":url,
			 "destinationFile": destinationFile,
			 "type": type,
			 "purpose": purpose
		}
	}
	return obj;
};


function calculateDelay(alarmTime){
	var today = new Date();
	var hour = today.getHours();
	var minute =today.getMinutes();
	var alarmTime = alarmTime.split(":");
	console.log(alarmTime)


}

