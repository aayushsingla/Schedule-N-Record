	"use strict";
	import * as puppeteer from "../scripts/puppeteer.js"
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

	  	var alarmName = alarm["name"];
	  	console.log(alarmName);
		chrome.storage.sync.get(null, function(data) {
			console.log('Storage retreived' + data);
			var result;
			var keys = Object.keys(data);
			for(var i =0; i < keys.length;i++){
				if(data[keys[i]][alarmName] != null){
					result = data[keys[i]][alarmName];
					break;
				}
			}

			console.log(result["url"]);

			var type = result["type"];
			console.log("type "+type);

			var purpose = result["purpose"];
			console.log("purpose "+purpose);

			var endTime = result["endTime"];
			console.log("endTime "+endTime);	
			
			var date = result["date"];

			if(purpose == "start"){
				
				if(type == "once"){
					console.log("date "+date);

					var createProperties = {
						"url": result["url"]
					};
					var tabId = 0;
					chrome.tabs.create(createProperties, function(tab){
						tabId = tab.id;
						console.log("Tab Created!!" + tabId);

						var minutesDelay  = calculateDelay(endTime, date);
						chrome.alarms.create(alarmName.toString(), {"delayInMinutes": minutesDelay});
						
						result["purpose"] = "stop";
						result["delay"] = minutesDelay;
						result["tabId"] = tabId;
						data[date][alarmName] = result;
						console.log("result final upload "+ JSON.stringify(data));

						chrome.storage.sync.set(data, function() {
			    		
					    	console.log('Storage set to' + JSON.stringify(data));
					    	setTimeout(function(){ 
						  		var constraints = {
						            audio: true,
						            video: true,
						            videoConstraints: {
						                mandatory: {
						                    chromeMediaSource: 'tab',
						                    maxWidth: 3840,
						                    maxHeight: 2160
						                }
						            },audioConstraints:  {
						               mandatory: {
						                    echoCancellation: true
						                }
						            }	
					        	};

					        	chrome.tabs.executeScript(tabId,
								{code:"var x =document.getElementsByClassName('Ce1Y1c');if(!(x.length == 0)){x[0].click();}"
								 + "var x =document.getElementsByClassName('l4V7wb Fxmcue');x[0].click();"});
					    	

								 startRecording();
					    	}, 10000);
					    
					    		
					    });

					});
				}
			

			}else if(purpose == "stop"){
				var tabId = result["tabId"];
				data[date]["purpose"] = "start";
                chrome.storage.sync.set(data ,function(){
                       console.log("data after alarm removal",data)
                       console.log("Alarm Removed");
                 });

				chrome.tabs.remove(tabId, function(){
					console.log("Tab Removed!!!");
				});
			}
		});

	  // need to start/stop recording here and open or exit tabs based on 
	  // the alarm type

	});


	//called when extnsion is fully loaded in browser







/*
	<TODO:>
	Don't forget to cancel all alarms when storage is cleared or extension is uninstalled
*/
async function startRecording() {
	  // const browserURL = 'http://127.0.0.1:21222';
	  // const browser = await puppeteer.connect({browserURL});
	  // const extBackgroundTarget = await puppeteer.Browser.waitForTarget(t => t.type() === 'background_page')
	  // const extBackgroundPage = await extBackgroundTarget.page()

	  // // load a page from which to click browser action, make it the active tab
	  // const someOtherPage = await browser.newPage()
	  // await someOtherPage.goto('https://aayushsingla.github.io')
	  // await someOtherPage.bringToFront()

	  // // evaluate chrome object in context of background page:
	  // await extBackgroundPage.evaluate(() => {
	  //   chrome.tabs.query({ active: true }, tabs => {
	  //     chrome.browserAction.onClicked.dispatch(tabs[0]);
	  //   })
	  // })
	// console.log("started capturing");	
	// 			chrome.tabCapture.capture(constraints, function(stream){
	// 				console.log("capturing finished");
	//  	        		gotTabCaptureStream(stream, constraints);
	//  		});/ body...
	}

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


function gotTabCaptureStream(stream, constraints) {
    if (!stream) {
        chrome.runtime.reload();
        return;
    }

    var newStream = new MediaStream();
    stream.getTracks().forEach(function(track) {
        newStream.addTrack(track);
    });

    playCapturedStream(stream);
    // saveVideoStream(newStream);

    // gotStream(newStream);
}


function initVideoPlayer(stream) {
    var videoPlayer = document.createElement('video');
    videoPlayer.muted = !enableTabCaptureAPI;
    videoPlayer.volume = !!enableTabCaptureAPI;
    videoPlayer.srcObject = stream;

    videoPlayers.push(videoPlayer);
};

function saveVideoStream(stream){

};

