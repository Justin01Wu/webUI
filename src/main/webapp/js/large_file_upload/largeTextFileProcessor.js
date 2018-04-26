/**
 *  large text file processor: it can handle very large text file, like 1GB file
 *  it depends on ECMAScript5 FileReader
 *  it assumes text file is using new line (support both UNIX new line and windows new line)  as new record starting
 *  it needs a customized callBack function and file to start
 *  it will call back the callBack function every trunk size data
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
	
    function LargeTextFileProcessor(file, callBack) {
        
    	this._init();
    	
        if (file) {
        	if (File.prototype.isPrototypeOf(file)) {
                    this.file = file;
             }else{
                    throw new Error("first parameter is not a File");
            }                
        }else{
          	throw new Error("please pass me file as first parameter");
        }
        
        if (callBack) {
            if (typeof callBack === 'function') {
                this.callBack = callBack;
            }else{
                throw new Error("second parameter callBack is not a function");
            }
        }
    }
    
    function start(){
    	this.startTime = new Date();
    	this.init = true;
    	this._cutFile();
    }
    LargeTextFileProcessor.prototype.start = start;    
	
    function _init(){
        //this.CHUNK_SIZE = 152400;  // 150k
        this.CHUNK_SIZE = 307200;  // 300k
        this.hasMore = true;
        this.offset = 0;
        this.offsetAdjust = 0;    // we don't know if the last line is cut, so use this to remove the last line length
        this.count = 0;           // how many times we call file.slice
        this.fileReafer = new FileReader();
        this.file = null;
        this.startTime = null;
        this.endTime = null;
        this.totalSecond = null;
        this.callBack = null;
        this.percentage = null;
        this.init = false;
    	
    }
    
    LargeTextFileProcessor.prototype._init = _init;    

    function _cutFile(){
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
	        if(that.callBack){
	        	lines.pop();// we don't know if the last line is cut, so skip the last line		        
	        	that.callBack(lines);
	        }
	    	
	    	if( that.hasMore ){		    		
	    		setTimeout(function(){
	    			that._handleSlice();
	    	    }, 0);  
	    	}else{
	    		that.endTime = new Date();
	    		that.totalSecond = (that.endTime.getTime() - that.startTime.getTime())/1000;
	    		console.log("totalSecond= " + that.totalSecond);
	    		
	    	}
	    };

		this._handleSlice();    	
    }
    
    LargeTextFileProcessor.prototype._cutFile = _cutFile;
    
    function _handleSlice(){
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
    
    LargeTextFileProcessor.prototype._handleSlice = _handleSlice;			
		
	window.LargeTextFileProcessor = LargeTextFileProcessor;

	
})(window);