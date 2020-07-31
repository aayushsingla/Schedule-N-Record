 

//called when extnsion is fully loaded in browser

  	
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
    	console.log('The color is green.');
  	});

    chrome.pageAction.show(tabId);
});


/*
* object alarm:
*	type   property-name 
*	
*	string name             Name of this alarm.(start/stop + id in our case)
*	double scheduledTime    Time at which this alarm was scheduled to fire, in milliseconds past the epoch 
*	double periodInMinutes  If not null, the alarm is a repeating alarm and will fire again in periodInMinutes minutes.
*/

chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Got an alarm!", alarm);

  // need to start/stop recording here and open or exit tabs based on 
  // the alarm type

});