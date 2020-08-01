
// chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
//   // Use the token.
//   console.log(token)
// });

$(document).ready(function(){

  $("#container").load("./addAlarm.html", function(){
  	console.log("Add Alarm Loaded");
  	loadAddAlarm();
  }); 
});





  

