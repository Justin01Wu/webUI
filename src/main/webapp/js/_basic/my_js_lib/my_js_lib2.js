
// define anonymous object in lib
(function(window) {

	if(window.Justin_JS_LIB34){
		throw new Error("Justin_JS_LIB34 has been registered, you can't register twice");
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

// use my lib
var myObj = Justin_JS_LIB34;
myObj.init({msg :"message from outside"});
myObj.fun1();