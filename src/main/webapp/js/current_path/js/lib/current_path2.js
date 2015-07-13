

	function getJSPath3() {
		// how to get current path for running JS code
		// this skill comes from 
		// http://stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code  
		if (document.currentScript) {
		    return document.currentScript.src;
		} else {
		    var scripts = document.getElementsByTagName('script');		
			var currentFile = scripts[scripts.length-1].src;
			return currentFile;
		}		
	}
	
(function() {

	function getJSPath2() {
		// how to get current path for running JS code
		// this skill comes from 
		// http://stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code  
		if (document.currentScript) {
		    return document.currentScript.src;
		} else {
		    var scripts = document.getElementsByTagName('script');		
			var currentFile = scripts[scripts.length-1].src;
			return currentFile;
		}	
		
	}
	
	var currentFile = getJSPath2();
	var info = document.getElementById('infoLabel');
	info.innerHTML = info.innerHTML +' <br/>JavaScript path (1)  is ' + currentFile;
	
	var currentFile = getJSPath3();
	var info = document.getElementById('infoLabel');
	info.innerHTML = info.innerHTML +' <br/>JavaScript path (2) is ' + currentFile;
 
})();





