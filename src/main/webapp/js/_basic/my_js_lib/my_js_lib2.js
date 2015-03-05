
// define anonymous object in lib
(function(window) {

	if(window.Justin_JS_LIB34){
		if(window.console){
			console.log("Justin_JS_LIB34 has been registered, skip now");
		}
		return;
	}
 
	window.Justin_JS_LIB34 = {};
	var self = window.Justin_JS_LIB34;
	self.init = function ( settings) {
		if(settings.msg){
			self.msg = settings.msg;
		}
	};
	
	self.fun1 =function() {
		 	if(window.console){
				console.log(self.msg);
		 	}
	};

})(window);

