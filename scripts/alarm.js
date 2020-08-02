
/*
* createAlarm:
* type   property-name 
* 
* string alarmName        Name of this alarm.("appName".start/stop.id  in our case)
* double delayInMinutes   Time at which this alarm was scheduled to fire, in milliseconds past the epoch 
*/

 function createAlarm(alarmName, delayInMinutes, periodInMinutes) {
 	var alarmInfo = {"delayInMinutes": delayInMinutes};
	chrome.alarms.create(alarmName.toString(), alarmInfo);
 }


/*
* cancelAlarm:
* type   property-name 
* string alarmName        Name of the alarm to cancel.("appName".start/stop.id  in our case)
*/

 function cancelAlarm(alarmName) {
   chrome.alarms.clear(alarmName);
 }
