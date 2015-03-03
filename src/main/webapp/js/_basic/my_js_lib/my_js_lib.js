

var myPlugin = (function() {
 var private_var;

 function private_function() {
 	if(window.console){
		console.log("calling private_function");
	}
 }

 return {
    public_function1: function() {
    	if(window.console){
    		console.log("calling public_function1");
    	}
    },
    public_function2: private_function
 }
})();

myPlugin.public_function1();
myPlugin.public_function2();