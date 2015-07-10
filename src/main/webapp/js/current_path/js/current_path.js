


function getJSPath() {
	// how to get current path for running JS code
	// this skill comes from 
	// http://stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code  
	var scripts = document.getElementsByTagName("script");
	var currentFile = scripts[scripts.length-1].src;
	//console.log("currentFile=" + currentFile);	
	return currentFile;
	
}


function getContextPath() {
	
	if( "file:" === window.location.protocol){			

		//var docUrl = document.URL;
		var docUrl = window.location.href;  
		// IE will return \ as separator in document.URL, so use window.location.href to replace it
		
		var separator = "src/main/webapp";
		var res = docUrl.split(separator, 2);
		var contextPath = res[0] + separator ;
		return contextPath;	
	}else{
		var secondSlashLoc = window.location.pathname.indexOf("/",2);
		var contextPath =  window.location.pathname.substring(0, secondSlashLoc);
		return contextPath;	
	}	
	
}

function load(){
	var currentFile = getJSPath(); 
	
	var info = document.getElementById('infoLabel');
	info.innerHTML = info.innerHTML +' <br/>JavaScript path is ' + currentFile;

	currentFile = getJSPath2();
	var info = document.getElementById('infoLabel');
	info.innerHTML = info.innerHTML +' <br/>JavaScript path is ' + currentFile;

	
	var contextPath = getContextPath();
	info.innerHTML = info.innerHTML +' <br/>Context Path is ' + contextPath;

	info.innerHTML = info.innerHTML +' <br/>Document Path is ' + document.URL;	
}


