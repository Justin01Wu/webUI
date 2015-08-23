
// define anonymous object in lib
(function() {

	if(window.Justin_JS_LIB34){
		if(window.console){
			console.log("Justin_JS_LIB34 has been registered, skip now");
		}
		return;
	}
 
	window.Justin_JS_LIB34 = {};
	var self = window.Justin_JS_LIB34;
	self.Person = function ( settings) {
		if(settings.msg){
			this.msg = settings.msg;
		}
		
		this.sayMsg2 = function(){
			if(window.console){
				console.log("sayMsg2: " + this.msg);
			}			
		};
	};
	
	self.Person.prototype.sayMsg1 = function() { //add prototype method
		if(window.console){
			console.log("sayMsg1: " + this.msg);
		}
	};

})();

