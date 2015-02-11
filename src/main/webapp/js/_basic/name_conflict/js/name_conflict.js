var status="single";

function printInfo() {
  	var info = document.getElementById('infoLabel');
  	info.innerHTML = info.innerHTML +' <br/> first printInfo= ' + status;
}

var status="married";

function printInfo() {
  	var info = document.getElementById('infoLabel');
  	info.innerHTML = info.innerHTML +' <br/> second printInfo = ' + status;
}

(function() {
    // now I am in a anonymous function, nobody can overwrite me
	setTimeout(function () {
	  	var info = document.getElementById('infoLabel');
		info.innerHTML = info.innerHTML +' <br/> <br/>now I am in a anonymous function, nobody can overwrite me(first anonymous function)  ' ;		
    }, 1000);
	// wait 1 second for DOM ready
	
})();

(function(waitTime) {
    // now I am in a anonymous function, nobody can overwrite me
	setTimeout(function () {
	  	var info = document.getElementById('infoLabel');
		info.innerHTML = info.innerHTML +' <br/> <br/>now I am in a anonymous function, nobody can overwrite me(second anonymous function) ' ;		
    }, waitTime);
	// wait 2 second for DOM ready
	
})(2000);
