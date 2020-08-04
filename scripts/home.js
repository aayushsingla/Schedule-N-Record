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
	$("#loaderBox").css({"display":"block"});
	$("#homeBoxes").css({"display":"none"});
	var upcoming = [];
	var ongoing = [];
	var unscheduled = [];
	
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

	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = yyyy + '-' + mm + '-' + dd;

	chrome.storage.sync.get(null, function(object){
		

		console.log(JSON.stringify(object));
		var keys = Object.keys(object);
		console.log(keys.length);
		for(var i=0; i < keys.length;i++){
			var child = object[keys[i]];
			console.log(child);
			console.log(child["date"]);
			console.log(today);
			
			if(child["date"] == today){
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