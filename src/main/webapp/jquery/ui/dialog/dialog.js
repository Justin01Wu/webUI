(function ($, window, document) {	
    'use strict';
    
    if (window.myDialog) {
        
        return;
    }
    var myDialog = {
    		childContent: null,
    };

    myDialog.loadHtml = loadHtml;
    myDialog.open = open;
    
    window.myDialog =  myDialog;
    
    myDialog.loadHtml();
    
    return;
    
    function loadHtml () {
    	
        var that = this;
        var childHtml = _getCurrentPath() + "dialog_child.html";
        
        if(this.childContent){
        	console.log("already have " + childHtml);
        	return;
        }

        console.log("loading " + childHtml);

        $.get(childHtml, function (data) {
            console.log("got " + childHtml);
            that.childContent = data;
            
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = that.childContent;            
            document.body.appendChild(tempDiv);
            
        });

    };
    
    function open () {    

        var self = this;        

        jQuery("#testDialog").dialog({
            height: 280,
            width: 400,
            closeOnEscape: true,
            modal: true,
            closeText: "cancel",
            
            open: function () {
            	
            	console.log("dialogbox is opened");
         
            	// this version of jQuery UI always focus on the close icon, which has a weird blue box on it(chrome) or dot line on it(in IE)
            	// so removing focus on it
            	// the idea comes from http://stackoverflow.com/questions/1793592/jquery-ui-dialog-button-focus 
            	jQuery(this).closest( ".ui-dialog" ).find(":button").blur();
            }
        });
        
        self.init  = true;
    };
    
    function _getCurrentPath() {
        var scripts = document.getElementsByTagName("script");
        var currentFile = scripts[scripts.length - 1].src;
        var currentPath = currentFile.substr(0, currentFile.lastIndexOf('/')) + "/";
        return currentPath;
    }
    
})(jQuery, window, document);