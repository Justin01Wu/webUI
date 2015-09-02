
// This library define name space VCache and related utilities like VCache.put, VCache.get, VCache.clear...
// the current implementation is on frame set header, if it doesn't exist, then will fall back into html5 session storage
// by Justin Wu

if (!window.console) {
    window.console = {
        log: function () {
        },
        warn: function () {
        },
        error: function () {
        }
    };
}


(function () {
    'use strict';

    if (window.VCache) {
        return;
    }

    window.VCache = {};
    
    var self = window.VCache;
    
    Object.defineProperty(self, "DefaultCacheTime", {
		value: 900,  // 15 miutes
		writable: false
	});


    self.put = function (obj, seconds, key) {
    	if(!key){
    		key = getKey();
    	}
    	var expires;
    	if(seconds){
    		var ts = new Date();
    		expires = ts.getTime() + seconds*1000;
    	}
    	
    	if(parent && parent.ifrHeader && parent.ifrHeader.CACHE){
        	var wrapper = {
        			ts: expires,
        			obj:obj
        	}
        	
        	parent.ifrHeader.CACHE[key] = wrapper;
        	
    		return true;   
    	}else{
    		return self._putInSessionStorage(obj, expires, key);
    	}        
    };
    
    self._putInSessionStorage = function (obj, expires, key) {  
    	var wrapper = {
    			ts: expires,
    			obj:obj
    	}
        var objStr = JSON.stringify(wrapper);
    	
		try {
			sessionStorage.setItem(key, objStr);	
			return true;
		} catch (E) {
			return false;
		}
    }
    
    self.get = function ( key ) {  
    	if(!key){
    		key = getKey();
    	}
    	if(parent && parent.ifrHeader && parent.ifrHeader.CACHE){
    		var wrapper = parent.ifrHeader.CACHE[key] ;
    		if(!wrapper){
    			return null;
    		}
    		return returnIfNotExpire(wrapper, key);
    	}else{
    		return self._getFromSessionStorage(key);
    	}
   	
    };
    

    
    self._getFromSessionStorage = function ( key ) {  
        if (sessionStorage.getItem(key)) {
            var objStr = sessionStorage.getItem(key);
            var wrapper = JSON.parse(objStr);
            
            return returnIfNotExpire(wrapper, key);
            
        } else {
            return null;
        } 
    }

    self.clear = function ( ) {  
    	if(parent && parent.ifrHeader && parent.ifrHeader.CACHE){
    		parent.ifrHeader.CACHE = {};
    	}else{
    		sessionStorage.clear();	
    	}        
    };

    self.size = function ( ) {
    	if(parent && parent.ifrHeader && parent.ifrHeader.CACHE){
    		return Object.keys(parent.ifrHeader.CACHE).length;
    	}else{
    		return sessionStorage.length;	
    	}
        
    };
    
 // this is short way to save field value into cache
    self.saveField  =  function(fieldId, expires){
    	var myExpires = expires? expires : self.DefaultCacheTime;  // default is 10 minutes
		var cacheKey =  getKey() + "#" + fieldId;
    	var targetField = document.getElementById(fieldId);
    	if(!targetField){
    		console.warn("can't find " + fieldId);	
    		return false;
    	}        
       	
    	//console.log('save '+ fieldId + 'into cache ' + cacheKey);
    	if(targetField.type === "text" || targetField.type === "hidden"){
    		VCache.put(targetField.value, myExpires, cacheKey);
    		return true;
       	}else if(targetField.type === "select-one"){
       		var cacheObj ={
       			selectedIndex: targetField.selectedIndex,
       			options:[]
       		}
       		for(var i=0; i< targetField.options.length; i++){
       			var oneOption = {
       				value: 	targetField.options[i].value,
       				text:	targetField.options[i].text
       			}
       			
       			cacheObj.options.push(oneOption);
       		}
       		VCache.put(cacheObj, myExpires, cacheKey);   	
       		return true;
       	}else {
       		console.warn("don't know this type, so ignore it:  " + fieldId);
       		return false;
       	}
       		
	},
    
    // this is short way to get field value from cache
	// it will return true if the field is restored from cache
    self.getField = function (fieldId){
		var cacheKey =  getKey() + "#" + fieldId;
    	var targetField = document.getElementById(fieldId);
    	if(!targetField){
    		console.warn("can't find " + fieldId);	
    		return false;
    	}
    	var cacheObj = VCache.get(cacheKey);   
        if(cacheObj){
        	//console.log('get ' + fieldId + ' from cache ' + cacheKey);
        	
        	if(targetField.type === "text" || targetField.type === "hidden"){            		
        		targetField.value = cacheObj;
           		return true;
           	}else if(targetField.type === "select-one"){
           		targetField.options.length = 0;
           		for(var i=0; i< cacheObj.options.length; i++){
               		var option = new Option(cacheObj.options[i].text, cacheObj.options[i].value);
               		targetField.add(option, targetField.options.length);  // append to the end               		
           		}
           		targetField.selectedIndex = cacheObj.selectedIndex;  // TODO check if out of range
           		return true;
           	}else {
           		console.warn("don't know this type, so ignore it:  " + fieldId);
           	}
        }            
        return false;
	}
    
    return;
    
    function getKey() {
        var key = window.location.pathname;
        return key;
    }
    
    function returnIfNotExpire ( wrapper, key ) {
        if(!wrapper.ts){
        	return wrapper.obj;	
        }else{
    		var now = new Date();
    		if(now.getTime() > wrapper.ts){
    			// expired
    			if(parent && parent.ifrHeader && parent.ifrHeader.CACHE){
    				delete parent.ifrHeader.CACHE[key]; 
    			}else{
    				sessionStorage.removeItem(key);	
    			}
    			
    			return null;
    		}else{
    			return wrapper.obj;
    		}
        }

    }


})();

