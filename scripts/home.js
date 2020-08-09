
var API_KEY = 'AIzaSyAhOqnFST_yoNODg9jdWrtjZuKOEdLQ0a4';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];


function loadHome(){
	var date  = document.getElementById('date');
	$("#DatePicker").css({"display":"block"});
	$("#date").on("change",populateHome);
	date.valueAsDate = new Date();
	$("#date").trigger("change");


	var incrementArrow = document.getElementById("increment");
	incrementArrow.addEventListener("click", incrementDate);
	
	var decrementArrow = document.getElementById("decrement");
	decrementArrow.addEventListener("click", decrementDate);

	
}

function populateHome(){
	$("#DatePicker").css({"display":"block"});
	$("#loaderBox").css({"display":"block"});
	$("#homeBoxes").css({"display":"none"});
	chrome.storage.onChanged.removeListener(listenForChanges);
	isSignedIn(function(bool){
		if(bool){
			sync_calendar();
		}else{
			fetchLists();
		}
	});
}


function incrementDate(){
	var date_schedule = $('#date').datepicker().val();
	date_schedule = new Date(date_schedule);
	document.getElementById('date').valueAsDate = new  Date(date_schedule.getTime()+1000*60*60*24);
	$("#date").trigger("change");
}

function decrementDate(){
	var date_schedule = $('#date').datepicker().val();
	date_schedule = new Date(date_schedule);
	document.getElementById('date').valueAsDate = new  Date(date_schedule.getTime()-1000*60*60*24);
	$("#date").trigger("change");
}


function fetchLists(){

	var upcoming = [];
	var ongoing = [];
	var unscheduled = [];

	chrome.storage.sync.get(function(object, area){
		var date = $('#date').datepicker({ dateFormat: 'dd,MM,yyyy' }).val();
		console.log("abc",object);
		if(JSON.stringify(object)!="{}"){

			console.log(JSON.stringify(object));
			object = object[date];
			console.log(object);
			if(!(object == undefined || object == true)){
				var keys = Object.keys(object);
				console.log(keys.length);
				for(var i=0; i < keys.length;i++){
					var child = object[keys[i]];
					console.log(child["date"]);
					child["delay"] = calculateDelay(child["startTime"],child["date"]);
					if(child["date"] == date){
						if(child["scheduled"]){
							console.log(child);
							if(child["purpose"] == "start"){
								console.log(child);
								upcoming.push(child);
							}else{
								console.log(child);
								ongoing.push(child);
							}

						}else {
							console.log(child);
							unscheduled.push(child);
						}
					}
				}
			}
			$("#list_ongoing").empty();
			$("#list_upcoming").empty();
			$("#list_unscheduled").empty();
			
			appendToUI(0,ongoing,"#list_ongoing");
			appendToUI(0,upcoming,"#list_upcoming");
			appendToUI(0,unscheduled,"#list_unscheduled");
		}
		
		chrome.storage.onChanged.addListener(listenForChanges);
		$("#loaderBox").css({"display":"none"});
		$("#homeBoxes").css({"display":"block"});


	});

}


function appendToUI(i, list, container){
	console.log("UI",list.length);
	if(i<list.length){
		
		console.log("UI",(list[i]["name"]).toString());
		$.get("../ui/listItem.html", function (data) {
			var item = list[i];
			console.log(item);
			var classname = (item["name"]).toString();
        	($(data).appendTo(container)).addClass(classname);
        	$("." + classname).find("#time").html(item["startTime"]);
        	if(item["description"] != null)
    			$("." + classname).find("#desc").html(item["description"]);
        	else
    			$("." + classname).find("#desc").html("description: N.A.");

        	$("." + classname).find("#source").html("source: " + item["source"]);
    		$("." + classname).find("#url").html(item["url"]);
			$("." + classname).find(".schedule").addClass("checkbox"+ classname);
    		$("." + classname).find(".schedule").prop('checked',item["scheduled"]);
			console.log("delay",item["delay"]);
    		if(item["delay"] < 1 ){
	    		$("." + classname).find("#switchBox").css("display","none");
    		}else{

				$("." + classname).find(".schedule").change(function(){
			        if ($(this).is(':checked')) {
			        	chrome.storage.sync.get(null,function(data){
			        		data[item["date"]][item["name"]]["scheduled"] = true;
			        		createAlarm(item["name"], item["delay"], null); 
			        		chrome.storage.sync.set(data, function(){
			        			showSnackbar("Schedule set");
			        		});
			        	});
			        } else {
			        	chrome.storage.sync.get(null,function(data){
			        		data[item["date"]][item["name"]]["scheduled"] = false;
			        		cancelAlarm(item["name"]);; 
			        		chrome.storage.sync.set(data, function(){
			        			showSnackbar("Schedule cleared");
			        		});
			        	});
			        
			        }
			    });
    		}




			appendToUI(i+1,list,container);
		});
	}
}

function initClient(callback) {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    }).then(function () {
    	callback();
      // Listen for sign-in state changes.
    }, function(error) {
      showSnackbar(JSON.stringify(error, null, 2));
    });
}




function sync_calendar(){
	initClient(function(){
		

		chrome.identity.getAuthToken({interactive: false}, function(token) {
		    // Set GAPI auth token
	      	gapi.auth.setToken({
	        	'access_token': token,
	      	});
	      	var date = $('#date').datepicker({ dateFormat: 'dd,MM,yyyy' }).val();
	      	var today = date.split("-");
			var lowerLimitDate = new Date(today[0],today[1]-1,today[2],0,0,0,0);
			lowerISO = lowerLimitDate.toISOString();
			console.log(lowerISO);

			var upperLimitDate = new Date(today[0],today[1]-1,today[2],0,0,0,0);
			upperLimitDate.setDate(upperLimitDate.getDate()+1);
			upperISO = upperLimitDate.toISOString();
			console.log(upperISO);
			
	        gapi.client.calendar.events.list({
	            'calendarId': 'primary',
	            'timeMin': lowerISO,
	            'timeMax': upperISO,
	            'singleEvents':true	
	        }).then(function(response) {
		        chrome.storage.sync.get(null,function(obj){

		          	var events = response.result.items;
		            console.log(response);
			        console.log(obj);
			        for(var i = 0 ; i< events.length; i++){
			        	if(events[i].conferenceData != null){
			        		var event = events[i];
			        		var name = (event.id).toString();
			        		console.log("s",event.start.dateTime)
			        		var startDateObj = parseISOString(event.start.dateTime);
			        		var date = startDateObj.getFullYear() + "-" +("0" + (startDateObj.getMonth()+1)).slice(-2) + "-" + ("0" + startDateObj.getDate()).slice(-2); 
			        		var startTime = ("0" + startDateObj.getHours()).slice(-2) + ":" + ("0" + startDateObj.getMinutes()).slice(-2);
			        		
			        		console.log("start",startDateObj);
			        		console.log("startD",date);
			        		console.log("startT",startTime);

			        		var endDateObj = parseISOString(event.end.dateTime);
			        		var endTime = ("0" + endDateObj.getHours()).slice(-2) + ":" + ("0" + endDateObj.getMinutes()).slice(-2);

			        		console.log("end",endDateObj);
			        		console.log("endT",endTime);

			        		var description = event.summary;
			        		console.log(startDateObj);
			        		console.log(startTime);
			        		console.log(date);
			        		var url = event.hangoutLink;
			        		
			        		var type = "once";
			        		var source = "google";
			        		
			        		var purpose = "start";
			        		var scheduled = false;
			        		if($.isEmptyObject(obj))
				        		obj = {};
			        		if (!obj.hasOwnProperty(date)) 
			        			obj[date] = {}		
	        				if(!obj[date].hasOwnProperty(name))
	        					obj[date][name] = {}
		        			else{
		        				console.log("name exists")
				        		if(obj[date][name]["purpose"] != null)
				        			purpose = obj[date][name]["purpose"];
				        		if(obj[date][name]["scheduled"] != null)
				        			scheduled = obj[date][name]["scheduled"];
				        	}
			        		var alramobj = getJSONObject(name,startTime,endTime,url,"", date,type,purpose, source, description,scheduled);
			        		console.log(alramobj);
			        		
				        	
			        		obj[date][name] = alramobj;
			        	}		
			        }

			        chrome.storage.sync.set(obj, function(){
			        	console.log("storage set to", JSON.stringify(obj));
			        	fetchLists();
			        });
		        });
	        });
		});
	});
}

function getJSONObject(name,startTime,endTime,url,destinationFile, date,type,purpose, source,description,scheduled){
	var areParametersCorrect = true;  	
	var minutes = calculateDelay(startTime, date);

	if(areParametersCorrect){
		obj =     
			{
				"name":name,
				"startTime": startTime,
				 "endTime":endTime,
				 "url":url,
				 "destinationFile": destinationFile,
				 "type": type,
				 "date":date,
				 "delay": minutes,
				 "purpose": purpose,
				 "source":source,
				 "scheduled": scheduled,
				 "description" : description
				}
			
	} else {
		obj = null;
	}

	return obj;
};

var listenForChanges = function(changes,area){
		console.log("changes",changes);
		console.log("area",area);
		fetchLists();
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]);
}