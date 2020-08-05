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
	
	var upcoming = [];
	var ongoing = [];
	var unscheduled = [];
	$("#list_ongoing").empty();
	$("#list_upcoming").empty();
	$("#list_unscheduled").empty();
	console.log(upcoming.toString());
	console.log(ongoing.toString());
	console.log(unscheduled.toString());

	fetchLists(upcoming,ongoing,unscheduled);
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


function fetchLists(upcoming,ongoing,unscheduled){
	var date = $('#date').datepicker({ dateFormat: 'dd,MM,yyyy' }).val();
	console.log("abc",date);

	chrome.storage.sync.get(null, function(object){
		

		console.log(JSON.stringify(object));
		var keys = Object.keys(object);
		console.log(keys.length);
		for(var i=0; i < keys.length;i++){
			var child = object[keys[i]];
			console.log(child);
			console.log(child["date"]);
			
			if(child["date"] == date){
				if(child["source"] == "custom"){
					console.log(child);
					if(child["purpose"] == "start"){
						console.log(child);
						upcoming.push(child);
					}else{
						console.log(child);
						ongoing.push(child);
					}

				}else{
					console.log(child);
					unscheduled.push(child);
				}
			}
		}

		appendToUI(0,ongoing,"#list_ongoing");
		appendToUI(0,upcoming,"#list_upcoming");
		appendToUI(0,unscheduled,"#list_unscheduled");
		$("#loaderBox").css({"display":"none"});
		$("#homeBoxes").css({"display":"block"});


	});

}


function appendToUI(i, list, container){
	console.log("UI",list.length);
	if(i<list.length){
		
		console.log("UI",(list[i]["name"]).toString());
		$.get("../ui/listItem.html", function (data) {
        	($(data).appendTo(container)).addClass(list[i]["name"]);
			appendToUI(i+1,list,container);
		});
	}

}