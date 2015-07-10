


function getJSPath2() {
	// how to get current path for running JS code
	// this skill comes from 
	// http://stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code  
	var scripts = document.getElementsByTagName("script");
	var currentFile = scripts[scripts.length-1].src;
	//console.log("currentFile=" + currentFile);	
	return currentFile;
	
}




