/** declare some angularJs filters:  numberUsd, numberComma and numberPercentage
 * Justin Wu
 */

(function() {
	// use anonymous function to avoid JS global variable conflict
	
    'use strict';

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    
    angular.module('filters').filter('numberUsd', function() {
        return function (number, currencyCode) {
        	if(isNaN(number)){
        		return number;
        	} 
        	return "$"+number;
        };
    });

    angular.module('filters').filter('numberComma', function() {
        return function (number, currencyCode) {
        	if(isNaN(number)){
        		return number;
        	}         	
        	return numberWithCommas(number);
        };
    });
    
    
    angular.module('filters').filter('numberPercentage', function() {
        return function (number, currencyCode) {
        	if(!number){
        		return number;
        	}
        	if(isNaN(number)){
        		if(window.console){
        			console.warn(number + " is not a number, so ignore it");
        		}        		
        		return number;
        	}         	
        	return Number(number) * 100;
        };
    });
    
    
}());  // directly run anonymous function 