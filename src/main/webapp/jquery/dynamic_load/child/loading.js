/*
 * dependents on jQuery
 */

(function($, window, document, undefined) {

	function getCurrentPath() {
		// how to get current path for running JS code
		// this skill comes from
		// http://stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code
		var scripts = document.getElementsByTagName("script");
		var currentFile = scripts[scripts.length - 1].src;
		var currentPath = currentFile.substr(0, currentFile.lastIndexOf('/'))	+ "/";
		return currentPath;
	}

	var childHtml = getCurrentPath() + "child.html";

	console.log(childHtml);
	
	var info = document.getElementById('infoLabel');
	info.innerHTML = info.innerHTML +' <br/> loading file:' + childHtml;  

	$.get(childHtml, function(data) {
		
		//alert("Load was performed.");
		var info = document.getElementById('infoLabel');
		info.innerHTML = info.innerHTML +' <br/> loaded file:' + childHtml;
		
		$(".result").html(data);

	});
	

})(jQuery, window, document);