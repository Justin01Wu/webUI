describe('test cacheService.js', function () {

    it("test DefaultCacheTime is read only", function () {

    	'use strict';

    	expect(VCache.DefaultCacheTime).toEqual(900);
    	
        expect( function(){ 
        	VCache.DefaultCacheTime=300;
        }).toThrow();

    });

    it("test silent failure if change DefaultCacheTime without strict mode", function () {

    	expect(VCache.DefaultCacheTime).toEqual(900);
    	
       	VCache.DefaultCacheTime=300;
       	
    	expect(VCache.DefaultCacheTime).toEqual(900);  // still old value    	

    });
    

    it("test saved object tree is retrieved and exact the same", function () {

        var objA = {
            ddd: "dfd",
            ccc: {
                fff: "ggg"
            }
        };

        
       	var success = VCache.put(objA);
       	expect(success).toEqual(true);
       	
        var objB = VCache.get();

        expect(objA.ddd).toEqual(objB.ddd);
        expect(objA.ccc.fff).toEqual(objB.ccc.fff);

        expect(JSON.stringify(objA)).toEqual(JSON.stringify(objB));


    });

    it("test saved object tree twice will overwrite old obj", function () {

        var objA = {       ddd: "eee"    };
        var objC = {       jjj: "hhh"    };

       	var success = VCache.put(objA);
       	expect(success).toEqual(true);
        
        VCache.put(objC);
        var objB = VCache.get();

        expect(objC.jjj).toEqual(objB.jjj);        
        expect(JSON.stringify(objC)).toEqual(JSON.stringify(objB));

    });
    
    it("test saved object on specific key", function () {

        var objA = {       ddd: "eee"    };

        VCache.clear();
        var previousSize = VCache.size();
       	var success = VCache.put(objA, "MySpecKey");
       	var currentSize = VCache.size();
       	
       	expect(success).toEqual(true);
       	
       	expect(currentSize).toEqual(previousSize +1 );
        
        var objB = VCache.get();

        expect(objA.ddd).toEqual(objB.ddd);        
        expect(JSON.stringify(objA)).toEqual(JSON.stringify(objB));

    });

    it("test cacheService can save array directly", function () {

        var objA = ["aaaa", "bbb", "ccc"];
       	
        var success = VCache.put(objA);
       	expect(success).toEqual(true);
       	
        var objB = VCache.get();

        expect(JSON.stringify(objA)).toEqual(JSON.stringify(objB));


    });

    it("test cacheService can save large data", function () {

        var objA = [];
        for (var i = 0; i < 50000; i++) {
            var str1 = "I am 64 bytes string,I am 64 bytes string,I am 64 bytes string.";
            objA.push(str1);
        }
        // bigArray size = 50000*64 =  3.2M

       	var success = VCache.put(objA);
       	expect(success).toEqual(true);
       	
        var objB = VCache.get();
        expect(JSON.stringify(objA)).toEqual(JSON.stringify(objB));


    });


    it("test cacheService can delete ALL saved data", function () {

        var objA = {ddd: "eee"};
        var objC = {ddd: "eee"};
        
        VCache.put(objA);
        VCache.put(objC, null, "keyC");
        VCache.clear();
        
        var objB = VCache.get();
        expect(objB).toEqual(null);
        
        var objD = VCache.get();        
        expect(objD).toEqual(null);

    });

    it("test cacheService can save object by customized key", function () {

        var objA = {ddd: "eee"};

        VCache.put(objA, null, "keyA");
        var objB = VCache.get();
        expect(objB).toEqual(null);
        
        objB = VCache.get("keyB");
        expect(objB).toEqual(null);
        
        objB = VCache.get("keyA");
        expect(JSON.stringify(objA)).toEqual(JSON.stringify(objB));

    });

    
    it("test cacheService will return false if data is too large", function () {

        var objA = [];
        for (var i = 0; i < 90000; i++) {
            var str1 = "I am 64 bytes string,I am 64 bytes string,I am 64 bytes string.";
            objA.push(str1);
        }
        // bigArray size = 90000*64 =  5.76M

       	var success = VCache.put(objA);
       	expect(success).toEqual(false);
       	
        var objB = VCache.get();
        expect(objB).toEqual(null);


    });
    
    it("test cacheService can restore saved text Field", function () {

    	var fieldIdStr = "textTestField";
    	var textField = document.getElementById(fieldIdStr);
    	expect(textField).not.toEqual(null);
    	expect(textField.value).toEqual("initValue");
       	var success = VCache.saveField(fieldIdStr);
       	expect(success).toEqual(true);
       	
       	textField.value="newValue";

       	success = VCache.getField(fieldIdStr);
       	expect(success).toEqual(true);
       	expect(textField.value).toEqual("initValue");  // value is reset by cache value


    });
    
    it("test cacheService can restore saved select Field", function () {

    	var fieldIdStr = "selectTestField";
    	var selectField = document.getElementById(fieldIdStr);
    	expect(selectField).not.toEqual(null);
    	expect(selectField.options.length).toEqual(4);
    	expect(selectField.selectedIndex).toEqual(1);
    	expect(selectField.options[0].value).toEqual("0");
    	expect(selectField.options[0].text).toEqual("str0");
    	
       	var success = VCache.saveField(fieldIdStr);
       	expect(success).toEqual(true);
       	
       	selectField.selectedIndex = 2;  //  set another option
       	selectField.options.length = 3;  // remove last option
       	selectField.options[0].value = 99;  // change one option
       	selectField.options[0].text = "str99";  // change one option text

       	success = VCache.getField(fieldIdStr);
       	expect(success).toEqual(true);

    	expect(selectField.options.length).toEqual(4);
    	expect(selectField.selectedIndex).toEqual(1);
    	expect(selectField.options[0].value).toEqual("0");
    	expect(selectField.options[0].text).toEqual("str0");


    });    
    
    
    // disabled this test case because it need to wait, 
    xit("test saved object can only survive specified seconds", function(done) {
        
    	var objA = {       ddd: "eee"    };
        var flag;

        VCache.clear();
        var previousSize = VCache.size();
        var success  = VCache.put(objA, 1);       	
       	expect(success).toEqual(true);
       	
       	var currentSize = VCache.size();       	
       	expect(currentSize).toEqual(previousSize +1 );

        var objB = VCache.get();         
        expect(JSON.stringify(objA)).toEqual(JSON.stringify(objB));
         
    	setTimeout(function(){
    		var objC = VCache.get();     
    		expect(objC).toEqual(null);
    		var currentSize = VCache.size();
    		expect(currentSize).toEqual(previousSize  );  // expired obj will be deleted
    		  
    		console.log("in setTimeout...");
    	    done(); // call this to finish off the it block
    	  }, 1100);

    });


});









