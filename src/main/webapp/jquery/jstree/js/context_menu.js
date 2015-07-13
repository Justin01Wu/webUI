		var layerData =  [ 
            {
 				id : 11,
				text : 'Simple root node(customized icon)',
				type: "boss"

            },
			{
				"id" : 22,
				'text' : 'Root node 2',				
				'state' : 
				{
					'opened' : true,
					'selected' : true
				},
				'children' : 
					[ 
					{					
						"id" : 2211,
						'text' : 'Child 1',
						a_attr : 
						{
							title : "child 1 title"
						}
					}, 
					'Child 2' 
					]
			} ]
		;

	    var contextMenu ={
	        "items": function ($node) {
	            return {
	                "Create4": {
	                    "label": "Create a new employee",
	                    "action": function (obj) {
	                      	var info = document.getElementById('infoLabel');
	                      	info.innerHTML = info.innerHTML +' <br/> click ' + obj.item.label + ' on ' + obj.reference[0].text;
	                    }
	                },
	                "Rename7": {
	                    "label": "Rename an employee",
	                    "action": function (obj) {
	                      	var info = document.getElementById('infoLabel');
	                      	info.innerHTML = info.innerHTML +' <br/> click ' + obj.item.label + ' on ' + obj.reference[0].text; 
	                    }
	                },
	                "Delete9": {
	                    "label": "Delete an employee",
	                    "action": function (obj) {
	                      	var info = document.getElementById('infoLabel');
	                      	info.innerHTML = info.innerHTML +' <br/> click ' + obj.item.label + ' on ' + obj.reference[0].text;
	                    }
	                }
	            };
	        }
	    }
	    
	    function _getCurrentPath() {
	    	var currentFile;
	    	if (document.currentScript) {
	    		currentFile = document.currentScript.src;
	    	}else{
		        var scripts = document.getElementsByTagName("script");
		        currentFile = scripts[scripts.length - 1].src;
	    	}
	        var currentPath = currentFile.substr(0, currentFile.lastIndexOf('/')) + "/";
	        return currentPath;
	    }
	    
	    
	    var currentPath =  _getCurrentPath();
	    
        var types = {
            boss: {
                "icon": currentPath + "../image/boss.jpg"
            }
        };
		
		var landingEle = $('#using_json');
	    
	    landingEle.bind('loaded.jstree', function(e, data) {
		    // invoked after jstree has loaded
		    //$(this).jstree("open_node", $(nodes[i]));
          	var info = document.getElementById('infoLabel');
          	info.innerHTML = info.innerHTML +' <br/> jsTree now is loaded ' ;
		});
	    
	    landingEle.bind('ready.jstree', function(e, data) {
          	var info = document.getElementById('infoLabel');
          	info.innerHTML = info.innerHTML +' <br/> jsTree now is ready ' ;         
          	
          	// add title on 'Root node 2', which id is 22
          	var id = layerData[1].id;
          	landingEle.find("#"+id).attr("title", "added by ready.jstree event");
        });
	    
	    
	    // for jsTree data format details, please see http://www.jstree.com/docs/json/
        var jsTreeInitObj = {
            core: {
            	animation: 0,
                data: layerData
            },
			"plugins": [ "contextmenu",  // this line enable jsTree default context menu 
			             "types"],       // this will enable customize icon
			"contextmenu": contextMenu,	// this line customize   context menu
			"types": types
			
        };
        
	    // finally we create jsTree
	    landingEle.jstree(jsTreeInitObj);
	    

		// this will be triggered when mouse hover on
	    $("#using_json").bind("hover_node.jstree", function (e, data) {
	    	//alert(data.node.text);
	    	//var info = document.getElementById('infoLabel');
	    	//info.innerHTML = info.innerHTML +' <br/> move into  ' + data.node.text  ;
	    	if(window.console){
	    		console.log(' move into  ' + data.node.text  );
	    	}
	    	
	    })