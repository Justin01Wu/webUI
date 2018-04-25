/**
 *  large text file processor: it can handle very large text file, like 1GB file
 *  it depends on ES5 FileReader
 *  it assumes text file is using new line (support both UNIX new line and windows new line)  as new record starting
 *  it needs a customized validator and file to start
 *  it will call back the validator every trunk size data
 *  By default, trunk size is 150k, but you can override it, 
 *  browser will crash if the trunk size is too big, like 500k 
 *  
 *  -- Justin Wu
 * 
 */
;(function(window, undefined) {
	'use strict';	
	
	if (!window.console) {
		window.console = {
			log : function() {},
			warn : function() {},
			error : function() {}
		};
	}
	
	var largeTextFileProcessor={
			CHUNK_SIZE : 152400, 
			hasMore : true,
			offset : 0,
			offsetAdjust : 0,    // we don't know if the last line is cut, so use this to remove the last line length
			count: 0,   // how many times we call file.slice
			fileReafer : new FileReader(),

			file: null,
			startTime: null,
			endTime: null,
			totalSecond: null,
			validator: null,
			percentage: null,
			init : false,
			
			process: function(file, validator) {
				this.file = file;
				this.init = true;
				this.startTime = new Date();
				this.validator = validator;
				this.cutFile();
			},
				
			cutFile: function() {
				if(!this.init){
					return;
				}		
				var that = this;
				
			    this.fileReafer.onload = function(progressEvent) {
			    	//console.log(fileReafer.result);
			    	var fileContent = that.fileReafer.result;
			        var lines = fileContent.split('\n');  // if it is a windows file, the remaining \r will become a white space, and will be trimmed later 
			        
			        that.offsetAdjust = lines[lines.length-1].length;   // we don't know if the last line is cut, so use this to remove the last line length 
			        that.offset = that.offset - that.offsetAdjust ;
			        if(that.validator){
			        	lines.pop();// we don't know if the last line is cut, so skip the last line		        
			        	that.validator(lines);
			        }
			    	
			    	if( that.hasMore ){		    		
			    		setTimeout(function(){
			    			that.handleSlice();
			    	    }, 0);  
			    	}else{
			    		that.endTime = new Date();
			    		that.totalSecond = (that.endTime.getTime() - that.startTime.getTime())/1000;
			    		console.log("totalSecond= " + that.totalSecond);
			    		
			    	}
			    };

				this.handleSlice();  

			},
			
			handleSlice: function(){
				if(!this.init){
					return;
				}
				this.count++;
				//console.log("   " );
				//console.log("  ====== "  );
				if(this.count%100===0){
					console.log("offset= " + this.offset);	
				}
				//console.log("  count= " + count  + " offset= " + offset);
				
				var slice = this.file.slice(this.offset, this.offset + this.CHUNK_SIZE);
				this.percentage = this.offset/this.file.size;
				this.hasMore = slice.size === this.CHUNK_SIZE;
				this.offset = this.offset + slice.size;		
				this.fileReafer.readAsText(slice, 'ISO-8859-1');

			}
		}
	
	window.largeTextFileProcessor = largeTextFileProcessor;

	
})(window);