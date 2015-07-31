// define anonymous object in lib
(function(window) {

	"use strict"

	/*
	 * MyJs3 CLASS DEFINITION ======================
	 */
	
	if(window.MyJs3){
		if(window.console){
			console.log("MyJs3 has been registered, skip now");
		}
		return;
	}
	
	var MyJs3 = function(options) {
		this.options = {};
		if(options && options.id){
			this.options.id = options.id;	
		}
		
	};

	MyJs3.prototype = {

		constructor : MyJs3,

		toggle : function() {
		},

		show : function() {
			var that = this;
			if(that.options.id){
				var target = document.getElementById(that.options.id);
				if(target){
					var msg = 'find target  Element by Id: ' + that.options.id; 
					if(that.options.callBack){
						that.options.callBack(msg);
					}else{
						alert(msg);
					}
				}				
			}

		}
	}
	
	window.MyJs3= MyJs3;

	/*
	 * MyJs3 PRIVATE METHODS =====================
	 */

	function _getCurrentPath() {
		var scripts = document.getElementsByTagName("script");
		var currentFile = scripts[scripts.length - 1].src;
		var currentPath = currentFile.substr(0, currentFile.lastIndexOf('/')) + "/";
		return currentPath;
	}

})(window);
