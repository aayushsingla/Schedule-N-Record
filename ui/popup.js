

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
changeColor.style.backgroundColor = data.color;
changeColor.setAttribute('value', data.color);
});

// turns the background color of the page the same color as the button
changeColor.onclick = function(element) {
	let color = element.target.value;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.executeScript(
	      tabs[0].id,
	      {code: 'document.body.style.backgroundColor = "' + color + '";'});
});
};