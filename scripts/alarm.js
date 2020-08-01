
/*
* createAlarm:
* type   property-name 
* 
* string alarmName        Name of this alarm.("appName".start/stop.id  in our case)
* double delayInMinutes   Time at which this alarm was scheduled to fire, in milliseconds past the epoch 
* double periodInMinutes  (optional) the alarm is a repeating alarm and will fire again in periodInMinutes minutes.
*/

 function createAlarm(alarmName, delayInMinutes, periodInMinutes) {
   chrome.alarms.create(alarmName, {
     delayInMinutes: delayInMinutes, periodInMinutes: periodInMinutes});
 }


/*
* cancelAlarm:
* type   property-name 
* string alarmName        Name of the alarm to cancel.("appName".start/stop.id  in our case)
*/

 function cancelAlarm(alarmName) {
   chrome.alarms.clear(alarmName);
 }
